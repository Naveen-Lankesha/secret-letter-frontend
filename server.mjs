import http from "node:http";
import https from "node:https";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lightweight .env loader for local runs (no external dependency).
// - Only sets variables that aren't already present in process.env
// - Ignores comments/blank lines
// - Supports simple KEY=VALUE with optional single/double quotes
function loadDotEnvIfPresent() {
  const envPath = path.join(__dirname, ".env");
  if (!existsSync(envPath)) return;

  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnvIfPresent();

const distDir = path.join(__dirname, "dist");
const indexPath = path.join(distDir, "index.html");

const port = Number.parseInt(process.env.PORT ?? "8080", 10);

// Optional same-origin API proxy. If your frontend calls "/api/..." this allows
// running the backend on a different host/container while keeping same-origin.
// Example: BACKEND_URL=http://backend:5000
const backendUrl = process.env.BACKEND_URL;

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".mjs", "application/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".map", "application/json; charset=utf-8"],
]);

function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  // Adjust CSP if you use external assets.
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; font-src 'self' data:;",
  );
}

function setCacheHeaders(res, filePath) {
  const base = path.basename(filePath);
  if (base === "index.html") {
    res.setHeader("Cache-Control", "no-cache");
    return;
  }

  // Heuristic: hashed Vite assets are safe to cache long-term.
  const looksHashed = /\.[a-f0-9]{8,}\./i.test(base);
  if (looksHashed) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    res.setHeader("Cache-Control", "public, max-age=3600");
  }
}

async function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = contentTypes.get(ext) ?? "application/octet-stream";

  setSecurityHeaders(res);
  setCacheHeaders(res, filePath);
  res.setHeader("Content-Type", type);

  const fileStat = await stat(filePath);
  res.statusCode = 200;
  res.setHeader("Content-Length", String(fileStat.size));

  createReadStream(filePath).pipe(res);
}

function proxyApi(req, res) {
  if (!backendUrl) {
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "BACKEND_URL is not set" }));
    return;
  }

  const upstream = new URL(backendUrl);
  const targetUrl = new URL(req.url ?? "/", upstream);

  const client = upstream.protocol === "https:" ? https : http;

  const upstreamReq = client.request(
    targetUrl,
    {
      method: req.method,
      headers: {
        ...req.headers,
        host: upstream.host,
      },
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    },
  );

  upstreamReq.on("error", (err) => {
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        error: "Upstream request failed",
        details: err.message,
      }),
    );
  });

  req.pipe(upstreamReq);
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = (req.url ?? "/").split("?")[0];

    if (urlPath.startsWith("/api")) {
      proxyApi(req, res);
      return;
    }

    if (!existsSync(indexPath)) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Missing dist/index.html. Did you run the build stage?");
      return;
    }

    // Resolve request path safely under dist/
    const decodedPath = decodeURIComponent(urlPath);
    const rel = decodedPath.replace(/^\/+/, "");
    const candidate = path.normalize(path.join(distDir, rel));

    if (!candidate.startsWith(distDir)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Bad request");
      return;
    }

    // If a real file exists, serve it. Otherwise serve index.html for SPA routing.
    if (req.method === "GET" || req.method === "HEAD") {
      if (existsSync(candidate)) {
        const st = await stat(candidate);
        if (st.isFile()) {
          await serveFile(res, candidate);
          return;
        }
      }

      await serveFile(res, indexPath);
      return;
    }

    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.end();
  } catch {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  }
});

server.listen(port, "0.0.0.0", () => {
  // Intentionally no console output in production images.
});
