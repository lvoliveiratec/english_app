const { getSession } = require("../auth");
const { readRequestBody, sendJson } = require("../http");
const { normalizeAccount, normalizePasswordChange } = require("../validators");

async function requireSession(request, response, storage) {
  const session = await getSession(request, storage);

  if (!session) {
    sendJson(response, 401, { error: "Not signed in." });
    return null;
  }

  return session;
}

async function handleAccountRoutes({ request, response, parsedUrl, storage }) {
  if (request.method === "GET" && parsedUrl.pathname === "/api/account") {
    const session = await requireSession(request, response, storage);

    if (!session) {
      return true;
    }

    sendJson(response, 200, session);
    return true;
  }

  if (request.method === "PUT" && parsedUrl.pathname === "/api/account") {
    const session = await requireSession(request, response, storage);

    if (!session) {
      return true;
    }

    const payload = await storage.updateAccount(
      session.user.id,
      normalizeAccount(await readRequestBody(request)),
    );
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "PUT" && parsedUrl.pathname === "/api/account/password") {
    const session = await requireSession(request, response, storage);

    if (!session) {
      return true;
    }

    const payload = normalizePasswordChange(await readRequestBody(request));

    if (!payload.currentPassword || !payload.newPassword) {
      sendJson(response, 400, { error: "Current password and new password are required." });
      return true;
    }

    await storage.updatePassword(session.user.id, payload);
    sendJson(response, 200, { ok: true });
    return true;
  }

  return false;
}

module.exports = {
  handleAccountRoutes,
};
