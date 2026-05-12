const { getAdminSession } = require("../auth");
const { readRequestBody, sendJson } = require("../http");
const {
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

  return false;
}

module.exports = {
  handleAdminRoutes,
};
