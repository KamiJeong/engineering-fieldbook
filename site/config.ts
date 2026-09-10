import path from "node:path";
export const root = path.resolve(import.meta.dirname, "..");
export function normalizeBase(value: string) {
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(value))
    throw new Error("SITE_BASE must be / or /path/");
  return value;
}
export const site = {
  name: "Engineering Fieldbook",
  base: normalizeBase(process.env.SITE_BASE || "/engineering-fieldbook/"),
  origin: process.env.SITE_ORIGIN || "https://kamijeong.github.io",
  repository: "https://github.com/KamiJeong/engineering-fieldbook",
  branch: "main",
  roots: [
    "knowledge",
    "glossary",
    "decisions",
    "experiments",
    "failures",
    "lessons",
    "checklists",
    "runbooks",
    "policies",
  ],
  files: ["index.md", "README.md", "log.md"],
  assets: [
    "knowledge/assets/digital-marketing/discovery-map.ko.png",
    "knowledge/assets/digital-marketing/discovery-map.en.png",
    "experiments/evidence/2026-09-08-fieldbook-audit/result.json",
    "experiments/evidence/2026-09-08-fieldbook-audit/reproduce.py",
  ],
};
if (
  new URL(site.origin).origin !== site.origin ||
  !/^https?:/.test(site.origin)
)
  throw new Error("SITE_ORIGIN must be an HTTP(S) origin without a path");
export const encodePath = (s: string) =>
  s.split("/").map(encodeURIComponent).join("/");
export function sourceLanguage(source: string, explicit?: string) {
  const language =
    explicit ||
    source.split("/").find((part) => /^[a-z]{2}(?:-[A-Z]{2})?$/.test(part)) ||
    "ko";
  if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(language))
    throw new Error("Invalid document language");
  return language;
}
export function languageHome(base: string, language: string) {
  return `${base}${language === "ko" ? "" : `${encodeURIComponent(language)}/`}`;
}
export function legacyDocumentUrl(source: string, base = site.base) {
  return `${base}docs/${encodePath(source.slice(0, -3))}/`;
}
export function documentUrl(
  source: string,
  base = site.base,
  language = sourceLanguage(source),
) {
  if (
    !source.endsWith(".md") ||
    source.startsWith("/") ||
    source.split("/").some((s) => s === ".." || s === "." || !s)
  )
    throw new Error("Invalid source path");
  const parts = source.slice(0, -3).split("/");
  const languageIndex = parts.indexOf(language);
  if (languageIndex >= 0) {
    parts.splice(languageIndex, 1);
    if (parts.at(-1) === "index") parts.pop();
  }
  return `${languageHome(base, language)}${encodePath(parts.join("/"))}/`;
}
