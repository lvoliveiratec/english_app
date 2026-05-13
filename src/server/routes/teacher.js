const { getTeacherSession } = require("../auth");
const { sendJson } = require("../http");

async function requireTeacher(request, response, storage) {
  const session = await getTeacherSession(request, storage);

  if (!session) {
    sendJson(response, 403, { error: "Teacher access is required." });
    return null;
  }

  return session;
}

async function handleTeacherRoutes({ request, response, parsedUrl, storage }) {
  if (request.method === "GET" && parsedUrl.pathname === "/api/teacher/summary") {
    const session = await requireTeacher(request, response, storage);

    if (!session) {
      return true;
    }

    sendJson(response, 200, await storage.getTeacherSummary(session.user.id));
    return true;
  }

  return false;
}

module.exports = {
  handleTeacherRoutes,
};
