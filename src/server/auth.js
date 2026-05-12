const { parseCookies } = require("./cookies");

async function getSession(request, storage) {
  const cookies = parseCookies(request.headers.cookie);
  return cookies.fluentpath_session ? storage.getSession(cookies.fluentpath_session) : null;
}

async function getAdminSession(request, storage) {
  const session = await getSession(request, storage);
  return session?.user?.role === "admin" ? session : null;
}

module.exports = {
  getAdminSession,
  getSession,
};
