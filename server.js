const http = require("node:http");
const { handleApiRequest } = require("./src/server/routes");
const { serveStaticFile } = require("./src/server/static");
const { createStorage } = require("./src/storage");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 5173);
const root = __dirname;
const storage = createStorage();

const server = http.createServer(async (request, response) => {
  const parsedUrl = new URL(request.url, `http://${host}:${port}`);
  const handledApi = await handleApiRequest({ request, response, parsedUrl, storage });

  if (handledApi) {
    return;
  }

  serveStaticFile({ request, response, root, host, port });
});

server.listen(port, host, () => {
  console.log(`FluentPath English running at http://${host}:${port}`);
});
