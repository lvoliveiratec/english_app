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

  const reviewMatch = parsedUrl.pathname.match(
    /^\/api\/teacher\/level-suggestions\/([^/]+)\/(approve|dismiss)$/,
  );

  if (request.method === "POST" && reviewMatch) {
    const session = await requireTeacher(request, response, storage);

    if (!session) {
      return true;
    }

    const [, studentId, action] = reviewMatch;
    await storage.reviewLevelSuggestion(studentId, action);
    sendJson(response, 200, { ok: true });
    return true;
  }

  // GET /api/teacher/students/:studentId/tests — test history for an assigned student
  const testsMatch = parsedUrl.pathname.match(/^\/api\/teacher\/students\/([^/]+)\/tests$/);
  if (request.method === "GET" && testsMatch) {
    const session = await requireTeacher(request, response, storage);
    if (!session) return true;

    const studentId = testsMatch[1];

    // Verify this student is assigned to this teacher
    const summary = await storage.getTeacherSummary(session.user.id);
    const isAssigned = summary.assignedStudents.some((s) => s.studentId === studentId);
    if (!isAssigned) {
      sendJson(response, 403, { error: "Student is not assigned to this teacher." });
      return true;
    }

    const placements = await storage.getAllPlacements(studentId);
    sendJson(response, 200, { placements });
    return true;
  }

  // GET /api/teacher/students/:studentId/tests/:testId
  const testDetailMatch = parsedUrl.pathname.match(/^\/api\/teacher\/students\/([^/]+)\/tests\/([^/]+)$/);
  if (request.method === "GET" && testDetailMatch) {
    const session = await requireTeacher(request, response, storage);
    if (!session) return true;

    const [, studentId, testId] = testDetailMatch;
    const summary = await storage.getTeacherSummary(session.user.id);
    const isAssigned = summary.assignedStudents.some((s) => s.studentId === studentId);
    if (!isAssigned) {
      sendJson(response, 403, { error: "Student is not assigned to this teacher." });
      return true;
    }

    const placement = await storage.getPlacementById(testId, studentId);
    if (!placement) {
      sendJson(response, 404, { error: "Test not found." });
      return true;
    }

    sendJson(response, 200, placement);
    return true;
  }

  return false;
}

module.exports = {
  handleTeacherRoutes,
};
