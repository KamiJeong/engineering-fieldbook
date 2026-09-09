import { test, expect } from "@playwright/test";
const pathId = "knowledge/cloud/index.md";
test("global tree stays stable and a selected path crosses domains and translations", async ({
  page,
}) => {
  await page.goto("knowledge/cloud/aws-ec2/");
  const tree = page.locator(".nav-group > summary");
  const topics = await tree.allTextContents();
  await tree.filter({ hasText: /^Security$/ }).click();
  expect(topics).toContain("Data Systems");
  await expect(
    page.getByRole("region", { name: "학습 경로 선택" }),
  ).toBeVisible();
  await expect(page.locator(".learning-next")).toHaveCount(0);
  await page.locator(".learning-context > a").first().click();
  await expect(page).toHaveURL(/path=/);
  await expect(page.locator(".learning-next")).toContainText("Amazon ECS");
  await page.locator(".learning-context summary").click();
  await page
    .locator(".learning-context li a")
    .filter({ hasText: "RDS for PostgreSQL" })
    .click();
  await expect(page).toHaveURL(/knowledge\/data\/aws-rds-postgresql\/\?path=/);
  expect(await tree.allTextContents()).toEqual(topics);
  await expect(
    page
      .locator(".nav-group")
      .filter({ has: page.locator("summary", { hasText: /^Security$/ }) }),
  ).toHaveAttribute("open", "");
  await expect(
    page
      .locator(".nav-group")
      .filter({ has: page.locator("summary", { hasText: /^Data Systems$/ }) }),
  ).toHaveAttribute("open", "");
  await expect(page.locator(".learning-next")).toContainText("Connection Pool");
  await page.reload();
  await expect(page.locator(".learning-context")).toContainText("Data");
  await page.locator(".language-switch a[lang=en]").click();
  await expect(page).toHaveURL(
    /\/en\/knowledge\/data\/aws-rds-postgresql\/\?path=/,
  );
  await expect(page.locator(".learning-next")).toContainText(
    "Connection pooling",
  );
  await expect(page.locator(".learning-context")).toContainText(
    "in reading order",
  );
  const next = page.locator(".learning-next > a").last();
  const href = await next.getAttribute("href");
  expect(new URL(href!, "http://localhost").searchParams.get("path")).toBe(
    pathId,
  );
  const tab = await page.context().newPage();
  await tab.goto(href!);
  await expect(tab.locator(".learning-context")).toContainText(
    "in reading order",
  );
  await expect(tab.locator(".learning-next")).toContainText("Multi-AZ");
});

test("mobile tree supports keyboard disclosure; invalid paths do not invent sequence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("knowledge/cloud/aws-ec2/?path=unknown");
  await expect(page.locator(".learning-next")).toHaveCount(0);
  const shell = page.locator(".sidebar-shell > summary");
  await shell.focus();
  await page.keyboard.press("Enter");
  const security = page
    .locator(".nav-group > summary")
    .filter({ hasText: /^Security$/ });
  await security.focus();
  await page.keyboard.press("Enter");
  const role = page.locator(".sidebar a").filter({ hasText: "IAM Role:" });
  await expect(role).toBeVisible();
  await role.click();
  await expect(page.locator(".learning-context")).toContainText(
    "학습 경로 선택",
  );
  await shell.click();
  await expect(page.locator('.sidebar a[aria-current="page"]')).toContainText(
    "IAM Role",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
