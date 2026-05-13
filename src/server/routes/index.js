const { sendJson } = require("../http");
const { handleAdminRoutes } = require("./admin");
const { handleAuthRoutes } = require("./auth");
const { handleAccountRoutes } = require("./account");
const { handlePronunciationRoutes } = require("./pronunciation");
const { handleTeacherRoutes } = require("./teacher");

async function handleApiRequest({ request, response, parsedUrl, storage }) {
  try {
    if (request.method === "GET" && parsedUrl.pathname === "/api/health") {
      sendJson(response, 200, await storage.health());
      return true;
    }

    if (await handleAuthRoutes({ request, response, parsedUrl, storage })) {
      return true;
    }

    if (await handleAccountRoutes({ request, response, parsedUrl, storage })) {
      return true;
    }

    if (await handlePronunciationRoutes({ request, response, parsedUrl, storage })) {
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
