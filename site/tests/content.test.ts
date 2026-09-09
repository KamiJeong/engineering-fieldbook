import { test, expect, afterEach } from "bun:test";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  rm,
  symlink,
  readdir,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { collect, entry } from "../scripts/content";
import { writePages } from "../scripts/build";
import { render } from "../src/server";
import { site, documentUrl, normalizeBase } from "../config";
import { search } from "../src/search";
const temporary: string[] = [];
afterEach(async () => {
  for (const p of temporary.splice(0))
    await rm(p, { recursive: true, force: true });
});
async function fixture(files: Record<string, string>) {
  const root = await mkdtemp(path.join(tmpdir(), "fieldbook-test-"));
  temporary.push(root);
  for (const [name, text] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, name)), { recursive: true });
    await writeFile(path.join(root, name), text);
  }
  return root;
}
const md = (meta: string, body: string) =>
  `---\ntype: Concept\n${meta}\n---\n${body}`;
test("source mapping preserves index, README, Korean, spaces and special characters", () => {
  expect(documentUrl("knowledge/ko/index.md", "/")).toBe("/knowledge/");
  expect(documentUrl("knowledge/ko/README.md", "/")).not.toBe(
    documentUrl("knowledge/ko/index.md", "/"),
  );
  expect(documentUrl("knowledge/ko/한 글 #%.md", "/repo/")).toBe(
    "/repo/knowledge/%ED%95%9C%20%EA%B8%80%20%23%25/",
  );
  expect(() => documentUrl("../secret.md")).toThrow();
  expect(() => normalizeBase("//bad/")).toThrow();
});
test("relative links, reference images, Korean duplicate headings and attachments", async () => {
  const root = await fixture({
    "index.md": "# Index\n[A](knowledge/ko/a.md)",
    "knowledge/ko/a.md":
      "# A\n[문서](<한 글.md#제목-1>)\n[같은 문서](#a)\n![그림][img]\n\n[img]: pic.png\n\n[첨부](note.txt)",
    "knowledge/ko/한 글.md": "# 제목\n## 제목",
    "knowledge/ko/pic.png": "image-fixture",
    "knowledge/ko/note.txt": "attachment",
  });
  const config = {
    ...site,
    base: "/repo/",
    assets: ["knowledge/ko/pic.png", "knowledge/ko/note.txt"],
  };
  const { documents, report } = await collect(root, config);
  expect(report.errors).toEqual([]);
  const doc = documents.find((d) => d.source.endsWith("/a.md"))!;
  expect(doc.html).toContain("/repo/knowledge/%ED%95%9C%20%EA%B8%80/#");
  expect(doc.html).toContain("/repo/attachments/knowledge/ko/pic.png");
  expect(doc.html).toContain("/repo/attachments/knowledge/ko/note.txt");
  expect(
    documents.find((d) => d.source.includes("한 글"))!.toc.map((h) => h.id),
  ).toEqual(["제목", "제목-1"]);
  expect(report.assets).toHaveLength(2);
});
test("missing target and anchor are errors, manual index omission is reported", async () => {
  const root = await fixture({
    "index.md": "# Index",
    "knowledge/ko/a.md": "# A\n[broken](absent.md)\n[anchor](#없는-제목)",
  });
  const { report } = await collect(root);
  expect(report.errors.map((e) => e.code)).toEqual([
    "BROKEN_OR_UNAPPROVED_LINK",
    "BROKEN_ANCHOR",
  ]);
  expect(report.warnings).toContainEqual({
    code: "NOT_IN_INDEX",
    source: "knowledge/ko/a.md",
  });
});
test("language pairs use concept ID, index path pairs, and never fabricate missing translations", async () => {
  const root = await fixture({
    "index.md": "# Index",
    "knowledge/ko/a.md": md("concept_id: pair\nlanguage: ko", "# 한국어"),
    "knowledge/en/different.md": md(
      "concept_id: pair\nlanguage: en",
      "# English",
    ),
    "knowledge/ja/a.md": md("concept_id: pair\nlanguage: ja", "# 日本語"),
    "knowledge/ko/alone.md": md("concept_id: alone\nlanguage: ko", "# 단독"),
    "knowledge/ko/index.md": "# Ko",
    "knowledge/en/index.md": "# En",
  });
  const { documents } = await collect(root);
  expect(documents.find((d) => d.language === "ja")!.translations.en).toContain(
    "/en/knowledge/different/",
  );
  expect(
    documents.find((d) => d.conceptId === "alone")!.translations.en,
  ).toBeUndefined();
  expect(
    documents.find((d) => d.source === "knowledge/ko/index.md")!.translations
      .en,
  ).toContain("/en/knowledge/");
});
test("publication exclusions never reach HTML, JSON, search, bundles or copied assets", async () => {
  const root = await fixture({
    "index.md": "# Index\n[Public](knowledge/ko/public.md)",
    "knowledge/ko/public.md": "# Public\nVisible",
    "knowledge/ko/secret.md": md("private: true", "# PRIVATE_SENTINEL"),
    "knowledge/ko/draft.md": md("status: draft", "# DRAFT_SENTINEL"),
    "knowledge/internal/hidden.md": "# INTERNAL_SENTINEL",
    "outside.md": "# OUTSIDE_SENTINEL",
    "knowledge/ko/code.mdx": 'export const SECRET = "MDX_SENTINEL"',
    "knowledge/ko/not-public.md": md(
      "publish: false",
      "# UNPUBLISHED_SENTINEL",
    ),
    "knowledge/ko/unreferenced.png": "ASSET_SENTINEL",
  });
  const content = await collect(root);
  const out = path.join(root, "output");
  await writePages(
    content,
    render,
    { file: "assets/client.js" },
    out,
    site,
    root,
  );
  async function all(dir: string): Promise<string> {
    let result = "";
    for (const f of await readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      result += f.isDirectory() ? await all(p) : await readFile(p, "utf8");
    }
    return result;
  }
  expect(await all(out)).not.toContain("SENTINEL");
  expect(content.documents).toHaveLength(2);
  expect(content.report.excluded).toHaveLength(6);
  expect(content.report.assets).toEqual([]);
});
test("new/edited document updates emitted HTML and search without a route change", async () => {
  const root = await fixture({ "index.md": "# Index" });
  let content = await collect(root);
  expect(content.documents).toHaveLength(1);
  await mkdir(path.join(root, "knowledge/ko"), { recursive: true });
  await writeFile(
    path.join(root, "knowledge/ko/new.md"),
    "# 신규 문서\n검색전용표식",
  );
  content = await collect(root);
  let out = path.join(root, "output");
  await writePages(content, render, { file: "client.js" }, out, site, root);
  expect(
    await readFile(path.join(out, "knowledge/new/index.html"), "utf8"),
  ).toContain("검색전용표식");
  expect(
    search(
      content.documents.map((d) => ({ ...entry(d), text: d.text })),
      "검색전용표식",
    )[0].url,
  ).toBe(documentUrl("knowledge/ko/new.md"));
  await writeFile(
    path.join(root, "knowledge/ko/new.md"),
    "# 수정 제목\nchanged phrase",
  );
  content = await collect(root);
  out = path.join(root, "output2");
  await writePages(content, render, { file: "client.js" }, out, site, root);
  expect(await readFile(path.join(out, "search.json"), "utf8")).toContain(
    "changed phrase",
  );
  expect(
    await readFile(path.join(out, "knowledge/new/index.html"), "utf8"),
  ).toContain("수정 제목");
  expect(search(content.documents, "검색전용표식")).toEqual([]);
});
test("raw HTML and javascript cannot execute; metadata script breakout is escaped", async () => {
  const root = await fixture({
    "index.md": "# Index",
    "knowledge/ko/a.md": md(
      'title: "</script><script>alert(1)</script>"',
      "# A\n<script>alert(1)</script>\n\n[x](javascript:alert%281%29)\n\n<img src=x onerror=alert(1)>",
    ),
  });
  const content = await collect(root);
  expect(content.report.errors.some((e) => e.code === "UNSAFE_URL")).toBe(true);
  const doc = content.documents.find((d) => d.source.endsWith("/a.md"))!;
  expect(doc.html).not.toContain("<script");
  expect(doc.html).not.toContain("onerror");
  const out = path.join(root, "output");
  await writePages(content, render, { file: "client.js" }, out, site, root);
  const html = await readFile(path.join(out, "knowledge/a/index.html"), "utf8");
  expect(html).not.toContain("</script><script>alert(1)");
  expect(html).toContain("\\u003c/script>");
});
test("duplicate YAML and unsafe asset symlinks fail", async () => {
  let root = await fixture({
    "knowledge/ko/a.md": "---\ntitle: A\ntitle: B\n---\n# A",
  });
  await expect(collect(root)).rejects.toThrow("Invalid YAML");
  root = await fixture({ "index.md": "# Index\n[asset](knowledge/file.txt)" });
  await mkdir(path.join(root, "knowledge"));
  await symlink("/etc/passwd", path.join(root, "knowledge/file.txt"));
  await expect(
    collect(root, { ...site, assets: ["knowledge/file.txt"] }),
  ).rejects.toThrow("Unsafe asset");
});
test("unknown dates stay unknown and historical metadata remains historical", async () => {
  const root = await fixture({
    "knowledge/ko/a.md": md("freshness:\n  mode: historical", "# A"),
  });
  const doc = (await collect(root)).documents[0];
  expect(doc.modified).toBeUndefined();
  expect(doc.freshness).toBe("historical");
  expect(doc.verified).toEqual([]);
});
test("real Korean/English/title/body/tag search targets original documents", async () => {
  const { documents } = await collect();
  expect(search(documents, "가상 서버", "ko")[0].source).toBe(
    "knowledge/ko/cloud/aws-ec2.md",
  );
  expect(
    search(documents, "virtual server", "en").some(
      (d) => d.source === "knowledge/en/cloud/aws-ec2.md",
    ),
  ).toBe(true);
  expect(
    search(documents, "oidc").some((d) => d.source === "glossary/ko/oidc.md"),
  ).toBe(true);
  expect(
    search(documents, "compute").some((d) => d.tags.includes("compute")),
  ).toBe(true);
  expect(search(documents, "절대로없는검색어")).toEqual([]);
});

test("generated footnote links and accessible labels survive sanitization", async () => {
  const root = await fixture({
    "index.md": "# Index\nA[^source]\n\n[^source]: Evidence",
  });
  const doc = (await collect(root)).documents[0];
  expect(doc.html).toContain('href="#user-content-fn-source"');
  expect(doc.html).toContain('id="user-content-fn-source"');
  expect(doc.html).toContain('id="user-content-fnref-source"');
  expect(doc.html).toContain('id="user-content-footnote-label"');
  expect(doc.html).toContain('aria-describedby="user-content-footnote-label"');
  expect(doc.html).not.toContain("user-content-user-content");
});

test("OKF source scope descriptors remain readable without fabricated links", async () => {
  const root = await fixture({
    "index.md": md("sources:\n- resource: Engineering principles", "# Index"),
  });
  const { documents, report } = await collect(root);
  expect(report.errors).toEqual([]);
  expect(documents[0].sources).toEqual([
    { title: "Engineering principles", url: undefined },
  ]);
});

test("only exact index basenames define manual navigation", async () => {
  const root = await fixture({
    "index.md": "# Root",
    "knowledge/ko/search-index.md": "# Search index\n[Root](../../index.md)",
  });
  const { navigation, report } = await collect(root);
  expect(navigation["knowledge/ko/search-index.md"]).toBeUndefined();
  expect(report.warnings).toContainEqual({
    code: "NOT_IN_INDEX",
    source: "knowledge/ko/search-index.md",
  });
});

test("omitted HTML cannot leak through headings, descriptions, page data or search", async () => {
  const root = await fixture({
    "index.md":
      "# Visible <!-- HEADING_SENTINEL -->\n\nHello <!-- INLINE_SENTINEL --> world\n\n<!-- COMMENT_SENTINEL -->\n\n<script>SCRIPT_SENTINEL</script>",
  });
  const content = await collect(root);
  expect(JSON.stringify(content.documents)).not.toContain("SENTINEL");
  const out = path.join(root, "output");
  await writePages(content, render, { file: "client.js" }, out, site, root);
  for (const name of ["index/index.html", "search.json"]) {
    expect(await readFile(path.join(out, name), "utf8")).not.toContain(
      "SENTINEL",
    );
  }
});

test("inline and reference remote images fail while external navigation remains allowed", async () => {
  const root = await fixture({
    "index.md":
      "# Index\n![Inline](https://example.com/pixel.png)\n![Reference][img]\n\n[img]: http://127.0.0.1/private.png\n\n[External](https://example.com/article)",
  });
  const { documents, report } = await collect(root);
  expect(report.errors.map((e) => e.code)).toEqual([
    "UNAPPROVED_REMOTE_IMAGE",
    "UNAPPROVED_REMOTE_IMAGE",
  ]);
  expect(documents[0].html).not.toContain('src="http');
  expect(documents[0].html).toContain('href="https://example.com/article"');
});

test("language URL contract handles neutral indexes, nested locales and metadata-only languages", async () => {
  expect(documentUrl("knowledge/index.md", "/repo/")).toBe(
    "/repo/knowledge/index/",
  );
  expect(documentUrl("knowledge/ko/index.md", "/repo/")).toBe(
    "/repo/knowledge/",
  );
  expect(documentUrl("knowledge/en/index.md", "/repo/")).toBe(
    "/repo/en/knowledge/",
  );
  expect(documentUrl("decisions/ADR/en/choice.md", "/repo/")).toBe(
    "/repo/en/decisions/ADR/choice/",
  );
  expect(documentUrl("knowledge/ja/用語.md", "/")).toBe(
    "/ja/knowledge/%E7%94%A8%E8%AA%9E/",
  );
  expect(documentUrl("knowledge/english.md", "/", "en")).toBe(
    "/en/knowledge/english/",
  );
  const root = await fixture({
    "index.md": "# Index",
    "knowledge/ko/a.md": "# A",
    "knowledge/a.md": "# Collision",
  });
  const { report } = await collect(root);
  expect(report.errors.some((error) => error.code === "DUPLICATE_URL")).toBe(
    true,
  );
});

test("language homes and legacy bookmarks are emitted without duplicating original documents", async () => {
  const root = await fixture({
    "index.md": "# Index",
    "knowledge/ko/a.md": md("concept_id: a", "# 한글"),
    "knowledge/en/a.md": md("concept_id: a", "# English"),
  });
  const content = await collect(root, { ...site, base: "/repo/" });
  const out = path.join(root, "output");
  await writePages(
    content,
    render,
    { file: "client.js" },
    out,
    { ...site, base: "/repo/" },
    root,
  );
  expect(await readFile(path.join(out, "index.html"), "utf8")).toContain(
    '<html lang="ko">',
  );
  expect(await readFile(path.join(out, "en/index.html"), "utf8")).toContain(
    '<html lang="en">',
  );
  const alias = await readFile(
    path.join(out, "docs/knowledge/ko/a/index.html"),
    "utf8",
  );
  expect(alias).toContain("<article");
  expect(alias).toContain("한글");
  expect(alias).not.toContain('http-equiv="refresh"');
  expect(alias).toContain("location.search+location.hash");
  const sitemap = await readFile(path.join(out, "sitemap.xml"), "utf8");
  expect(sitemap).toContain("/repo/en/knowledge/a/");
  expect(sitemap).not.toContain("/docs/");
});

test("reading order follows explicit original index links across domains and rejects duplicate or excluded steps", async () => {
  const root = await fixture({
    "knowledge/ko/cloud/index.md":
      "# Cloud\n## 학습 순서\n1. Network: [B][b] → [A](a.md)\n\n[b]: ../data/b.md\n\n## Related\n[C](c.md)",
    "knowledge/ko/cloud/a.md": "# A",
    "knowledge/ko/cloud/c.md": "# C",
    "knowledge/ko/data/b.md": "# B",
  });
  let result = await collect(root);
  expect(result.learningPaths[0].steps.map((s) => s.title)).toEqual(["B", "A"]);
  expect(result.learningPaths[0].id).toBe("knowledge/cloud/index.md");
  await writeFile(
    path.join(root, "knowledge/ko/cloud/index.md"),
    "# Cloud\n## 학습 순서\n1. [A](a.md) → [A](a.md) → [Secret](secret.md)",
  );
  await writeFile(
    path.join(root, "knowledge/ko/cloud/secret.md"),
    "---\nprivate: true\n---\n# Secret",
  );
  result = await collect(root);
  expect(result.report.errors.map((e) => e.code)).toContain(
    "DUPLICATE_LEARNING_STEP",
  );
  expect(result.report.errors.map((e) => e.code)).toContain(
    "INVALID_LEARNING_STEP",
  );
  expect(result.learningPaths[0].steps.map((s) => s.title)).toEqual(["A"]);
});
