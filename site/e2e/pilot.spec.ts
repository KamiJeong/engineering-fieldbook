import { test, expect } from "@playwright/test";
import { site } from "../config";
const ko = "knowledge/cloud/aws-ec2/";
test("pilot: direct HTML, search, translation, reload and 404", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const response = await request.get(ko);
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("<article");
  expect(html).toContain("EC2 인스턴스는 가상 서버입니다.");
  await page.goto(ko);
  await expect(page.locator("article h1")).toContainText("Amazon EC2");
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("searchbox").fill("가상 서버");
  const result = page
    .locator(".search-results a")
    .filter({ hasText: "Amazon EC2" })
    .first();
  await expect(result).toHaveAttribute("href", site.base + ko);
  await result.click();
  await page.locator(".language-switch a[lang=en]").click();
  await expect(page).toHaveURL(/\/en\/knowledge\/cloud\/aws-ec2\/$/);
  await expect(page.locator("article h1")).toContainText("Amazon EC2");
  await page.reload();
  await expect(page.locator("article")).toContainText("EC2");
  await page.keyboard.press("Control+k");
  await page.getByRole("searchbox").fill("virtual server");
  await expect(page.locator(".search-results a").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect((await request.get("missing-document/")).status()).toBe(404);
  expect(errors).toEqual([]);
});
test("pilot: content works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4173${site.base}${ko}`);
  await expect(page.locator("article h1")).toContainText("Amazon EC2");
  await expect(page.locator("article")).toContainText(
    "EC2 인스턴스는 가상 서버입니다.",
  );
  for (const heading of [
    "학습 목표",
    "선수 지식",
    "101 · 개념 이해",
    "201 · 예제에 적용하기",
    "301 · 조건에 따라 판단하기",
    "이해 확인",
  ]) {
    await expect(
      page.locator("article").getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  }
  await context.close();
});
