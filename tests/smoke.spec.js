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
    await placementForm.getByRole("button", { name: "Create baseline" }).click();
    await expect(page.locator("#assessmentFeedback")).toHaveText(
      "Saved. Your AI Teacher will start with Beginner material focused on daily conversation. The dashboard now shows an initial baseline estimate, not a measured score yet.",
    );
    await expect(page.locator("#fluencyValue")).toHaveText("12%");
    await expect(page.locator("#progressNote")).toContainText("Initial baseline estimated");

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
    const unique = Date.now();
    const email = `marina-${unique}@example.com`;
    const updatedEmail = `marina-updated-${unique}@example.com`;

    await primaryNav.getByRole("link", { name: "Login" }).click();
    await page.getByRole("link", { name: "Create account" }).click();

    await expect(page).toHaveURL(/#signup$/);
    await expect(page.getByRole("heading", { name: /tell your ai teacher/i })).toBeVisible();

    const signupForm = page.locator("#signupForm");

    await signupForm.getByLabel("Full name").fill("Marina Silva");
    await signupForm.getByLabel("Email").fill(email);
    await signupForm.getByLabel("Password").fill("safe-demo-password");
    await signupForm.getByLabel("Phone").fill("+1 555 0199");
    await signupForm.getByLabel("Age", { exact: true }).fill("29");
    await signupForm.getByLabel("Native language", { exact: true }).fill("Portuguese");
    await signupForm.locator("select[name='level']").selectOption({ label: "Elementary" });
    await signupForm.locator("select[name='goal']").selectOption({ label: "Travel" });
    await signupForm.locator("select[name='confidence']").selectOption({ label: "A little shy" });
    await signupForm.locator("select[name='studyTime']").selectOption({ label: "20 minutes a day" });
    await signupForm.getByLabel("Address line 1").fill("45 Learning Ave");
    await signupForm.getByLabel("City").fill("Calgary");
    await signupForm.getByLabel("State/Province").fill("AB");
    await signupForm.getByLabel("Postal code").fill("T2P 2M5");
    await signupForm.getByLabel("Country").fill("Canada");
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
    await expect(page.locator("#fluencyValue")).toHaveText("Not assessed");
    await expect(page.locator("#progressNote")).toContainText("No score yet");
    await expect(primaryNav.getByRole("link", { name: "Account" })).toBeVisible();
    await expect(primaryNav.getByRole("button", { name: "Logout" })).toBeVisible();

    const savedProfile = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("fluentpath:studentProfile")),
    );
    expect(savedProfile).toMatchObject({
      fullName: "Marina Silva",
      email,
      phone: "+1 555 0199",
      level: "Elementary",
      goal: "Travel",
      interests: ["Movies and series", "Cooking"],
      address: {
        line1: "45 Learning Ave",
        city: "Calgary",
        region: "AB",
        postalCode: "T2P 2M5",
        country: "Canada",
      },
    });
    expect(savedProfile.password).toBeUndefined();

    await primaryNav.getByRole("link", { name: "Account" }).click();
    await expect(page).toHaveURL(/#account$/);
    await expect(page.getByRole("heading", { name: /manage your profile/i })).toBeVisible();

    const accountForm = page.locator("#accountForm");
    await expect(accountForm.getByLabel("Email")).toHaveValue(email);
    await expect(accountForm.getByLabel("City")).toHaveValue("Calgary");

    await accountForm.getByLabel("Email").fill(updatedEmail);
    await accountForm.getByLabel("Phone").fill("+1 555 0200");
    await accountForm.getByLabel("City").fill("Vancouver");
    await accountForm.getByRole("button", { name: "Save account" }).click();
    await expect(page.locator("#accountFeedback")).toHaveText("Account updated.");

    const passwordForm = page.locator("#passwordForm");
    await passwordForm.getByLabel("Current password").fill("safe-demo-password");
    await passwordForm.getByLabel("New password").fill("safer-demo-password");
    await passwordForm.getByRole("button", { name: "Update password" }).click();
    await expect(page.locator("#passwordFeedback")).toHaveText("Password updated.");
  });

  test("teacher can sign in and view the teacher dashboard", async ({ page }) => {
    const primaryNav = page.getByRole("navigation", { name: "Primary" });

    await primaryNav.getByRole("link", { name: "Login" }).click();

    const loginForm = page.locator("#loginForm");

    await loginForm.getByLabel("Email", { exact: true }).fill("teacher@example.com");
    await loginForm.getByLabel("Password", { exact: true }).fill("teacher123");
    await loginForm.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/#teacher$/);
    await expect(page.getByRole("heading", { name: /your students/i })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Teacher" })).toBeVisible();
    await expect(primaryNav.locator("[data-route='dashboard']")).toBeHidden();
    await expect(primaryNav.locator("[data-route='admin']")).toBeHidden();
    await expect(page.locator("#teacherAssignedCount")).not.toHaveText("0");
    await expect(page.locator("#teacherStudentRows")).toContainText("Lucas");

    await page.goto("/#dashboard");
    await expect(page).toHaveURL(/#teacher$/);
  });

  test("student signup through a teacher invite is assigned to that teacher", async ({ page }) => {
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    const unique = Date.now();
    const invitedName = `Invite Student ${unique}`;
    const invitedEmail = `invite-student-${unique}@example.com`;

    await page.goto("/?invite=ANA-TEACHER#signup");
    await expect(page.locator("#signupInviteBanner")).toContainText("Ana Teacher");

    const signupForm = page.locator("#signupForm");

    await signupForm.getByLabel("Full name").fill(invitedName);
    await signupForm.getByLabel("Email").fill(invitedEmail);
    await signupForm.getByLabel("Password").fill("invite-demo-password");
    await signupForm.getByLabel("Native language", { exact: true }).fill("Portuguese");
    await signupForm.locator("select[name='level']").selectOption({ label: "Beginner" });
    await signupForm.locator("select[name='goal']").selectOption({ label: "Pronunciation" });
    await signupForm
      .locator("select[name='confidence']")
      .selectOption({ label: "Comfortable with simple phrases" });
    await signupForm.locator("select[name='studyTime']").selectOption({ label: "20 minutes a day" });
    await signupForm
      .getByLabel("Why do you want to learn English?")
      .fill("I want to improve pronunciation with this teacher.");
    await signupForm.getByRole("button", { name: "Create student account" }).click();

    await expect(page).toHaveURL(/#dashboard$/);
    await expect(page.locator("#signupFeedback")).toHaveText(
      "Student profile saved and assigned to the teacher from the invite link.",
    );

    await primaryNav.getByRole("button", { name: "Logout" }).click();
    await primaryNav.getByRole("link", { name: "Login" }).click();

    const loginForm = page.locator("#loginForm");

    await loginForm.getByLabel("Email", { exact: true }).fill("teacher@example.com");
    await loginForm.getByLabel("Password", { exact: true }).fill("teacher123");
    await loginForm.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/#teacher$/);
    await expect(page.locator("#teacherInviteLink")).toHaveValue(/invite=ANA-TEACHER/);
    await expect(page.locator("#teacherStudentRows")).toContainText(invitedName);
  });

  test("admin can sign in and view the administrative dashboard", async ({ page }) => {
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    const unique = Date.now();
    const planName = `Conversation Plus ${unique}`;
    const courseName = `Admin Course ${unique}`;

    await primaryNav.getByRole("link", { name: "Login" }).click();

    const loginForm = page.locator("#loginForm");

    await loginForm.getByLabel("Email", { exact: true }).fill("admin@example.com");
    await loginForm.getByLabel("Password", { exact: true }).fill("admin123");
    await loginForm.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/#admin$/);
    await expect(page.getByRole("heading", { name: /school operations/i })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Admin" })).toBeVisible();
    await expect(page.locator("#adminStudentsCount")).not.toHaveText("0");
    await expect(page.locator("#adminTeachersCount")).not.toHaveText("0");
    await expect(page.locator("#adminRevenue")).toContainText("$");
    await expect(page.locator("#adminProgressRows")).not.toContainText("No student progress yet.");

    const studentForm = page.locator("#adminStudentForm");
    await studentForm.scrollIntoViewIfNeeded();
    await studentForm.getByLabel("Full name").fill("Admin Created Student");
    await studentForm.getByLabel("Email").fill(`admin-student-${unique}@example.com`);
    await studentForm.getByLabel("Temporary password").fill("student123");
    await studentForm.getByLabel("Native language").fill("Portuguese");
    await studentForm.locator("select[name='level']").selectOption({ label: "Elementary" });
    await studentForm.locator("select[name='goal']").selectOption({ label: "Work and meetings" });
    await studentForm.getByLabel("Notes").fill("Created from admin dashboard.");
    await studentForm.getByRole("button", { name: "Save student" }).click();
    await expect(page.locator("#adminStudentFeedback")).toHaveText("Record created.");
    await expect(page.locator("#adminStudentRows")).toContainText("Admin Created Student");

    const teacherForm = page.locator("#adminTeacherForm");
    await teacherForm.scrollIntoViewIfNeeded();
    await teacherForm.getByLabel("Full name").fill("Admin Created Teacher");
    await teacherForm.getByLabel("Email").fill(`admin-teacher-${unique}@example.com`);
    await teacherForm.getByLabel("Temporary password").fill("teacher123");
    await teacherForm.getByLabel("Specialty").fill("Pronunciation");
    await teacherForm.getByRole("button", { name: "Save teacher" }).click();
    await expect(page.locator("#adminTeacherFeedback")).toHaveText("Record created.");
    await expect(page.locator("#adminTeacherRows")).toContainText("Admin Created Teacher");

    const assignmentForm = page.locator("#adminAssignmentForm");
    await assignmentForm.scrollIntoViewIfNeeded();
    await assignmentForm
      .locator("select[name='studentId']")
      .selectOption({ label: "Admin Created Student - Unassigned" });
    await assignmentForm
      .locator("select[name='teacherId']")
      .selectOption({ label: "Admin Created Teacher - Pronunciation" });
    await assignmentForm.getByLabel("Assignment notes").fill("Manual admin assignment.");
    await assignmentForm.getByRole("button", { name: "Assign teacher" }).click();
    await expect(page.locator("#adminAssignmentFeedback")).toHaveText(
      "Student assigned to teacher.",
    );
    await expect(page.locator("#adminAssignmentRows")).toContainText("Admin Created Student");
    await expect(page.locator("#adminAssignmentRows")).toContainText("Admin Created Teacher");

    const planForm = page.locator("#adminPlanForm");
    await planForm.scrollIntoViewIfNeeded();
    await planForm.getByLabel("Plan name").fill(planName);
    await planForm.getByLabel("Price").fill("89.90");
    await planForm.getByLabel("Billing cycle").selectOption({ label: "monthly" });
    await planForm.getByLabel("Description").fill("Extra conversation practice.");
    await planForm.getByRole("button", { name: "Save plan" }).click();
    await expect(page.locator("#adminPlanFeedback")).toHaveText("Record created.");
    await expect(page.locator("#adminPlanRows")).toContainText(planName);
    await expect(page.locator("#adminPlanRows")).toContainText("$89.90");

    const courseForm = page.locator("#adminCourseForm");
    await courseForm.scrollIntoViewIfNeeded();
    await courseForm.getByLabel("Course title").fill(courseName);
    await courseForm.getByLabel("Level").fill("Intermediate");
    await courseForm.getByLabel("Duration").fill("4 weeks");
    await courseForm.getByLabel("Status").selectOption({ label: "published" });
    await courseForm.getByLabel("Description").fill("Course created from admin dashboard.");
    await courseForm.getByRole("button", { name: "Save course" }).click();
    await expect(page.locator("#adminCourseFeedback")).toHaveText("Record created.");
    await expect(page.locator("#adminCourseRows")).toContainText(courseName);

    await page
      .locator("#adminCourseRows tr")
      .filter({ hasText: courseName })
      .getByRole("button", { name: "Edit" })
      .click();
    await courseForm.getByLabel("Duration").fill("5 weeks");
    await courseForm.getByRole("button", { name: "Save course" }).click();
    await expect(page.locator("#adminCourseFeedback")).toHaveText("Record updated.");
    await expect(page.locator("#adminCourseRows")).toContainText("5 weeks");
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
