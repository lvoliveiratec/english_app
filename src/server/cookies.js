function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const [name, ...valueParts] = cookie.split("=");
        return [name, decodeURIComponent(valueParts.join("="))];
      }),
  );
}

function createSessionCookie(token) {
  return `fluentpath_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`;
}

function clearSessionCookie() {
  return "fluentpath_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0";
}

module.exports = {
  clearSessionCookie,
  createSessionCookie,
  parseCookies,
};
