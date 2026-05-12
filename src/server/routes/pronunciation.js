const { getSession } = require("../auth");
const { readRequestBody, sendJson } = require("../http");
const { normalizePronunciationAttempt } = require("../validators");

async function handlePronunciationRoutes({ request, response, parsedUrl, storage }) {
  if (request.method === "POST" && parsedUrl.pathname === "/api/pronunciation-attempts") {
    const session = await getSession(request, storage);

    if (!session) {
      sendJson(response, 401, { error: "Not signed in." });
      return true;
    }

    if (session.user.role !== "student") {
      sendJson(response, 403, { error: "Only students can create pronunciation attempts." });
      return true;
    }

    const attempt = normalizePronunciationAttempt(await readRequestBody(request));

    if (!attempt.phrase) {
      sendJson(response, 400, { error: "Phrase is required." });
      return true;
    }

    sendJson(
      response,
      201,
      await storage.createPronunciationAttempt(session.user.id, attempt),
    );
    return true;
  }

  return false;
}

module.exports = {
  handlePronunciationRoutes,
};
