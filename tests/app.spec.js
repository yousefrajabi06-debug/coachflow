import { test, expect } from "@playwright/test";

test("client lifecycle, plans, search, filters and persistence", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add client", exact: false }).click();
  await page.getByLabel("Client name").fill("Test Client");
  await page.getByLabel("Email (optional)").fill("client@example.com");
  await page.getByLabel("Coaching goal").fill("Build a routine");
  await page.getByLabel("Goal progress (%)").fill("35");
  await page.getByLabel("Workout plan").fill("Weekly check-in notes");
  await page.getByLabel("Nutrition notes").fill("Meal planning notes");
  await page.getByRole("button", { name: "Save client" }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "View Test Client", exact: true })
    .click();
  await expect(
    page.getByText("Weekly check-in notes", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Meal planning notes", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit client", exact: true }).click();
  await page.getByLabel("Client name").fill("Updated Client");
  await page.getByRole("combobox", { name: "Status", exact: true }).selectOption("Paused");
  await page.getByLabel("Goal progress (%)").fill("60");
  await page.getByRole("button", { name: "Save client" }).click();
  await page.getByRole("button", { name: "Back to clients" }).click();
  await page.getByRole("button", { name: /^Active/ }).click();
  await expect(
    page.getByRole("heading", { name: "Updated Client" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: /^Paused/ }).click();
  await page.getByLabel("Search clients").fill("missing");
  await expect(
    page.getByRole("heading", { name: "Updated Client" }),
  ).toHaveCount(0);
  await page.getByLabel("Search clients").fill("Updated");
  await page
    .getByRole("button", { name: "View Updated Client", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Delete client", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep client" }).click();
  await expect(
    page.getByRole("heading", { name: "Updated Client" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete client", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete client", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Updated Client" }),
  ).toHaveCount(0);
});

test("invalid saved data falls back safely and progress is bounded", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "coachflow.clients.v1",
      JSON.stringify([{ name: "broken" }]),
    ),
  );
  await page.goto("/");
  await expect(page.getByText("Meet your next chapter.")).toBeVisible();
  await page.getByRole("button", { name: "Add client", exact: false }).click();
  await page.getByLabel("Client name").fill("Test");
  await page.getByLabel("Coaching goal").fill("Routine");
  await page.getByLabel("Goal progress (%)").fill("101");
  await page.getByRole("button", { name: "Save client" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page
      .getByLabel("Goal progress (%)")
      .evaluate((input) => input.validity.rangeOverflow),
  ).toBe(true);
});

test("sample clients are explicit and mobile does not overflow", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Load sample clients" }).click();
  await expect(
    page.getByRole("heading", { name: "Alex Morgan" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
