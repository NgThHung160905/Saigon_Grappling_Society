import { defineConfig, loadEnv } from "vite";
import { resolve } from "node:path";

// Các trang (mỗi trang là 1 file HTML ở thư mục gốc) và đường dẫn "sạch" tương ứng
const PAGES = { "/register": "/register.html", "/schedule-membership": "/schedule-membership.html", "/merchandise": "/merchandise.html" };

// /register, /register/ -> register.html (dev + preview). Khi lên host: xem vercel.json hoặc public/.htaccess
function cleanUrls() {
  const rewrite = (req, _res, next) => {
    const [path, query] = (req.url || "").split("?");
    const key = path.length > 1 ? path.replace(/\/$/, "") : path;
    if (PAGES[key]) req.url = PAGES[key] + (query ? "?" + query : "");
    next();
  };
  return {
    name: "sgs-clean-urls",
    configureServer(server) { server.middlewares.use(rewrite); },
    configurePreviewServer(server) { server.middlewares.use(rewrite); }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          register: resolve(__dirname, "register.html"),
          "schedule-membership": resolve(__dirname, "schedule-membership.html"),
          merchandise: resolve(__dirname, "merchandise.html")
        }
      }
    },
    plugins: [
      cleanUrls(),
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
