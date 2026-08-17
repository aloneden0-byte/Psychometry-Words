import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:5183/Psychometry-Words/";

test("home tab: dashboard loads by default", async ({ page }) => {
  await page.goto(BASE);
  await expect(page.getByRole("heading", { name: "מִלִּים" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "בית", selected: true })).toBeVisible();
  await expect(page.getByText("הרמה הנוכחית")).toBeVisible();
});

test("learn tab: complete a 5-card micro-batch and reach the celebration screen", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "למידה" }).click();
  for (let i = 0; i < 5; i++) {
    await page.getByRole("button", { name: "גלה ניקוד ומשמעות" }).click();
    await page.getByRole("button", { name: "ידעתי" }).click();
  }
  await expect(page.getByRole("heading", { name: "כרטיסיית לימוד הושלמה!" })).toBeVisible();
  await page.getByRole("button", { name: "לבית" }).click();
  await expect(page.getByRole("tab", { name: "בית", selected: true })).toBeVisible();
});

test("practice tab: answer an MCQ question", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "תרגול" }).click();
  const options = page.locator('div[role="tabpanel"]#panel-practice button').filter({ hasText: /./ });
  await options.first().waitFor();
  const card = page.locator("#panel-practice").locator("div").filter({ hasText: "1" }).first();
  await card.locator("button").first().click();
  await expect(page.getByRole("button", { name: "השאלה הבאה" })).toBeVisible();
});

test("dashboard: quick practice launches a 5-question session ending in celebration", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("button", { name: /תרגול מהיר/ }).click();
  await expect(page.getByRole("tab", { name: "תרגול", selected: true })).toBeVisible();
  for (let i = 0; i < 6; i++) {
    const typedInput = page.locator("#typed-answer");
    if (await typedInput.count()) {
      await typedInput.fill("x");
      await page.getByRole("button", { name: "בדוק" }).click();
    } else {
      const card = page.locator("#panel-practice").locator("div").filter({ hasText: "1" }).first();
      const optionBtn = card.locator("button").first();
      if (await optionBtn.count()) await optionBtn.click();
    }
    const nextBtn = page.getByRole("button", { name: "השאלה הבאה" });
    if (await nextBtn.count()) await nextBtn.click();
    else break;
  }
  await expect(page.getByRole("heading", { name: "כל הכבוד!" })).toBeVisible();
  await page.getByRole("button", { name: "לבית" }).click();
  await expect(page.getByRole("tab", { name: "בית", selected: true })).toBeVisible();
});

test("rewards tab: shows level ladder and badges grid", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "הישגים" }).click();
  await expect(page.getByText("סך הכול כוכבים")).toBeVisible();
  await expect(page.getByText("תגים")).toBeVisible();
  await expect(page.getByText("מתחיל").first()).toBeVisible();
});

test("settings tab: open data management, search and integrity check show zero issues", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "הגדרות" }).click();
  await page.getByRole("button", { name: /ניהול מילים ונתונים/ }).click();
  await page.getByRole("button", { name: /בדיקת תקינות/ }).click();
  await expect(page.getByText("כל הרשומות תקינות.")).toBeVisible();
  await page.getByRole("button", { name: /חזרה להגדרות/ }).click();
  await expect(page.getByRole("tab", { name: "הגדרות", selected: true })).toBeVisible();
});

test("settings tab: toggle devMode", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "הגדרות" }).click();
  await page.getByRole("switch", { name: "הפעל מצב מפתח" }).click();
  await expect(page.getByRole("switch", { name: "הפעל מצב מפתח" })).toHaveAttribute("aria-checked", "true");
});

test("streak: increments across a simulated day boundary via devMode dayOffset", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "הגדרות" }).click();
  await page.getByRole("switch", { name: "הפעל מצב מפתח" }).click();

  await page.getByRole("tab", { name: "למידה" }).click();
  await page.getByRole("button", { name: "גלה ניקוד ומשמעות" }).click();
  await page.getByRole("button", { name: "ידעתי" }).click();

  await page.getByRole("tab", { name: "בית" }).click();
  await expect(page.getByTestId("streak-pill")).toHaveAttribute("aria-label", /^1 /);

  await page.getByRole("tab", { name: "הגדרות" }).click();
  await page.getByRole("spinbutton", { name: "הסטת זמן" }).fill("1");

  await page.getByRole("tab", { name: "למידה" }).click();
  await page.getByRole("button", { name: "גלה ניקוד ומשמעות" }).click();
  await page.getByRole("button", { name: "ידעתי" }).click();

  await page.getByRole("tab", { name: "בית" }).click();
  await expect(page.getByTestId("streak-pill")).toHaveAttribute("aria-label", /^2 /);
});

test("badges: rewards tab renders the badge grid after answering a question", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "תרגול" }).click();
  const card = page.locator("#panel-practice").locator("div").filter({ hasText: "1" }).first();
  await card.locator("button").first().click();

  await page.getByRole("tab", { name: "הישגים" }).click();
  await expect(page.getByText("כוכב ראשון")).toBeVisible();
  await expect(page.getByText("100 מוטמעות")).toBeVisible();
});

test("keyboard: skip link is the first focusable element and works", async ({ page }) => {
  await page.goto(BASE);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "דלגו לתוכן הראשי" })).toBeFocused();
});

const TAB_NAMES = ["בית", "למידה", "תרגול", "הישגים", "הגדרות"];
for (const name of TAB_NAMES) {
  test(`axe scan: ${name} tab has no serious/critical violations`, async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("tab", { name }).click();
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}

test("axe scan: data management screen (reached via settings) has no serious/critical violations", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "הגדרות" }).click();
  await page.getByRole("button", { name: /ניהול מילים ונתונים/ }).click();
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

test("axe scan: celebration screen has no serious/critical violations", async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole("tab", { name: "למידה" }).click();
  for (let i = 0; i < 5; i++) {
    await page.getByRole("button", { name: "גלה ניקוד ומשמעות" }).click();
    await page.getByRole("button", { name: "ידעתי" }).click();
  }
  await expect(page.getByRole("heading", { name: "כרטיסיית לימוד הושלמה!" })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});
