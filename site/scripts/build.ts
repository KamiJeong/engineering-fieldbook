import { build } from "vite";
import { mkdir, readFile, writeFile, cp, rm } from "node:fs/promises";
import path from "node:path";
import { generate } from "./generate";
import { entry } from "./content";
import { site, root, languageHome, legacyDocumentUrl } from "../config";
import type { PageData } from "../src/model";
const escape = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const json = (v: unknown) =>
  JSON.stringify(v)
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
export async function buildSite() {
  const content = await generate();
  await build();
  await build({
    build: {
      ssr: "src/server.tsx",
      outDir: ".server",
      manifest: false,
      rollupOptions: { input: path.join(root, "site/src/server.tsx") },
    },
  });
  const { render } = (await import(
    path.join(root, "site/.server/server.js") + `?v=${Date.now()}`
  )) as { render: (data: PageData) => string };
  const manifest = JSON.parse(
    await readFile("site/dist/.vite/manifest.json", "utf8"),
  ) as Record<string, { isEntry?: boolean; file: string; css?: string[] }>;
  const client = Object.values(manifest).find((v) => v.isEntry)!;
  await writePages(content, render, client);
}
export async function writePages(
  content: Awaited<ReturnType<typeof generate>>,
  render: (data: PageData) => string,
  client: { file: string; css?: string[] },
  destination = "site/dist",
  config = site,
  sourceRoot = root,
) {
  const common = {
    language: "ko",
    base: config.base,
    origin: config.origin,
    repository: config.repository,
    branch: config.branch,
    entries: content.documents.map(entry),
    navigation: content.navigation,
    learningPaths: content.learningPaths,
    languages: [
      ...new Set(["ko", "en", ...content.documents.map((d) => d.language)]),
    ],
  };
  const pages: { url: string; data: PageData }[] = [
    ...common.languages.map((language) => ({
      url: languageHome(config.base, language),
      data: { ...common, language },
    })),
    ...content.documents.map((document) => ({
      url: document.url,
      data: { ...common, language: document.language, document },
    })),
    { url: `${config.base}404.html`, data: { ...common, notFound: true } },
  ];
  const selected = process.argv.includes("--pilot")
    ? pages.filter(
        (p) =>
          !p.data.document ||
          [
            "knowledge/ko/cloud/aws-ec2.md",
            "knowledge/en/cloud/aws-ec2.md",
            "knowledge/ko/cloud/aws-subnets.md",
            "glossary/ko/oidc.md",
            "glossary/en/oidc.md",
          ].includes(p.data.document.source),
      )
    : pages;
  for (const { url, data } of selected) {
    const title =
        data.document?.title ||
        (data.notFound ? "문서를 찾을 수 없습니다" : "Engineering Fieldbook"),
      description =
        data.document?.description ||
        (data.language === "ko"
          ? "기본 개념을 이해하고 예제로 적용하며 기술 선택의 근거를 배우는 지식공유소."
          : "Understand the fundamentals, apply examples, and learn how to justify technical choices.");
    const html = `<!doctype html><html lang="${escape(data.language)}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} · Fieldbook</title><meta name="description" content="${escape(description)}">${data.notFound ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${escape(config.origin + url)}">`}${Object.entries(
      data.document?.translations ||
        Object.fromEntries(
          common.languages.map((language) => [
            language,
            languageHome(config.base, language),
          ]),
        ),
    )
      .map(
        ([lang, link]) =>
          `<link rel="alternate" hreflang="${escape(lang)}" href="${escape(config.origin + link)}">`,
      )
      .join(
        "",
      )}${(client.css || []).map((css) => `<link rel="stylesheet" href="${config.base}${css}">`).join("")}<script>try{var t=localStorage.getItem('fieldbook-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{}</script></head><body><div id="app">${render(data)}</div><script id="page-data" type="application/json">${json({ ...data, document: data.document ? { ...data.document, text: undefined } : undefined })}</script><script type="module" src="${config.base}${client.file}"></script></body></html>`;
    const relative = decodeURIComponent(url.slice(config.base.length)),
      file = path.join(
        destination,
        relative.endsWith(".html") ? relative : `${relative}index.html`,
      );
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  }
  // Existing bookmarks remain readable without a server or JavaScript.
  const aliases = content.documents.map((document) => ({
    source: document.source,
    from: legacyDocumentUrl(document.source, config.base),
    to: document.url,
  }));
  const used = new Set(pages.map((page) => page.url));
  for (const alias of aliases) {
    if (used.has(alias.from))
      throw new Error(`Legacy URL collision: ${alias.from}`);
    const directory = path.join(
      destination,
      decodeURIComponent(alias.from.slice(config.base.length)),
    );
    await mkdir(directory, { recursive: true });
    const document = content.documents.find(
      (document) => document.source === alias.source,
    )!;
    const data = { ...common, language: document.language, document };
    await writeFile(
      path.join(directory, "index.html"),
      `<!doctype html><html lang="${escape(document.language)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><link rel="canonical" href="${escape(config.origin + alias.to)}"><title>${escape(document.title)} · Fieldbook</title>${(client.css || []).map((css) => `<link rel="stylesheet" href="${config.base}${css}">`).join("")}<script>location.replace(${json(alias.to)}+location.search+location.hash)</script></head><body><noscript><p style="padding:12px 24px">이전 주소 · Previous address — <a href="${escape(alias.to)}">새 주소 / Canonical page</a></p></noscript><div id="app">${render(data)}</div></body></html>`,
    );
  }
  await writeFile(
    path.join(destination, "redirects.json"),
    JSON.stringify(aliases, null, 2),
  );
  await writeFile(
    path.join(destination, "search.json"),
    JSON.stringify(
      content.documents.map((d) => ({ ...entry(d), text: d.text })),
    ),
  );
  await writeFile(
    path.join(destination, "documents.json"),
    JSON.stringify(content.report.published, null, 2),
  );
  for (const asset of content.report.assets) {
    const dest = path.join(destination, "attachments", asset);
    await mkdir(path.dirname(dest), { recursive: true });
    await cp(path.join(sourceRoot, asset), dest);
  }
  await writeFile(
    path.join(destination, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
      .filter((p) => !p.data.notFound)
      .map(
        (p) =>
          `<url><loc>${escape(config.origin + p.url)}</loc>${p.data.document?.modified ? `<lastmod>${escape(p.data.document.modified)}</lastmod>` : ""}</url>`,
      )
      .join("")}</urlset>`,
  );
  await writeFile(path.join(destination, ".nojekyll"), "");
  await rm(path.join(destination, ".vite"), { recursive: true, force: true });
  console.log(
    `Prerendered ${selected.length} HTML pages + ${aliases.length} legacy redirects at ${config.base}; upload site/dist only.`,
  );
}
if (import.meta.main) await buildSite();
