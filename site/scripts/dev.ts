import { watch } from "node:fs";
import { buildSite } from "./build";
import { serve } from "./serve";
import { site } from "../config";
await buildSite();
const server = serve(Number(process.env.PORT || 5173));
console.log(
  `Development: http://localhost:${server.port}${site.base} (source changes rebuild; refresh browser)`,
);
let pending = false,
  running = false;
async function rebuild() {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  do {
    pending = false;
    try {
      await buildSite();
    } catch (error) {
      console.error(error);
    }
  } while (pending);
  running = false;
}
let timer: ReturnType<typeof setTimeout>;
watch(".", { recursive: true }, (_event, file) => {
  if (
    !file ||
    file.startsWith(".") ||
    file.startsWith("node_modules") ||
    file.startsWith("site/dist") ||
    file.startsWith("site/.") ||
    file.startsWith("test-results")
  )
    return;
  if (
    file.startsWith("site/") ||
    file === "vite.config.ts" ||
    site.files.includes(file) ||
    site.roots.some((root) => file.startsWith(root + "/"))
  ) {
    clearTimeout(timer);
    timer = setTimeout(() => void rebuild(), 150);
  }
});
