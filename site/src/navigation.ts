import type { Entry, LearningPath, PageData } from "./model";

export function pathHref(url: string, path?: LearningPath) {
  if (!path || (url !== path.url && !path.steps.some((s) => s.url === url)))
    return url;
  const [base, hash] = url.split("#");
  return `${base}?path=${encodeURIComponent(path.id)}${hash ? `#${hash}` : ""}`;
}

export function topicTree(data: PageData, locale: string) {
  const byUrl = new Map(data.entries.map((e) => [e.url, e]));
  const roots = data.navigation[`knowledge/${locale}/index.md`] || [];
  const glossary = data.entries.find(
    (e) => e.source === `glossary/${locale}/index.md`,
  );
  const seen = new Set<string>();
  return [...roots.map((n) => byUrl.get(n.url)), glossary]
    .filter((e): e is Entry => {
      if (
        !e ||
        e.language !== locale ||
        !e.source.endsWith("/index.md") ||
        seen.has(e.source)
      )
        return false;
      seen.add(e.source);
      return true;
    })
    .map((root) => {
      const directory = root.source.slice(0, -"index.md".length);
      const children: { entry: Entry; section: string }[] = [];
      const added = new Set<string>();
      // Prefer the descriptive category list over repeated reading-order links.
      for (const n of data.navigation[root.source] || []) {
        const entry = byUrl.get(n.url);
        if (
          !entry ||
          entry.source === root.source ||
          !entry.source.startsWith(directory) ||
          entry.language !== locale ||
          ["학습 순서", "Reading order"].includes(n.section) ||
          added.has(entry.source)
        )
          continue;
        added.add(entry.source);
        children.push({
          entry,
          section: n.section === root.title ? "" : n.section,
        });
      }
      for (const entry of data.entries) {
        if (
          entry.language === locale &&
          entry.source.startsWith(directory) &&
          entry.source !== root.source &&
          !added.has(entry.source)
        ) {
          added.add(entry.source);
          children.push({ entry, section: "" });
        }
      }
      return { root, children };
    });
}
