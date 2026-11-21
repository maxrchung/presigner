# Presigner

Lightweight Bun service that redirects public URLs to presigned S3 URLs. Based
off of https://github.com/timomeh/s3-public-presigner.

## Environment Variables

Configure your S3-compatible bucket credentials (see `.env.example`):

- `S3_REGION`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_BUCKET`
- `S3_ENDPOINT`
- `PORT` (defaults to `8080`)

## Caching Behavior

Redirects respond with `302`, a small non-empty body (`Redirecting`) so CDNs do
not skip caching `Content-Length: 0` redirects, and `Cache-Control:
max-age=3600` (1 hour edge/browser cache). Presigned URLs are signed with
`expiresIn: 7200` (2 hours) so a redirect served just before the 1-hour cache
expires still gives clients a full hour to download from S3.

If deploying on Railway, enable **Enable CDN Caching** in your service's
**Settings → Edge** (or run `railway cdn enable --service <service>`).

## Commands

```sh
bun install
bun start       # start server
bun dev         # watch mode
bun fmt         # format code
bun check       # type check
```
