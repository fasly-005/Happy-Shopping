const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const host = "127.0.0.1";
const port = Number(process.env.PORT) || 4173;
const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp"
};

const server = http.createServer((request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { Allow: "GET, HEAD" });
        response.end("Method not allowed");
        return;
    }

    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
    } catch {
        response.writeHead(400);
        response.end("Invalid URL");
        return;
    }

    let relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
    let filePath = path.resolve(root, relativePath);
    if (!filePath.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    const segments = relativePath.split(/[\\/]/);
    if (segments.some((segment) => segment.startsWith(".") || segment.toLowerCase() === "node_modules")) {
        response.writeHead(404);
        response.end("Not found");
        return;
    }

    const serveFile = (statError, stats) => {
        if (statError || !stats.isFile()) {
            response.writeHead(404);
            response.end("Not found");
            return;
        }

        const contentType = contentTypes[path.extname(filePath).toLowerCase()];
        if (!contentType) {
            response.writeHead(415);
            response.end("Unsupported file type");
            return;
        }

        response.writeHead(200, {
            "Cache-Control": "no-store",
            "Content-Length": stats.size,
            "Content-Type": contentType,
            "X-Content-Type-Options": "nosniff"
        });
        if (request.method === "HEAD") {
            response.end();
            return;
        }

        const file = fs.createReadStream(filePath);
        file.on("error", (error) => {
            console.error(`Unable to read ${relativePath}:`, error);
            if (!response.headersSent) response.writeHead(500);
            response.end("Unable to read file");
        });
        file.pipe(response);
    };

    fs.stat(filePath, (statError, stats) => {
        if (!statError && stats.isDirectory()) {
            filePath = path.join(filePath, "index.html");
            relativePath = path.join(relativePath, "index.html");
            fs.stat(filePath, serveFile);
            return;
        }

        serveFile(statError, stats);
    });
});

server.listen(port, host, () => {
    console.log(`Happy Shopping is available at http://${host}:${port}`);
    console.log("Press Ctrl+C to stop the local server.");
});

server.on("error", (error) => {
    console.error("Could not start the local website server:", error.message);
    process.exitCode = 1;
});
