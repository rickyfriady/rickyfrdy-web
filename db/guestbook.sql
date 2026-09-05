-- Guestbook schema (Turso / libSQL / SQLite).
-- Apply with:  turso db shell <your-db> < db/guestbook.sql
CREATE TABLE IF NOT EXISTS entries (
  id          TEXT PRIMARY KEY,
  author_id   TEXT NOT NULL,          -- provider identity (e.g. "github:12345")
  author_name TEXT NOT NULL,
  message     TEXT NOT NULL,          -- sanitized plain text
  created_at  TEXT NOT NULL,          -- ISO 8601
  hidden      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_entries_visible_created
  ON entries (hidden, created_at DESC);
