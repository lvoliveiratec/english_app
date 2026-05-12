const { test, expect } = require("@playwright/test");

test.describe("FluentPath English smoke flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("student can sign in and use the first dashboard actions", async ({ page }) => {
    const primaryNav = page.getByRole("navigation", { name: "Primary" });

    await expect(page.getByRole("heading", { name: /learn real english/i })).toBeVisible();
    await expect(page.locator("#homeCoachGreeting")).toHaveText(
      "Your AI Teacher is ready to help.",
    );
    await expect(page.locator("#homeCoachSummary")).toContainText(
      "Sign in to unlock a private learning dashboard",
    );
    await expect(primaryNav.getByRole("link", { name: "Login" })).toBeVisible();
    await expect(primaryNav.getByRole("button", { name: "Logout" })).toBeHidden();

    await primaryNav.getByRole("link", { name: "Login" }).click();
    await expect(page.getByRole("heading", { name: /sign in to continue/i })).toBeVisible();

    const loginForm = page.locator("#loginForm");

    await loginForm.getByLabel("Name", { exact: true }).fill("Lucas");
    await loginForm.getByLabel("Email", { exact: true }).fill("lucas@example.com");
    await loginForm.getByLabel("Password", { exact: true }).fill("english123");
    await loginForm.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/#dashboard$/);
    await expect(page.getByRole("heading", { name: "Hi, Lucas." })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Lessons" })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Login" })).toBeHidden();
    await expect(primaryNav.getByRole("button", { name: "Logout" })).toBeVisible();

    const originalPhrase = await page.locator("#practicePhrase").innerText();
    await page.getByRole("button", { name: "New phrase" }).click();
    await expect(page.locator("#practicePhrase")).not.toHaveText(originalPhrase);
    await expect(page.locator("#voiceFeedback")).toHaveText(
      "New phrase ready. Record your attempt whenever you want.",
    );

    const placementForm = page.locator("#placementForm");

    await placementForm.locator("select[name='level']").selectOption({ label: "Beginner" });
    await placementForm.locator("select[name='goal']").selectOption({ label: "Daily conversation" });
    await placementForm
      .getByLabel("Writing sample")
      .fill("I want to improve my English for work and daily conversations.");
    await placementForm.getByRole("button", { name: "Save assessment" }).click();
    await expect(page.locator("#assessmentFeedback")).toHaveText(
      "Saved. Your AI Teacher will start with Beginner material focused on daily conversation.",
    );

    await page.getByRole("button", { name: "Record audio" }).click();
    await expect(page.locator("#classFeedback")).toHaveText(
      "Check the consent box before starting the class recording.",
    );

    await primaryNav.getByRole("button", { name: "Logout" }).click();

    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator("#homeCoachGreeting")).toHaveText(
      "Your AI Teacher is ready to help.",
    );
    await expect(primaryNav.getByRole("link", { name: "Login" })).toBeVisible();
    await expect(primaryNav.locator("[data-route='dashboard']")).toBeHidden();
    await expect(primaryNav.locator("[data-route='lessons']")).toBeHidden();
  });

  test("student can browse courses and open a course detail", async ({ page }) => {
    const primaryNav = page.getByRole("navigation", { name: "Primary" });

    await primaryNav.getByRole("link", { name: "Courses" }).click();

    await expect(page.getByRole("heading", { name: /english only/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "English Foundations" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Speaking Confidence" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Real Life English" })).toBeVisible();

    await page
      .locator(".course-card")
      .filter({ has: page.getByRole("heading", { name: "Speaking Confidence" }) })
      .getByRole("link", { name: "View course" })
      .click();

    await expect(page).toHaveURL(/#course$/);
    await expect(page.getByRole("heading", { name: "Speaking Confidence" })).toBeVisible();
    await expect(page.getByText("Intermediate course")).toBeVisible();
    await expect(page.locator("#courseDetailDuration")).toHaveText("8 weeks");
  });

  test("student can create an account with learning profile details", async ({ page }) => {
    const primaryNav = page.getByRole("navigation", { name: "Primary" });

    await primaryNav.getByRole("link", { name: "Login" }).click();
    await page.getByRole("link", { name: "Create account" }).click();

    await expect(page).toHaveURL(/#signup$/);
    await expect(page.getByRole("heading", { name: /tell your ai teacher/i })).toBeVisible();

    const signupForm = page.locator("#signupForm");

    await signupForm.getByLabel("Full name").fill("Marina Silva");
    await signupForm.getByLabel("Email").fill("marina@example.com");
    await signupForm.getByLabel("Password").fill("safe-demo-password");
    await signupForm.getByLabel("Age", { exact: true }).fill("29");
    await signupForm.getByLabel("Native language", { exact: true }).fill("Portuguese");
    await signupForm.locator("select[name='level']").selectOption({ label: "Elementary" });
    await signupForm.locator("select[name='goal']").selectOption({ label: "Travel" });
    await signupForm.locator("select[name='confidence']").selectOption({ label: "A little shy" });
    await signupForm.locator("select[name='studyTime']").selectOption({ label: "20 minutes a day" });
    await signupForm.getByLabel("Movies and series").check();
    await signupForm.getByLabel("Cooking").check();
    await signupForm.getByLabel("Favorite things to watch").fill("Travel videos and cooking shows.");
    await signupForm.getByLabel("Hobbies and free time").fill("Cooking and walking with friends.");
    await signupForm.getByLabel("Favorite foods and drinks").fill("Coffee, pasta, and fresh juice.");
    await signupForm.getByLabel("Sports or physical activities").fill("Yoga and weekend hikes.");
    await signupForm
      .getByLabel("Why do you want to learn English?")
      .fill("I want to feel more confident when traveling and meeting new people.");
    await signupForm.getByRole("button", { name: "Create student account" }).click();

    await expect(page).toHaveURL(/#dashboard$/);
    await expect(page.getByRole("heading", { name: "Hi, Marina." })).toBeVisible();
    await expect(page.locator("#studentBriefText")).toContainText("your level is Elementary");
    await expect(page.locator("#studentBriefText")).toContainText("your main goal is travel");
    await expect(page.locator("#studentBriefText")).toContainText("Movies and series, Cooking");
    await expect(primaryNav.getByRole("button", { name: "Logout" })).toBeVisible();

    const savedProfile = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("fluentpath:studentProfile")),
    );
    expect(savedProfile).toMatchObject({
      fullName: "Marina Silva",
      email: "marina@example.com",
      level: "Elementary",
      goal: "Travel",
      interests: ["Movies and series", "Cooking"],
    });
    expect(savedProfile.password).toBeUndefined();
  });

  test("admin can sign in and view the administrative dashboard", async ({ page }) => {
    const primaryNav = page.getByRole("navigation", { name: "Primary" });

    await primaryNav.getByRole("link", { name: "Login" }).click();

    const loginForm = page.locator("#loginForm");

    await loginForm.getByLabel("Name", { exact: true }).fill("Admin");
    await loginForm.getByLabel("Email", { exact: true }).fill("admin@example.com");
    await loginForm.getByLabel("Password", { exact: true }).fill("admin123");
    await loginForm.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/#admin$/);
    await expect(page.getByRole("heading", { name: /school operations/i })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Admin" })).toBeVisible();
    await expect(page.locator("#adminStudentsCount")).not.toHaveText("0");
    await expect(page.locator("#adminTeachersCount")).not.toHaveText("0");
    await expect(page.locator("#adminRevenue")).toContainText("$");
    await expect(page.locator("#adminProgressRows")).toContainText("Lucas");
  });

  test("mobile navigation opens, navigates, and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const primaryNav = page.getByRole("navigation", { name: "Primary" });

    await expect(primaryNav).toBeHidden();
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(primaryNav).toBeVisible();

    await primaryNav.getByRole("link", { name: "Courses" }).click();

    await expect(page).toHaveURL(/#courses$/);
    await expect(page.getByRole("heading", { name: /english only/i })).toBeVisible();
    await expect(primaryNav).toBeHidden();
  });
});
