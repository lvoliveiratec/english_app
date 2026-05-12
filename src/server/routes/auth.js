const { clearSessionCookie, createSessionCookie, parseCookies } = require("../cookies");
const { readRequestBody, sendJson } = require("../http");
const { getSession } = require("../auth");
const { normalizeStudentProfile } = require("../validators");

async function handleAuthRoutes({ request, response, parsedUrl, storage }) {
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
    const session = await getSession(request, storage);

    if (!session) {
      sendJson(response, 401, { error: "Not signed in." });
      return true;
    }

    sendJson(response, 200, session);
    return true;
  }

  return false;
}

module.exports = {
  handleAuthRoutes,
};
