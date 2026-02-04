CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  format TEXT NOT NULL DEFAULT 'html',
  content_md TEXT
);

CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);
