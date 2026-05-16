const { getAdminSession } = require("../auth");
const { readRequestBody, sendJson } = require("../http");
const {
  normalizeAdminAssignment,
  normalizeAdminCourse,
  normalizeAdminPlan,
  normalizeAdminStudent,
  normalizeAdminTeacher,
} = require("../validators");

function getRouteId(pathname, prefix) {
  if (!pathname.startsWith(prefix)) {
    return null;
  }

  return decodeURIComponent(pathname.slice(prefix.length));
}

async function requireAdmin(request, response, storage) {
  const session = await getAdminSession(request, storage);

  if (!session) {
    sendJson(response, 403, { error: "Admin access is required." });
    return null;
  }

  return session;
}

async function handleAdminRoutes({ request, response, parsedUrl, storage }) {
  if (request.method === "GET" && parsedUrl.pathname === "/api/admin/summary") {
    if (!(await requireAdmin(request, response, storage))) {
      return true;
    }

    sendJson(response, 200, await storage.getAdminSummary());
    return true;
  }

  if (request.method === "GET" && parsedUrl.pathname === "/api/admin/resources") {
    if (!(await requireAdmin(request, response, storage))) {
      return true;
    }

    sendJson(response, 200, await storage.getAdminResources());
    return true;
  }

  if (request.method === "POST" && parsedUrl.pathname === "/api/admin/assignments") {
    const session = await requireAdmin(request, response, storage);

    if (!session) {
      return true;
    }

    const payload = await storage.createAdminAssignment(
      normalizeAdminAssignment(await readRequestBody(request)),
      session.user.id,
    );
    sendJson(response, 201, payload);
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
    if (request.method === "POST" && parsedUrl.pathname === route.collectionPath) {
      if (!(await requireAdmin(request, response, storage))) {
        return true;
      }

      const payload = await route.create(route.normalize(await readRequestBody(request)));
      sendJson(response, 201, payload);
      return true;
    }

    const id = getRouteId(parsedUrl.pathname, route.itemPath);

    if (request.method === "PUT" && id) {
      if (!(await requireAdmin(request, response, storage))) {
        return true;
      }

      const payload = await route.update(id, route.normalize(await readRequestBody(request)));
      sendJson(response, 200, payload);
      return true;
    }
  }

  const reviewMatch = parsedUrl.pathname.match(
    /^\/api\/admin\/level-suggestions\/([^/]+)\/(approve|dismiss)$/,
  );

  if (request.method === "POST" && reviewMatch) {
    if (!(await requireAdmin(request, response, storage))) {
      return true;
    }

    const [, studentId, action] = reviewMatch;
    await storage.reviewLevelSuggestion(studentId, action);
    sendJson(response, 200, { ok: true });
    return true;
  }

  // GET /api/admin/students/:studentId/tests
  const adminTestsMatch = parsedUrl.pathname.match(/^\/api\/admin\/students\/([^/]+)\/tests$/);
  if (request.method === "GET" && adminTestsMatch) {
    if (!(await requireAdmin(request, response, storage))) return true;
    const placements = await storage.getAllPlacements(adminTestsMatch[1]);
    sendJson(response, 200, { placements });
    return true;
  }

  // GET /api/admin/students/:studentId/tests/:testId
  const adminTestDetailMatch = parsedUrl.pathname.match(/^\/api\/admin\/students\/([^/]+)\/tests\/([^/]+)$/);
  if (request.method === "GET" && adminTestDetailMatch) {
    if (!(await requireAdmin(request, response, storage))) return true;
    const placement = await storage.getPlacementById(adminTestDetailMatch[2], adminTestDetailMatch[1]);
    if (!placement) {
      sendJson(response, 404, { error: "Test not found." });
      return true;
    }
    sendJson(response, 200, placement);
    return true;
  }

  // POST /api/admin/students/:studentId/notify
  const notifyMatch = parsedUrl.pathname.match(/^\/api\/admin\/students\/([^/]+)\/notify$/);
  if (request.method === "POST" && notifyMatch) {
    const session = await requireAdmin(request, response, storage);
    if (!session) return true;
    const body = await readRequestBody(request);
    const message = body.message?.toString().trim();
    if (!message) {
      sendJson(response, 400, { error: "message is required." });
      return true;
    }
    await storage.sendStudentNotification(notifyMatch[1], { message, sentById: session.user.id });
    sendJson(response, 201, { ok: true });
    return true;
  }

  return false;
}

module.exports = {
  handleAdminRoutes,
};
