-- Add dual-format storage to notices (legacy HTML + Markdown).

ALTER TABLE notices ADD COLUMN format TEXT NOT NULL DEFAULT 'html';
ALTER TABLE notices ADD COLUMN content_md TEXT;

-- Backfill existing rows.
UPDATE notices SET format = 'html';
