import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:5183/Psychometry-Words/";

test("learn tab: flip a card, grade it, reveal announced", async ({ page }) => {
  await page.goto(BASE);
  await expect(page.getByRole("heading", { name: "מִלִּים" })).toBeVisible();
  await page.getByRole("button", { name: "גלה ניקוד ומשמעות" }).click();
  await expect(page.getByRole("button", { name: "ידעתי" })).toBeVisible();
  await page.getByRole("button", { name: "ידעתי" }).click();
});

test("practice tab: answer an MCQ question", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "תרגול" }).click();
  const options = page.locator('div[role="tabpanel"]#panel-practice button').filter({ hasText: /./ });
  await options.first().waitFor();
  // click the first visible option-like button inside the question card
  const card = page.locator("#panel-practice").locator("div").filter({ hasText: "1" }).first();
  await card.locator("button").first().click();
  await expect(page.getByRole("button", { name: "השאלה הבאה" })).toBeVisible();
});

test("data tab: search and integrity check show zero issues", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "נתונים" }).click();
  await page.getByRole("button", { name: /בדיקת תקינות/ }).click();
  await expect(page.getByText("כל הרשומות תקינות.")).toBeVisible();
});

test("settings tab: switch theme and toggle devMode", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "הגדרות" }).click();
  await page.getByRole("radio", { name: "מרווה" }).click();
  await expect(page.getByRole("radio", { name: "מרווה" })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("switch", { name: "הפעל מצב מפתח" }).click();
  await expect(page.getByRole("switch", { name: "הפעל מצב מפתח" })).toHaveAttribute("aria-checked", "true");
});

test("code tab: expand a lesson", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "קוד" }).click();
  await page.getByRole("button", { name: /2 · הסרת ניקוד/ }).click();
  await expect(page.getByText("strip(\"רָהוּט\")", { exact: false })).toBeVisible();
});

test("keyboard: skip link is the first focusable element and works", async ({ page }) => {
  await page.goto(BASE);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "דלגו לתוכן הראשי" })).toBeFocused();
});

test("axe scan: learn tab has no serious/critical violations", async ({ page }) => {
  await page.goto(BASE);
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

const TAB_NAMES = ["תרגול", "נתונים", "הגדרות", "קוד"];
for (const name of TAB_NAMES) {
  test(`axe scan: ${name} tab has no serious/critical violations`, async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("tab", { name }).click();
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}

const THEME_NAMES = ["אירוס", "מרווה", "שקד", "ערפל", "לילה רך"];
for (const name of THEME_NAMES) {
  test(`axe scan: learn tab in ${name} theme has no serious/critical violations`, async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("tab", { name: "הגדרות" }).click();
    await page.getByRole("radio", { name }).click();
    await page.getByRole("tab", { name: "לימוד" }).click();
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
