import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { site } from "../config";

const output = `site/.generated/screenshots/${site.base === "/" ? "root" : "project"}`;

test("mobile drawer traps focus, closes with Escape and restores navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("knowledge/cloud/aws-ec2/");
  const summary = page.locator(".sidebar-shell > summary");
  await summary.click();
  await expect(page.locator('.sidebar-shell[role="dialog"]')).toBeVisible();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await expect(summary).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(page.locator(".search-dialog")).not.toBeVisible();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator(".nav-group > summary").last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(summary).toBeFocused();
  await mkdir(output, { recursive: true });
  await page.screenshot({ path: `${output}/drawer-375-ko-light.png` });
  await page.keyboard.press("Escape");
  await expect(summary).toBeFocused();
  await expect(page.locator(".sidebar-shell")).not.toHaveAttribute("open", "");
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
  await summary.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator(".sidebar-shell")).not.toHaveAttribute(
    "aria-modal",
    "true",
  );
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
  await expect(page.locator('.sidebar a[aria-current="page"]')).toBeVisible();
});

test("search exposes loading, error, retry, empty and arrow-key focus", async ({
  page,
}) => {
  let release: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/search.json", async (route) => {
    await pending;
    await route.fulfill({ status: 503, body: "Unavailable" });
  });
  await page.goto("en/");
  await page.keyboard.press("Control+k");
  await expect(page.locator(".search-status")).toHaveText(
    "Loading search index…",
  );
  release();
  await expect(page.locator(".search-status")).toContainText(
    "Could not load search",
  );
  await page.unroute("**/search.json");
  await page.locator(".search-panel > button").click();
  const input = page.getByRole("searchbox");
  await input.fill("virtual server");
  const first = page.locator(".search-results a").first();
  await expect(first).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(first).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(input).toBeFocused();
  await input.fill("nonexistentword9876");
  await expect(page.getByText("No matching documents.")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".search-trigger")).toBeFocused();
});

for (const theme of ["light", "dark"] as const) {
  test(`320px, content containers and semantic contrast ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.addInitScript(
      (t) => localStorage.setItem("fieldbook-theme", t),
      theme,
    );
    for (const route of [
      "./",
      "en/",
      "knowledge/cloud/aws-subnets/",
      "en/knowledge/cloud/aws-subnets/",
      "policies/metadata/",
    ]) {
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
    }
    const scroll = await page
      .locator("article pre, article table")
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          overflow: getComputedStyle(node).overflowX,
          width: node.getBoundingClientRect().width,
          parentWidth: node.parentElement!.getBoundingClientRect().width,
        })),
      );
    expect(scroll.length).toBeGreaterThan(0);
    for (const item of scroll) {
      expect(item.overflow).toBe("auto");
      expect(item.width).toBeLessThanOrEqual(item.parentWidth + 1);
    }
    const pairs = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      const rgb = (name: string) => {
        const node = document.createElement("span");
        node.style.color = `var(${name})`;
        document.body.append(node);
        const value = getComputedStyle(node).color;
        node.remove();
        return value;
      };
      function luminance(color: string) {
        const v = color
          .match(/\d+(?:\.\d+)?/g)!
          .slice(0, 3)
          .map(Number)
          .map((n) => {
            const c = n / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          });
        return v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722;
      }
      const pairs: [string, string, number][] = [
        ["--fb-foreground", "--fb-background", 4.5],
        ["--fb-muted-foreground", "--fb-background", 4.5],
        ["--fb-muted-foreground", "--fb-surface", 4.5],
        ["--fb-accent", "--fb-background", 4.5],
        ["--fb-accent-foreground", "--fb-accent", 4.5],
        ["--fb-secondary-foreground", "--fb-secondary", 4.5],
        ["--fb-brand-foreground", "--fb-brand-surface", 4.5],
        ["--fb-brand-label", "--fb-brand-surface", 4.5],
        ["--fb-sidebar-active-foreground", "--fb-sidebar-active", 4.5],
        ["--fb-warning", "--fb-warning-subtle", 4.5],
        ["--fb-error", "--fb-error-subtle", 4.5],
        ["--fb-ring", "--fb-background", 3],
        ["--fb-ring", "--fb-surface", 3],
        ["--fb-input", "--fb-surface", 3],
      ];
      const measured = pairs.map(([foreground, background, minimum]) => {
        const f = luminance(rgb(foreground)),
          b = luminance(rgb(background));
        return {
          name: `${foreground}/${background}`,
          minimum,
          ratio: (Math.max(f, b) + 0.05) / (Math.min(f, b) + 0.05),
        };
      });
      for (const node of document.querySelectorAll(".prose .hljs span")) {
        const f = luminance(getComputedStyle(node).color);
        const b = luminance(
          getComputedStyle(node.closest("pre")!).backgroundColor,
        );
        measured.push({
          name: node.className,
          minimum: 4.5,
          ratio: (Math.max(f, b) + 0.05) / (Math.min(f, b) + 0.05),
        });
      }
      return {
        measured,
        alias: style.getPropertyValue("--muted").trim(),
        expected: style.getPropertyValue("--fb-muted-foreground").trim(),
      };
    });
    expect(pairs.alias).toBe(pairs.expected);
    for (const p of pairs.measured)
      expect(p.ratio, p.name).toBeGreaterThanOrEqual(p.minimum);
    await mkdir(output, { recursive: true });
    await page.screenshot({ path: `${output}/narrow-320-${theme}.png` });
  });

  test(`diagram zoom, close and source fallback ${theme}`, async ({ page }) => {
    await page.addInitScript(
      (t) => localStorage.setItem("fieldbook-theme", t),
      theme,
    );
    await page.goto("knowledge/cloud/aws-subnets/");
    const render = page.getByRole("button", {
      name: "다이어그램 보기",
      exact: true,
    });
    await render.click();
    const zoom = page
      .locator(".diagram-controls")
      .getByRole("button", { name: "확대", exact: true });
    await zoom.click();
    const dialog = page.locator(".diagram-dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("svg")).toBeVisible();
    await expect(
      dialog.locator("svg .node").filter({ hasText: "Private application" }),
    ).toBeVisible();
    await expect(
      dialog.locator("svg .node").filter({ hasText: "Zonal public NAT" }),
    ).toBeVisible();
    await expect(dialog.locator("foreignObject")).toHaveCount(0);
    await mkdir(output, { recursive: true });
    await page.screenshot({ path: `${output}/diagram-${theme}.png` });
    await page.keyboard.press("Escape");
    await expect(zoom).toBeFocused();
    await page
      .locator(".diagram-controls")
      .getByRole("button", { name: "다이어그램 닫기", exact: true })
      .click();
    await expect(page.locator("figure.diagram")).toHaveCount(0);
    await expect(render).toBeFocused();
    await expect(page.locator("code.language-mermaid")).toBeVisible();
    await render.click();
    await expect(page.locator("figure.diagram svg")).toBeVisible();
  });
}

test("theme honors system even before hydration when storage is unavailable", async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  await context.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage unavailable");
      },
    });
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new Error("Storage unavailable");
      },
    });
  });
  const page = await context.newPage();
  await page.route("**/assets/client-*.js", (route) => route.abort());
  await page.goto(`http://127.0.0.1:4173${site.base}en/`);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.unroute("**/assets/client-*.js");
  await page.reload();
  await page.getByRole("button", { name: "Change theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("searchbox")).toBeFocused();
  await context.close();
});

test("article heading precedes metadata; mobile no-JS navigation and anchors remain usable", async ({
  browser,
  page,
}) => {
  await page.goto("knowledge/cloud/aws-ec2/");
  expect(
    await page.locator("article").evaluate((article) => {
      const title = article.querySelector("h1")!,
        meta = article.querySelector(".doc-meta")!;
      return !!(
        title.compareDocumentPosition(meta) & Node.DOCUMENT_POSITION_FOLLOWING
      );
    }),
  ).toBe(true);
  expect(
    await page.locator("article").evaluate((article) => {
      const title = article.querySelector("h1")!,
        learning = article.querySelector(".learning-context")!;
      return !!(
        title.compareDocumentPosition(learning) &
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    }),
  ).toBe(true);
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  const plain = await context.newPage();
  await plain.goto(
    `http://127.0.0.1:4173${site.base}knowledge/cloud/aws-ec2/#${encodeURIComponent("요약")}`,
  );
  await expect(plain.locator('article [id="요약"]')).toBeInViewport();
  expect(
    await plain
      .locator('article [id="요약"]')
      .evaluate(
        (n) =>
          n.getBoundingClientRect().top >=
          document.querySelector(".site-header")!.getBoundingClientRect()
            .bottom,
      ),
  ).toBe(true);
  await plain.locator(".sidebar-shell > summary").click();
  await plain.locator(".sidebar-shell > summary").click();
  await expect(plain.locator(".fieldbook-map")).toBeVisible();
  await context.close();
});

test("chosen theme survives reload and translation; reduced motion and skip link work", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("knowledge/cloud/aws-ec2/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("button", { name: "테마 변경" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator('.language-switch a[lang="en"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.locator(".theme-trigger").evaluate((n) =>
      getComputedStyle(n)
        .transitionDuration.split(",")
        .every((v) => v.trim() === "0s"),
    ),
  ).toBe(true);
});
