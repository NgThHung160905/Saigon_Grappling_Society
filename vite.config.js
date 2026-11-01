import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      {
        name: "local-api-chat",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === "/api/chat" && req.method === "POST") {
              Object.assign(process.env, env);
              try {
                const { default: handler } = await server.ssrLoadModule("/api/chat.js");
                let body = "";
                req.on("data", chunk => body += chunk);
                req.on("end", async () => {
                  req.body = body;
                  await handler(req, res);
                });
              } catch (err) {
                console.error("[Local API Error]:", err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            } else {
              next();
            }
          });
        }
      }
    ]
  };
});

