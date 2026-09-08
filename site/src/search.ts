import type { SearchEntry } from "./model";
const normalize = (s: string) => s.normalize("NFKC").toLowerCase();
export function search(entries: SearchEntry[], query: string, language = "") {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return entries
    .filter((e) => !language || e.language === language)
    .map((entry) => {
      const title = normalize(entry.title),
        tags = normalize(entry.tags.join(" ")),
        body = normalize(entry.text);
      return {
        entry,
        score: terms.every(
          (t) => title.includes(t) || tags.includes(t) || body.includes(t),
        )
          ? terms.reduce(
              (s, t) =>
                s +
                (title.includes(t) ? 10 : 0) +
                (tags.includes(t) ? 5 : 0) +
                (body.includes(t) ? 1 : 0),
              0,
            )
          : 0,
      };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.url.localeCompare(b.entry.url))
    .slice(0, 30)
    .map((e) => e.entry);
}
