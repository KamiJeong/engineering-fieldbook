import { test, expect } from "@playwright/test";

for (const language of ["ko", "en"]) {
  test(`home starts reading and separates upcoming topics (${language})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(language === "ko" ? "./" : "en/");
    const upcoming = page.locator(".planned-topics");
    await expect(upcoming).not.toHaveAttribute("open", "");
    await expect(upcoming.locator("nav")).not.toBeVisible();
    await upcoming.locator("summary").click();
    await expect(upcoming.locator("nav a").first()).toBeVisible();
    const start = page.locator(".first-document").first();
    await expect(start).toHaveAttribute("href", /\?path=/);
    await start.click();
    await expect(page.locator(".learning-context")).toContainText(
      /1\s*\/\s*23/,
    );
    await expect(page.locator("article h1")).toContainText("VPC");
  });
}

test("mobile contents closes, keeps the reading path and focuses the section", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("./");
  await page.locator(".first-document").first().click();
  await expect(page.locator(".breadcrumbs details")).not.toHaveAttribute(
    "open",
    "",
  );
  const path = new URL(page.url()).searchParams.get("path");
  const toc = page.locator(".mobile-toc");
  await toc.locator(":scope > summary").click();
  expect(
    await toc.locator("nav").evaluate((n) => n.getBoundingClientRect().height),
  ).toBeLessThanOrEqual(320);
  const subsection = toc.locator(".toc-subsections").first();
  await expect(subsection.locator("a").first()).not.toBeVisible();
  await subsection.locator("summary").click();
  const anchor = subsection.locator("a").first();
  const hash = new URL((await anchor.getAttribute("href"))!, page.url()).hash;
  await anchor.focus();
  await page.keyboard.press("Enter");
  await expect(toc).not.toHaveAttribute("open", "");
  await expect.poll(() => new URL(page.url()).hash).toBe(hash);
  expect(new URL(page.url()).searchParams.get("path")).toBe(path);
  const target = page.locator(`[id="${decodeURIComponent(hash!.slice(1))}"]`);
  await expect(target).toBeFocused();
  await expect(target).toBeInViewport();
  expect(
    await target.evaluate(
      (n) =>
        n.getBoundingClientRect().top >=
        document.querySelector(".site-header")!.getBoundingClientRect().bottom,
    ),
  ).toBe(true);
});

test("diagram stays beside its source and reveals its result with keyboard focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("knowledge/cloud/aws-subnets/");
  const source = page.locator("code.language-mermaid");
  const original = await source.textContent();
  const button = page.locator("pre .diagram-button");
  await button.focus();
  await page.keyboard.press("Enter");
  const figure = page.locator("figure.diagram");
  await expect(figure).toBeFocused();
  await expect(figure).toBeInViewport();
  await button.click();
  await expect(figure).toHaveCount(1);
  await expect(figure).toBeFocused();
  expect(await source.textContent()).toBe(original);
  await figure
    .getByRole("button", { name: "다이어그램 닫기", exact: true })
    .click();
  await expect(button).toBeFocused();
  await expect(figure).toHaveCount(0);
});
