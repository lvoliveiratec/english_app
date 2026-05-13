const { clearSessionCookie, createSessionCookie, parseCookies } = require("../cookies");
const { readRequestBody, sendJson } = require("../http");
const { getSession } = require("../auth");
const { normalizeInviteCode, normalizeStudentProfile } = require("../validators");

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
    const inviteCode = normalizeInviteCode(body.inviteCode);
    const payload = await storage.createStudentAccount({ email, password, profile, inviteCode });
    const token = await storage.createSession(payload.user.id);
    sendJson(response, 201, payload, { "Set-Cookie": createSessionCookie(token) });
    return true;
  }

  if (request.method === "GET" && parsedUrl.pathname.startsWith("/api/invites/")) {
    const code = normalizeInviteCode(decodeURIComponent(parsedUrl.pathname.slice("/api/invites/".length)));

    if (!code) {
      sendJson(response, 400, { error: "Invite code is required." });
      return true;
    }

    const invite = await storage.getTeacherInviteByCode(code);

    if (!invite) {
      sendJson(response, 404, { error: "Invite link is invalid or inactive." });
      return true;
    }

    sendJson(response, 200, invite);
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
