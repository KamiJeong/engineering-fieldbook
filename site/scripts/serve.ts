import path from "node:path";
import { realpath, stat } from "node:fs/promises";
import { site } from "../config";
export function serve(port = Number(process.env.PORT || 4173)) {
  const directory = path.resolve("site/dist");
  return Bun.serve({
    hostname: "127.0.0.1",
    port,
    async fetch(request) {
      const url = new URL(request.url);
      if (!url.pathname.startsWith(site.base))
        return new Response("Not found", { status: 404 });
      let requested: string;
      try {
        requested = decodeURIComponent(url.pathname.slice(site.base.length));
      } catch {
        return new Response("Bad path", { status: 400 });
      }
      let file = path.resolve(directory, requested || ".");
      if (file !== directory && !file.startsWith(directory + path.sep))
        return new Response("Not found", { status: 404 });
      try {
        if ((await stat(file)).isDirectory()) {
          if (!url.pathname.endsWith("/")) {
            url.pathname += "/";
            return Response.redirect(url.href, 301);
          }
          file = path.join(file, "index.html");
        }
        if ((await realpath(file)) !== file) throw new Error("Symlink");
        const asset = Bun.file(file);
        if (!(await asset.exists())) throw new Error("Missing");
        return new Response(asset, {
          headers: {
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "no-store",
          },
        });
      } catch {
        return new Response(Bun.file(path.join(directory, "404.html")), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }
    },
  });
}
if (import.meta.main) {
  const server = serve();
  console.log(
    `Static server (no SPA fallback): http://localhost:${server.port}${site.base}`,
  );
}
