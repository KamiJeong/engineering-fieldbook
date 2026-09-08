import { mkdir, writeFile } from "node:fs/promises";
import { collect } from "./content";
export async function generate() {
  const content = await collect();
  await mkdir("site/.generated", { recursive: true });
  await writeFile(
    "site/.generated/report.json",
    JSON.stringify(content.report, null, 2),
  );
  for (const w of content.report.warnings)
    console.warn(`${w.code}: ${w.source} → ${w.target || ""}`);
  if (content.report.errors.length)
    throw new Error(JSON.stringify(content.report.errors, null, 2));
  console.log(
    `Content: ${content.documents.length} published, ${content.report.excluded.length} excluded, ${content.report.assets.length} assets, 0 errors`,
  );
  return content;
}
if (import.meta.main) await generate();
