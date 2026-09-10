import { test, expect } from "@playwright/test";
import { readFile, mkdir } from "node:fs/promises";
import { site } from "../config";
test("every public HTML and local link exists on a static server", async ({
  request,
  page,
}) => {
  test.setTimeout(90000);
  const mapping = JSON.parse(
    await readFile("site/dist/documents.json", "utf8"),
  ) as { source: string; url: string }[];
  const cache = new Map<string, string>();
  for (const doc of mapping) {
    const response = await request.get(doc.url);
    expect(response.status(), doc.source).toBe(200);
    const html = await response.text();
    expect(html, doc.source).toContain("<article");
    cache.set(doc.url, html);
  }
  await page.goto("./");
  const targets = new Set<string>();
  for (const [url, html] of cache) {
    const { links, danglingAria } = await page.evaluate(
      ({ html, url }) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const danglingAria = [
          ...doc.querySelectorAll("[aria-describedby],[aria-labelledby]"),
        ].flatMap((node) =>
          ["aria-describedby", "aria-labelledby"].flatMap((attribute) =>
            (node.getAttribute(attribute) || "")
              .split(/\s+/)
              .filter(Boolean)
              .filter((id) => !doc.getElementById(id)),
          ),
        );
        const links = [
          ...doc.querySelectorAll(
            "a[href],img[src],script[src],link[rel=stylesheet]",
          ),
        ].map(
          (e) =>
            new URL(
              e.getAttribute("href") || e.getAttribute("src") || "",
              location.origin + url,
            ).href,
        );
        return { links, danglingAria };
      },
      { html, url },
    );
    expect(danglingAria, url).toEqual([]);
    for (const link of links) {
      const parsed = new URL(link);
      if (parsed.origin === "http://127.0.0.1:4173") {
        expect(parsed.pathname.startsWith(site.base), link).toBe(true);
        targets.add(parsed.pathname + parsed.hash);
      }
    }
  }
  for (const link of targets) {
    const parsed = new URL(link, "http://127.0.0.1:4173");
    if (!cache.has(parsed.pathname)) {
      const response = await request.get(parsed.pathname);
      expect(response.status(), link).toBe(200);
      if (response.headers()["content-type"]?.includes("text/html"))
        cache.set(parsed.pathname, await response.text());
    }
    if (parsed.hash && cache.has(parsed.pathname)) {
      const exists = await page.evaluate(
        ({ html, id }) =>
          !!new DOMParser()
            .parseFromString(html, "text/html")
            .getElementById(id),
        {
          html: cache.get(parsed.pathname)!,
          id: decodeURIComponent(parsed.hash.slice(1)),
        },
      );
      expect(exists, link).toBe(true);
    }
  }
  const missing = await request.get("no-such-page/");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("문서를 찾을 수 없습니다");
});
test("translation absence, glossary, log and keyboard dialog focus", async ({
  page,
}) => {
  await page.goto("README/");
  await expect(page.locator(".translation")).toContainText("번역 없음");
  await page.getByRole("link", { name: "용어집", exact: true }).first().click();
  await expect(page.locator("article h1")).toContainText("Glossary");
  await page.goto("log/");
  await expect(page.locator("article")).toContainText("2026-09-08");
  const trigger = page.getByRole("button", { name: "제목, 본문, 태그 검색" });
  await trigger.click();
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("searchbox").fill("절대로없는검색어");
  await expect(page.getByText("검색 결과가 없습니다.")).toBeVisible();
});
test("Mermaid is lazy, diagram and code copy work", async ({
  page,
  context,
}) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("knowledge/cloud/aws-subnets/");
  await expect(page.locator("code.language-mermaid")).toBeVisible();
  expect(requests.some((r) => r.includes("mermaid.core"))).toBe(false);
  await page.locator(".copy-code").first().click();
  await expect(page.locator(".copy-code").first()).toHaveText("복사됨");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "flowchart",
  );
  await page
    .getByRole("button", { name: "다이어그램 보기", exact: true })
    .click();
  await expect(page.locator("figure.diagram svg")).toBeVisible();
  expect(requests.some((r) => r.includes("mermaid.core"))).toBe(true);
});
for (const width of [375, 768, 1440])
  for (const locale of ["ko", "en"])
    for (const theme of ["light", "dark"] as const)
      test(`responsive ${width} ${locale} ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 });
        await page.addInitScript(
          (value) => localStorage.setItem("fieldbook-theme", value),
          theme,
        );
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(locale === "en" ? "en/" : "./");
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        const output = `artifacts/ui-review/verification/${site.base === "/" ? "root" : "project"}`;
        await mkdir(output, { recursive: true });
        await page.screenshot({
          path: `${output}/home-${width}-${locale}-${theme}.png`,
          fullPage: true,
        });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.goto(
          `${locale === "en" ? "en/" : ""}knowledge/cloud/aws-subnets/`,
        );
        await expect(page.locator("article h1")).toBeVisible();
        await expect(page.locator(".copy-code").first()).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: `${output}/document-${width}-${locale}-${theme}.png`,
          fullPage: true,
        });
        expect(errors).toEqual([]);
      });

test("dark syntax tokens in original YAML meet text contrast", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("fieldbook-theme", "dark"),
  );
  for (const path of ["policies/translation/", "policies/metadata/"]) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const tokens = await page
      .locator(".prose .hljs span")
      .evaluateAll((nodes) => {
        function luminance(color: string) {
          const values = color
            .match(/\d+(?:\.\d+)?/g)!
            .slice(0, 3)
            .map(Number)
            .map((v) => {
              const c = v / 255;
              return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
            });
          return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
        }
        return nodes.map((node) => {
          const foreground = luminance(getComputedStyle(node).color);
          const background = luminance(
            getComputedStyle(node.closest("pre")!).backgroundColor,
          );
          return {
            token: node.className,
            ratio:
              (Math.max(foreground, background) + 0.05) /
              (Math.min(foreground, background) + 0.05),
          };
        });
      });
    expect(tokens.length).toBeGreaterThan(0);
    for (const token of tokens)
      expect(token.ratio, `${path}: ${token.token}`).toBeGreaterThanOrEqual(
        4.5,
      );
  }
});

test("article controls and diagrams survive theme and search state changes", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.addInitScript(() =>
    localStorage.setItem("fieldbook-theme", "dark"),
  );
  await page.goto("knowledge/cloud/aws-subnets/");
  const copy = page.locator(".copy-code").first();
  await expect(copy).toBeVisible();
  await copy.click();
  await expect(copy).toHaveText("복사됨");
  await page
    .getByRole("button", { name: "다이어그램 보기", exact: true })
    .click();
  await expect(page.locator("figure.diagram svg")).toBeVisible();
  await page.getByRole("button", { name: "테마 변경" }).click();
  await page.keyboard.press("Control+k");
  await page.getByRole("searchbox").fill("EC2");
  await expect(page.locator(".search-results a").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(copy).toBeVisible();
  await expect(page.locator("figure.diagram svg")).toBeVisible();
  await page.locator('.language-switch a[lang="en"]').click();
  await expect(page).toHaveURL(/\/en\/knowledge\/cloud\/aws-subnets\/$/);
  await expect(page.locator(".copy-code").first()).toHaveText("Copy");
  await expect(page.locator("article")).toHaveAttribute("lang", "en");
});

test("language navigation changes URLs, homes, sidebar and default search together", async ({
  page,
  request,
}) => {
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await page.locator('.language-switch a[lang="en"]').click();
  await expect(page).toHaveURL(new RegExp(`${site.base}en/$`));
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".home-title")).toHaveText("Engineering Fieldbook");
  await expect(page.locator(".topics a")).toHaveCount(6);
  await expect(page.locator(".planned-topics a")).toHaveCount(4);
  const sidebarLinks = await page
    .locator(".sidebar a:not(.fieldbook-map)")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
  expect(
    sidebarLinks.every((href) => href?.startsWith(`${site.base}en/`)),
  ).toBe(true);
  await page.keyboard.press("Control+k");
  await expect(page.locator(".search-filter select")).toHaveValue("en");
  await page.getByRole("searchbox").fill("virtual server");
  await expect(page.locator(".search-results a").first()).toHaveAttribute(
    "href",
    `${site.base}en/knowledge/cloud/aws-ec2/`,
  );
  await page.locator(".search-results a").first().click();
  await page.reload();
  await expect(page.locator("article")).toHaveAttribute("lang", "en");
  const crumbs = await page
    .locator(".breadcrumbs a")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
  expect(crumbs.every((href) => href?.startsWith(`${site.base}en/`))).toBe(
    true,
  );
  await page.locator('.language-switch a[lang="ko"]').click();
  await expect(page).toHaveURL(
    new RegExp(`${site.base}knowledge/cloud/aws-ec2/$`),
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(canonical).toBe(`${site.origin}${site.base}knowledge/cloud/aws-ec2/`);
  const response = await request.get(`${site.base}en/`);
  expect(await response.text()).toContain('<html lang="en">');
});

test("missing translations remain explicit and legacy bookmarks retain anchors", async ({
  page,
}) => {
  await page.goto("README/");
  await expect(
    page.locator('.language-switch span[aria-disabled="true"]'),
  ).toHaveText("English");
  await expect(page.locator(".translation")).toContainText("번역 없음");
  await page.locator(".translation a").click();
  await expect(page).toHaveURL(new RegExp(`${site.base}en/$`));
  await page.goto("docs/knowledge/ko/cloud/aws-ec2/?from=bookmark#amazon-ec2");
  await expect(page).toHaveURL(
    new RegExp(
      `${site.base}knowledge/cloud/aws-ec2/\\?from=bookmark#amazon-ec2$`,
    ),
  );
  await expect(page.locator("article h1")).toBeVisible();
});

test("global map remains discoverable from both locale homes", async ({
  page,
}) => {
  for (const route of ["./", "en/"]) {
    await page.goto(route);
    const map = page.locator(".fieldbook-map");
    await expect(map).toBeVisible();
    if (route === "en/") await expect(map).toContainText("한국어");
    await map.click();
    await expect(page).toHaveURL(new RegExp(`${site.base}index/$`));
    for (const scope of [
      "decisions",
      "experiments",
      "checklists",
      "runbooks",
      "policies",
    ]) {
      await expect(
        page.locator(`article a[href="${site.base}${scope}/index/"]`),
      ).toBeVisible();
    }
  }
});

test("legacy bookmarks keep readable body, query and Korean anchors without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const url = `http://127.0.0.1:4173${site.base}docs/knowledge/ko/cloud/aws-ec2/?from=bookmark#${encodeURIComponent("요약")}`;
  await page.goto(url);
  await expect(page).toHaveURL(url);
  await expect(page.locator("article h1")).toContainText("Amazon EC2");
  await expect(page.locator('[id="요약"]')).toBeInViewport();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${site.origin}${site.base}knowledge/cloud/aws-ec2/`,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex",
  );
  await context.close();
});

test("unknown English paths keep404 status and English UI, navigation and search", async ({
  page,
  browser,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("en/not-a-document/");
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Document not found",
  );
  await expect(page).toHaveTitle("Document not found · Fieldbook");
  await expect(page.locator(".brand")).toHaveAttribute(
    "href",
    `${site.base}en/`,
  );
  await page.keyboard.press("Control+k");
  await expect(page.locator(".search-filter select")).toHaveValue("en");
  await page.getByRole("searchbox").fill("virtual server");
  await expect(page.locator(".search-results a").first()).toHaveAttribute(
    "href",
    `${site.base}en/knowledge/cloud/aws-ec2/`,
  );
  expect(errors).toEqual([]);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const plain = await context.newPage();
  const fallback = await plain.goto(
    `http://127.0.0.1:4173${site.base}en/not-a-document/`,
  );
  expect(fallback?.status()).toBe(404);
  await expect(plain.locator('noscript p[lang="en"]')).toContainText(
    "Page not found",
  );
  await expect(
    plain.getByRole("link", { name: "English home", exact: true }),
  ).toHaveAttribute("href", `${site.base}en/`);
  await context.close();
});
