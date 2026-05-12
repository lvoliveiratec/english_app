const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { createStorage } = require("./src/storage");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 5173);
const root = __dirname;
const storage = createStorage();

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("Request body is too large."));
      }
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body."));
      }
    });
  });
}

function sendJson(response, statusCode, payload, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const [name, ...valueParts] = cookie.split("=");
        return [name, decodeURIComponent(valueParts.join("="))];
      }),
  );
}

function createSessionCookie(token) {
  return `fluentpath_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`;
}

function clearSessionCookie() {
  return "fluentpath_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0";
}

function normalizeStudentProfile(profile = {}) {
  return {
    fullName: profile.fullName?.toString().trim() || "Student",
    age: profile.age?.toString().trim() || "",
    nativeLanguage: profile.nativeLanguage?.toString().trim() || "",
    level: profile.level?.toString() || "I am not sure yet",
    goal: profile.goal?.toString() || "Daily conversation",
    confidence: profile.confidence?.toString() || "",
    studyTime: profile.studyTime?.toString() || "",
    interests: Array.isArray(profile.interests)
      ? profile.interests.map((item) => item.toString())
      : [],
    favoriteMedia: profile.favoriteMedia?.toString().trim() || "",
    hobbies: profile.hobbies?.toString().trim() || "",
    foodAndDrinks: profile.foodAndDrinks?.toString().trim() || "",
    sports: profile.sports?.toString().trim() || "",
    motivation: profile.motivation?.toString().trim() || "",
  };
}

function normalizeAdminStudent(body = {}) {
  return {
    fullName: body.fullName?.toString().trim() || "Student",
    email: body.email?.toString().trim() || "",
    password: body.password?.toString() || "",
    nativeLanguage: body.nativeLanguage?.toString().trim() || "Portuguese",
    level: body.level?.toString() || "Beginner",
    goal: body.goal?.toString() || "Daily conversation",
    notes: body.notes?.toString().trim() || "",
  };
}

function normalizeAdminTeacher(body = {}) {
  return {
    fullName: body.fullName?.toString().trim() || "Teacher",
    email: body.email?.toString().trim() || "",
    password: body.password?.toString() || "",
    specialty: body.specialty?.toString().trim() || "",
    status: body.status?.toString() || "active",
  };
}

function normalizeAdminPlan(body = {}) {
  return {
    name: body.name?.toString().trim() || "Plan",
    priceCents: Math.max(0, Math.round(Number(body.priceCents) || 0)),
    billingCycle: body.billingCycle?.toString() || "monthly",
    description: body.description?.toString().trim() || "",
    status: body.status?.toString() || "active",
  };
}

function normalizeAdminCourse(body = {}) {
  return {
    title: body.title?.toString().trim() || "Course",
    level: body.level?.toString() || "",
    duration: body.duration?.toString().trim() || "",
    description: body.description?.toString().trim() || "",
    status: body.status?.toString() || "draft",
  };
}

async function getAdminSession(request) {
  const cookies = parseCookies(request.headers.cookie);
  const session = cookies.fluentpath_session
    ? await storage.getSession(cookies.fluentpath_session)
    : null;

  return session?.user?.role === "admin" ? session : null;
}

function getRouteId(pathname, prefix) {
  if (!pathname.startsWith(prefix)) {
    return null;
  }

  return decodeURIComponent(pathname.slice(prefix.length));
}

async function handleApiRequest(request, response, parsedUrl) {
  try {
    if (request.method === "GET" && parsedUrl.pathname === "/api/health") {
      sendJson(response, 200, await storage.health());
      return true;
    }

    if (request.method === "POST" && parsedUrl.pathname === "/api/auth/signup") {
      const body = await readRequestBody(request);
      const email = body.email?.toString().trim();
      const password = body.password?.toString();

      if (!email || !password) {
        sendJson(response, 400, { error: "Email and password are required." });
        return true;
      }

      const profile = normalizeStudentProfile(body.profile);
      const payload = await storage.createStudentAccount({ email, password, profile });
      const token = await storage.createSession(payload.user.id);
      sendJson(response, 201, payload, { "Set-Cookie": createSessionCookie(token) });
      return true;
    }

    if (request.method === "POST" && parsedUrl.pathname === "/api/auth/login") {
      const body = await readRequestBody(request);
      const email = body.email?.toString().trim();
      const password = body.password?.toString();

      if (!email || !password) {
        sendJson(response, 400, { error: "Email and password are required." });
        return true;
      }

      const payload = await storage.login({ email, password });
      const token = await storage.createSession(payload.user.id);
      sendJson(response, 200, payload, { "Set-Cookie": createSessionCookie(token) });
      return true;
    }

    if (request.method === "POST" && parsedUrl.pathname === "/api/auth/logout") {
      const cookies = parseCookies(request.headers.cookie);

      if (cookies.fluentpath_session) {
        await storage.deleteSession(cookies.fluentpath_session);
      }

      sendJson(response, 200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
      return true;
    }

    if (request.method === "GET" && parsedUrl.pathname === "/api/auth/me") {
      const cookies = parseCookies(request.headers.cookie);
      const session = cookies.fluentpath_session
        ? await storage.getSession(cookies.fluentpath_session)
        : null;

      if (!session) {
        sendJson(response, 401, { error: "Not signed in." });
        return true;
      }

      sendJson(response, 200, session);
      return true;
    }

    if (request.method === "GET" && parsedUrl.pathname === "/api/admin/summary") {
      if (!(await getAdminSession(request))) {
        sendJson(response, 403, { error: "Admin access is required." });
        return true;
      }

      sendJson(response, 200, await storage.getAdminSummary());
      return true;
    }

    if (request.method === "GET" && parsedUrl.pathname === "/api/admin/resources") {
      if (!(await getAdminSession(request))) {
        sendJson(response, 403, { error: "Admin access is required." });
        return true;
      }

      sendJson(response, 200, await storage.getAdminResources());
      return true;
    }

    const adminRoutes = [
      {
        collectionPath: "/api/admin/students",
        itemPath: "/api/admin/students/",
        normalize: normalizeAdminStudent,
        create: storage.createAdminStudent.bind(storage),
        update: storage.updateAdminStudent.bind(storage),
      },
      {
        collectionPath: "/api/admin/teachers",
        itemPath: "/api/admin/teachers/",
        normalize: normalizeAdminTeacher,
        create: storage.createAdminTeacher.bind(storage),
        update: storage.updateAdminTeacher.bind(storage),
      },
      {
        collectionPath: "/api/admin/plans",
        itemPath: "/api/admin/plans/",
        normalize: normalizeAdminPlan,
        create: storage.createAdminPlan.bind(storage),
        update: storage.updateAdminPlan.bind(storage),
      },
      {
        collectionPath: "/api/admin/courses",
        itemPath: "/api/admin/courses/",
        normalize: normalizeAdminCourse,
        create: storage.createAdminCourse.bind(storage),
        update: storage.updateAdminCourse.bind(storage),
      },
    ];

    for (const route of adminRoutes) {
      if (
        request.method === "POST" &&
        parsedUrl.pathname === route.collectionPath
      ) {
        if (!(await getAdminSession(request))) {
          sendJson(response, 403, { error: "Admin access is required." });
          return true;
        }

        const payload = await route.create(route.normalize(await readRequestBody(request)));
        sendJson(response, 201, payload);
        return true;
      }

      const id = getRouteId(parsedUrl.pathname, route.itemPath);

      if (request.method === "PUT" && id) {
        if (!(await getAdminSession(request))) {
          sendJson(response, 403, { error: "Admin access is required." });
          return true;
        }

        const payload = await route.update(id, route.normalize(await readRequestBody(request)));
        sendJson(response, 200, payload);
        return true;
      }
    }

    if (parsedUrl.pathname.startsWith("/api/")) {
      sendJson(response, 404, { error: "API route not found." });
      return true;
    }

    return false;
  } catch (error) {
    sendJson(response, error.statusCode || 500, {
      error: error.message || "Unexpected server error.",
    });
    return true;
  }
}

function resolveRequestPath(url) {
  const parsedUrl = new URL(url, `http://${host}:${port}`);
  const requestedPath = parsedUrl.pathname === "/" ? "/index.html" : parsedUrl.pathname;
  const decodedPath = decodeURIComponent(requestedPath);
  const filePath = path.normalize(path.join(root, decodedPath));

  if (!filePath.startsWith(root)) {
    return null;
  }

  return filePath;
}

const server = http.createServer(async (request, response) => {
  const parsedUrl = new URL(request.url, `http://${host}:${port}`);
  const handledApi = await handleApiRequest(request, response, parsedUrl);

  if (handledApi) {
    return;
  }

  const filePath = resolveRequestPath(request.url);

  if (!filePath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(content);
  });
});

server.listen(port, host, () => {
  console.log(`FluentPath English running at http://${host}:${port}`);
});
