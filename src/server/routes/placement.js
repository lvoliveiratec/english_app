const { getSession } = require("../auth");
const { readRequestBody, sendJson } = require("../http");
const { generatePlacementQuestions, runPlacementAgent } = require("../../agents/placement");

const levelMetrics = {
  Beginner: { fluency: 12, listening: 18, pronunciation: 10 },
  Elementary: { fluency: 28, listening: 34, pronunciation: 25 },
  Intermediate: { fluency: 52, listening: 58, pronunciation: 48 },
  "Upper Intermediate": { fluency: 70, listening: 76, pronunciation: 66 },
  Advanced: { fluency: 84, listening: 88, pronunciation: 82 },
};

function withMetrics(placement) {
  return { ...placement, metrics: levelMetrics[placement.level] || levelMetrics.Beginner };
}

async function requireStudent(request, response, storage) {
  const session = await getSession(request, storage);
  if (!session) {
    sendJson(response, 401, { error: "Not signed in." });
    return null;
  }
  if (session.user.role !== "student") {
    sendJson(response, 403, { error: "Only students can access placement." });
    return null;
  }
  return session;
}

async function handlePlacementRoutes({ request, response, parsedUrl, storage }) {
  if (request.method === "GET" && parsedUrl.pathname === "/api/my-tests") {
    const session = await requireStudent(request, response, storage);
    if (!session) return true;

    const placements = await storage.getAllPlacements(session.user.id);

    const scored = placements.map((p) => {
      const priorities = p.priorities || [];
      const mistakeCount = priorities.filter((r) => r.startsWith("current:") || r.toLowerCase().includes("error") || r.toLowerCase().includes("mistake")).length;
      // Derive a 0-10 score from the placement level stored in the latest placement result
      // We use priorities count and feedback as signal — 10 = all correct, lower for more mistakes
      return { ...p, score: null };
    });

    sendJson(response, 200, { placements: scored });
    return true;
  }

  if (request.method === "GET" && parsedUrl.pathname === "/api/placement") {
    const session = await requireStudent(request, response, storage);
    if (!session) return true;

    const placement = await storage.getLatestPlacement(session.user.id);
    sendJson(response, 200, placement ? withMetrics(placement) : null);
    return true;
  }

  if (request.method === "GET" && parsedUrl.pathname === "/api/placement/questions") {
    const session = await requireStudent(request, response, storage);
    if (!session) return true;

    const profile = session.profile || {};
    const questions = await generatePlacementQuestions({
      profile,
      selfReportedLevel: profile.level || "Beginner",
    });
    sendJson(response, 200, { questions });
    return true;
  }

  if (request.method === "POST" && parsedUrl.pathname === "/api/placement") {
    const session = await requireStudent(request, response, storage);
    if (!session) return true;

    const body = await readRequestBody(request);
    const profile = session.profile || {};
    const level = profile.level || body.level?.toString() || "Beginner";
    const goal = profile.goal || body.goal?.toString() || "Daily conversation";

    let result;
    if (body.questions && body.answers) {
      result = await runPlacementAgent({
        profile,
        level,
        goal,
        questions: body.questions,
        answers: body.answers,
      });
    } else {
      const writing = body.writing?.toString().trim() || "";
      result = await runPlacementAgent({ profile, level, goal, writing });
    }

    await storage.savePlacement(session.user.id, {
      ...result,
      questions: body.questions || null,
      answers: body.answers || null,
    });

    if (result.level !== level) {
      await storage.createLevelSuggestion(session.user.id, {
        currentLevel: level,
        suggestedLevel: result.level,
        reason: result.feedback,
      });
    }

    sendJson(response, 200, result);
    return true;
  }

  if (request.method === "GET" && parsedUrl.pathname.startsWith("/api/my-tests/")) {
    const session = await requireStudent(request, response, storage);
    if (!session) return true;

    const placementId = parsedUrl.pathname.slice("/api/my-tests/".length);
    const placement = await storage.getPlacementById(placementId, session.user.id);

    if (!placement) {
      sendJson(response, 404, { error: "Test not found." });
      return true;
    }

    sendJson(response, 200, placement);
    return true;
  }

  return false;
}

module.exports = { handlePlacementRoutes };
