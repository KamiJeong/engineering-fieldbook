import { readdir, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { parseDocument } from "yaml";
import GithubSlugger from "github-slugger";
import type { Root, Definition } from "mdast";
import type { Root as HtmlRoot } from "hast";
import { documentUrl, sourceLanguage, encodePath, root, site } from "../config";
import type { Document, Entry, NavItem } from "../src/model";
type Meta = Record<string, unknown>;
export interface Issue {
  code: string;
  source: string;
  target?: string;
}
export interface Report {
  published: { source: string; url: string }[];
  excluded: { source: string; reason: string }[];
  warnings: Issue[];
  errors: Issue[];
  assets: string[];
}
const reserved = new Set([
  "private",
  "internal",
  "draft",
  "drafts",
  "secrets",
  "node_modules",
  "evidence",
]);
export function exclusion(
  source: string,
  meta: Meta,
  config = site,
): string | undefined {
  if (
    !config.files.includes(source) &&
    !config.roots.includes(source.split("/")[0])
  )
    return "outside-public-roots";
  if (
    source
      .split("/")
      .some((s) => s.startsWith(".") || reserved.has(s.toLowerCase()))
  )
    return "reserved-private-path";
  if (!source.endsWith(".md")) return "unsupported-format";
  if (meta.status === "draft" || meta.draft === true) return "draft";
  if (
    meta.private === true ||
    meta.publish === false ||
    meta.public === false ||
    ["private", "internal"].includes(String(meta.visibility))
  )
    return "not-public";
}
async function walk(directory: string, prefix = ""): Promise<string[]> {
  const files: string[] = [];
  for (const e of (await readdir(directory, { withFileTypes: true })).sort(
    (a, b) => a.name.localeCompare(b.name, "en"),
  )) {
    if (
      e.name.startsWith(".") ||
      ["node_modules", "site", "test-results", "playwright-report"].includes(
        e.name,
      )
    )
      continue;
    const name = prefix + e.name;
    if (e.isDirectory())
      files.push(...(await walk(path.join(directory, e.name), name + "/")));
    else if (e.isFile() && /\.mdx?$/.test(name)) files.push(name);
  }
  return files;
}
const str = (v: unknown) => (typeof v === "string" ? v : "");
const rec = (v: unknown): Meta =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Meta) : {};
function date(v: unknown) {
  return typeof v === "string" &&
    /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(v) &&
    Number.isFinite(Date.parse(v))
    ? v
    : undefined;
}
function gitDate(directory: string, source: string) {
  try {
    return date(
      execFileSync("git", ["log", "-1", "--format=%cI", "--", source], {
        cwd: directory,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim(),
    );
  } catch {
    return undefined;
  }
}
const parser = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ["yaml"])
  .use(remarkGfm);
export async function collect(directory = root, config = site) {
  const report: Report = {
    published: [],
    excluded: [],
    warnings: [],
    errors: [],
    assets: [],
  };
  const parsed = new Map<string, { tree: Root; meta: Meta; doc: Document }>();
  for (const source of await walk(directory)) {
    const early = exclusion(source, {}, config);
    if (early) {
      report.excluded.push({ source, reason: early });
      continue;
    }
    const tree = parser.parse(
      await readFile(path.join(directory, source), "utf8"),
    );
    const yaml = tree.children.find((n) => n.type === "yaml");
    const front = parseDocument(
      yaml && "value" in yaml ? String(yaml.value) : "",
      { uniqueKeys: true },
    );
    if (front.errors.length)
      throw new Error(`Invalid YAML: ${source}: ${front.errors[0].message}`);
    const meta = rec(front.toJS({ maxAliasCount: 50 }));
    const reason = exclusion(source, meta, config);
    if (reason) {
      report.excluded.push({ source, reason });
      continue;
    }
    tree.children = tree.children.filter((n) => n.type !== "yaml");
    visit(tree, (node) => {
      if ("children" in node) {
        node.children = node.children.filter((child) => {
          if (child.type !== "html") return true;
          report.warnings.push({ code: "RAW_HTML_OMITTED", source });
          return false;
        });
      }
    });
    const toc: Document["toc"] = [];
    const slugger = new GithubSlugger();
    let mermaid = false;
    visit(tree, (n) => {
      if (n.type === "heading") {
        const title = toString(n),
          id = slugger.slug(title);
        n.data = { ...n.data, hProperties: { id } };
        toc.push({ id, title, depth: n.depth });
      }
      if (n.type === "code" && n.lang === "mermaid") mermaid = true;
      if (n.type === "text" && n.value.includes("[["))
        report.errors.push({ code: "UNSUPPORTED_WIKI_LINK", source });
    });
    const generated = date(rec(meta.generated).at),
      committed = gitDate(directory, source);
    const modified = [generated, committed]
      .filter((d): d is string => !!d)
      .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
    const verified = Array.isArray(meta.verified)
      ? meta.verified
      : meta.verified
        ? [meta.verified]
        : [];
    const doc: Document = {
      source,
      url: documentUrl(
        source,
        config.base,
        sourceLanguage(source, str(meta.language)),
      ),
      title: str(meta.title) || toc[0]?.title || path.basename(source, ".md"),
      description:
        str(meta.description) ||
        toString(
          tree.children.find((n) => n.type === "paragraph") || {
            type: "paragraph",
            children: [],
          },
        ).slice(0, 180),
      language: sourceLanguage(source, str(meta.language)),
      category: source.includes("/") ? source.split("/")[0] : "fieldbook",
      tags: Array.isArray(meta.tags)
        ? meta.tags.filter((v): v is string => typeof v === "string")
        : [],
      modified,
      dateSource: modified
        ? modified === committed
          ? "git"
          : "generated"
        : undefined,
      conceptId: str(meta.concept_id) || undefined,
      status: str(meta.status) || undefined,
      translationStatus: str(rec(meta.translation).review_status) || undefined,
      html: "",
      text: toString(tree),
      toc,
      translations: {},
      sources: [],
      mermaid,
      verified: verified
        .map(rec)
        .filter((v) => date(v.at))
        .map((v) => ({ by: str(v.by), at: str(v.at) })),
      freshness: str(rec(meta.freshness).mode) || undefined,
    };
    parsed.set(source, { tree, meta, doc });
    report.published.push({ source, url: doc.url });
  }
  const urls = new Set<string>(),
    pairs = new Map<string, Map<string, Document>>();
  for (const { doc } of parsed.values()) {
    const key = doc.url.toLowerCase();
    if (urls.has(key))
      report.errors.push({ code: "DUPLICATE_URL", source: doc.source });
    urls.add(key);
    const pairKey = doc.conceptId
      ? `concept:${doc.conceptId}`
      : doc.source.endsWith("/index.md") &&
          doc.source.split("/").includes(doc.language)
        ? `index:${doc.source.replace(`/${doc.language}/`, "/{language}/")}`
        : undefined;
    if (pairKey) {
      const pair = pairs.get(pairKey) || new Map<string, Document>();
      if (pair.has(doc.language))
        report.errors.push({
          code: "DUPLICATE_LANGUAGE_PAIR",
          source: doc.source,
        });
      pair.set(doc.language, doc);
      pairs.set(pairKey, pair);
    }
  }
  for (const pair of pairs.values())
    for (const doc of pair.values())
      doc.translations = Object.fromEntries(
        [...pair].map(([l, d]) => [l, d.url]),
      );
  const assets = new Set<string>(),
    excluded = new Set(report.excluded.map((e) => e.source));
  function rewrite(
    source: string,
    raw: string,
    image = false,
  ): string | undefined {
    if (image && /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) {
      report.errors.push({
        code: "UNAPPROVED_REMOTE_IMAGE",
        source,
        target: raw,
      });
      return;
    }
    if (/^(https?:|mailto:)/i.test(raw)) return raw;
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith("//")) {
      report.errors.push({ code: "UNSAFE_URL", source, target: raw });
      return;
    }
    const hashAt = raw.indexOf("#"),
      queryAt = raw.indexOf("?"),
      end = Math.min(...[hashAt, queryAt, raw.length].filter((i) => i >= 0));
    let decoded: string;
    try {
      decoded = decodeURIComponent(raw.slice(0, end));
    } catch {
      report.errors.push({ code: "INVALID_ENCODING", source, target: raw });
      return;
    }
    const target = decoded
      ? path.posix.normalize(
          decoded.startsWith("/")
            ? decoded.slice(1)
            : path.posix.join(path.posix.dirname(source), decoded),
        )
      : source;
    if (target.startsWith("../") || target.includes("\\")) {
      report.errors.push({ code: "OUTSIDE_ROOT", source, target });
      return;
    }
    const d = parsed.get(target)?.doc;
    if (d) {
      if (hashAt >= 0) {
        let anchor: string;
        try {
          anchor = decodeURIComponent(raw.slice(hashAt + 1));
        } catch {
          anchor = "\u0000";
        }
        if (anchor && !d.toc.some((h) => h.id === anchor))
          report.errors.push({ code: "BROKEN_ANCHOR", source, target: raw });
      }
      return d.url + raw.slice(end);
    }
    if (config.assets.includes(target)) {
      if (
        ![
          ".png",
          ".jpg",
          ".jpeg",
          ".gif",
          ".webp",
          ".avif",
          ".pdf",
          ".txt",
          ".json",
          ".py",
        ].includes(path.extname(target).toLowerCase()) ||
        target
          .split("/")
          .some(
            (s) =>
              s.startsWith(".") ||
              ["private", "internal", "draft", "drafts", "secrets"].includes(
                s.toLowerCase(),
              ),
          )
      )
        throw new Error(`Disallowed asset: ${target}`);
      assets.add(target);
      return `${config.base}attachments/${encodePath(target)}${raw.slice(end)}`;
    }
    if (excluded.has(target) || exclusion(target, {}, config)) {
      report.warnings.push({ code: "EXCLUDED_LINK", source, target });
      return;
    }
    report.errors.push({ code: "BROKEN_OR_UNAPPROVED_LINK", source, target });
  }
  const navigation: Record<string, NavItem[]> = {},
    indexed = new Set(["index.md", "README.md", "log.md"]);
  for (const [source, { tree, meta, doc }] of parsed) {
    const definitions = new Map<string, Definition>();
    visit(tree, "definition", (n) => {
      definitions.set(n.identifier, n);
    });
    const imageReferences = new Set<string>();
    visit(tree, "imageReference", (n) => {
      imageReferences.add(n.identifier);
    });
    visit(tree, (n) => {
      if (n.type !== "link" && n.type !== "image" && n.type !== "definition")
        return;
      const next = rewrite(
        source,
        n.url,
        n.type === "image" ||
          (n.type === "definition" && imageReferences.has(n.identifier)),
      );
      n.url = next || "";
      if (!next)
        n.data = {
          ...n.data,
          hProperties: {
            className: ["unavailable"],
            title: "게시 제외 / Unavailable",
          },
        };
    });
    if (path.posix.basename(source) === "index.md" || source === "SUMMARY.md") {
      let section = "";
      const nav: NavItem[] = [];
      visit(tree, (n) => {
        if (n.type === "heading") section = toString(n);
        const destination =
          n.type === "link"
            ? n.url
            : n.type === "linkReference"
              ? definitions.get(n.identifier)?.url
              : undefined;
        if (!destination) return;
        const target = [...parsed.values()].find(
          (p) => p.doc.url === destination.split(/[?#]/)[0],
        )?.doc;
        if (target) {
          indexed.add(target.source);
          nav.push({
            title: toString(n) || target.title,
            url: target.url,
            section,
          });
        }
      });
      navigation[source] = nav;
    }
    const schema = {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        a: [...(defaultSchema.attributes?.a || []), "className", "title"],
      },
    };
    const processor = unified()
      .use(remarkRehype)
      .use(rehypeSanitize, schema)
      .use(rehypeHighlight, {
        detect: false,
        ignoreMissing: true,
        plainText: ["mermaid"],
      })
      .use(rehypeStringify);
    const htmlTree = (await processor.run(tree)) as HtmlRoot;
    let headingIndex = 0;
    visit(htmlTree, "element", (n) => {
      // remark-rehype already namespaces its generated footnotes. Undo only
      // the sanitizer's second prefix so footnote links and ARIA stay paired.
      if (typeof n.properties.id === "string") {
        if (n.properties.id.startsWith("user-content-user-content-fn"))
          n.properties.id = n.properties.id.slice("user-content-".length);
      }

      if (
        n.tagName === "a" &&
        Array.isArray(n.properties.className) &&
        n.properties.className.includes("unavailable")
      )
        delete n.properties.href;
      if (/^h[1-6]$/.test(n.tagName) && headingIndex < doc.toc.length)
        n.properties.id = doc.toc[headingIndex++].id;
    });
    doc.html = processor.stringify(htmlTree);
    doc.sources = (Array.isArray(meta.sources) ? meta.sources : [])
      .map(rec)
      .map((s) => ({
        title: str(s.title) || str(s.id) || str(s.resource) || "Source",
        url: /^(?:[a-z][a-z0-9+.-]*:|\.{0,2}\/)|\.[a-z0-9]+(?:[?#].*)?$/i.test(
          str(s.resource),
        )
          ? rewrite(source, str(s.resource))
          : undefined,
      }));
  }
  for (const { doc } of parsed.values())
    if (!indexed.has(doc.source))
      report.warnings.push({ code: "NOT_IN_INDEX", source: doc.source });
  for (const asset of assets) {
    const full = path.resolve(directory, asset);
    if (
      !full.startsWith(path.resolve(directory) + path.sep) ||
      (await realpath(full)) !== full
    )
      throw new Error(`Unsafe asset: ${asset}`);
    await readFile(full);
    report.assets.push(asset);
  }
  return {
    documents: [...parsed.values()].map((p) => p.doc),
    navigation,
    report,
  };
}
export function entry(d: Document): Entry {
  const {
    source,
    url,
    title,
    description,
    language,
    category,
    tags,
    modified,
    dateSource,
    conceptId,
    status,
    translationStatus,
  } = d;
  return {
    source,
    url,
    title,
    description,
    language,
    category,
    tags,
    modified,
    dateSource,
    conceptId,
    status,
    translationStatus,
  };
}
