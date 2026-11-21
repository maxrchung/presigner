import { s3 } from "bun";

const PORT = Number(process.env.PORT) || 8080;
const CACHE_MAX_AGE = 3600; // 1 hour

Bun.serve({
  port: PORT,
  fetch(req) {
    let key = new URL(req.url).pathname.slice(1);

    // I think fixes some percent-encoded paths?
    // https://github.com/timomeh/s3-public-presigner/pull/1
    try {
      key = decodeURIComponent(key);
    } catch { }

    const presignedUrl = s3.presign(key, {
      virtualHostedStyle: false,
      // Minimum time to guarantee cache window
      expiresIn: CACHE_MAX_AGE * 2,
    });

    // Non-empty body so CDNs (like Railway's) don't skip caching Content-Length: 0 redirects.
    return new Response("Found", {
      status: 302,
      headers: {
        Location: presignedUrl,
        "Cache-Control": `max-age=${CACHE_MAX_AGE}`,
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
});

console.log(`Server running on http://localhost:${PORT}`);
