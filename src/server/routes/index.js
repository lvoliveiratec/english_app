const { sendJson } = require("../http");
const { handleAdminRoutes } = require("./admin");
const { handleAuthRoutes } = require("./auth");
const { handleAccountRoutes } = require("./account");
const { handlePlacementRoutes } = require("./placement");
const { handlePronunciationRoutes } = require("./pronunciation");
const { handleRecordingRoutes } = require("./recordings");
const { handleTtsRoutes } = require("./tts");
const { handleTeacherRoutes } = require("./teacher");

async function handleApiRequest({ request, response, parsedUrl, storage }) {
  try {
    if (request.method === "GET" && parsedUrl.pathname === "/api/health") {
      const health = await storage.health();
      health.features = { tts: !!process.env.ELEVENLABS_API_KEY };
      sendJson(response, 200, health);
      return true;
    }

    if (await handleAuthRoutes({ request, response, parsedUrl, storage })) {
      return true;
    }

    if (await handleAccountRoutes({ request, response, parsedUrl, storage })) {
      return true;
    }

    if (await handlePlacementRoutes({ request, response, parsedUrl, storage })) {
      return true;
    }

    if (await handlePronunciationRoutes({ request, response, parsedUrl, storage })) {
      return true;
    }

    if (await handleRecordingRoutes({ request, response, parsedUrl, storage })) {
      return true;
    }

    if (await handleTtsRoutes({ request, response, parsedUrl })) {
      return true;
    }

    if (await handleTeacherRoutes({ request, response, parsedUrl, storage })) {
      return true;
    }

    if (await handleAdminRoutes({ request, response, parsedUrl, storage })) {
      return true;
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

module.exports = {
  handleApiRequest,
};
