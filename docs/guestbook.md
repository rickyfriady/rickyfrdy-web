# Guestbook — activation & ops

The guestbook is the site's one stateful feature. Its **pure logic ships live and
tested** (`src/utils/guestbook.ts`, `src/utils/guestbookSchema.ts`), but the
server pieces are shipped as `.example` templates so the site stays 100% static
until you deliberately turn it on. Turning it on moves the site to **hybrid
rendering**: existing pages stay prerendered; only guestbook/auth routes are
server-rendered.

## What's already live (no infra)
- `src/utils/guestbookSchema.ts` — Zod payload schema + honeypot + length limits
- `src/utils/guestbook.ts` — `validateEntry` (validate + `sanitize-html` to plain text), `isRateLimited`
- `src/models/guestbook.models.ts` — exported types
- `db/guestbook.sql` — schema
- Unit tests: `tests/utils/guestbook.test.ts`

## Activation steps
1. **Deploy target / adapter** (pick one):
   ```bash
   npm i @astrojs/vercel        # or @astrojs/cloudflare
   ```
   In `astro.config.ts` add the adapter and switch to server output; keep every
   existing page prerendered (`export const prerender = true` by default), and
   the guestbook/auth routes set `prerender = false` themselves.
2. **Database** (Turso/libSQL):
   ```bash
   npm i @libsql/client
   turso db create ricki-guestbook
   turso db shell ricki-guestbook < db/guestbook.sql
   ```
3. **GitHub OAuth App**: callback URL `https://<host>/api/auth/callback`.
4. **Secrets** (server-only; never client): `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`,
   `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET`, `OWNER_ID`
   (your `github:<id>` for moderation).
5. **Rename the templates** (drop `.example`):
   - `src/server/guestbook-db.ts.example` → `.ts`
   - `src/server/auth.ts.example` → `.ts`
   - `src/pages/api/guestbook/index.ts.example` → `.ts`
   - `src/pages/api/guestbook/hide/[id].ts.example` → `.ts`
   - `src/pages/api/auth/github.ts.example`, `callback.ts.example`, `signout.ts.example` → `.ts`
   - `src/pages/guestbook.astro.example` → `.astro`
6. Add a footer/nav link to `/guestbook` and (optionally) a command-palette entry.

## Security posture
- Messages sanitized to **plain text** on write (`sanitize-html`, no tags) → no stored XSS.
- Auth via **GitHub OAuth**, no passwords. Session = **HMAC-signed, httpOnly, secure** cookie.
- **CSRF**: mutating routes check same-origin; OAuth uses a `state` cookie.
- **Rate limit**: 5 posts/min per user (swap the in-memory store for a durable one on multi-instance hosts).
- **Moderation**: owner-only soft-delete (`hidden = 1`), recoverable.
- All DB/OAuth/session secrets live only in `import.meta.env` server-side — never bundled to the client.
