/*
# Create contact_submissions table (single-tenant, no auth)

1. New Tables
- `contact_submissions` — messages sent through the Mediazz Hub homepage contact form
  - `id` (uuid, primary key)
  - `name` (text, not null) — sender's name
  - `email` (text, not null) — sender's email address
  - `service` (text, nullable) — the service they're interested in
  - `message` (text, not null) — the message body
  - `created_at` (timestamp, default now)
2. Security
- Enable RLS on `contact_submissions`.
- Grant INSERT to `anon` + `authenticated` only — visitors may submit the form; nothing is readable through the API.
- Insert-only policy: visitors can create submissions, but cannot read, edit, or delete them (site owner reviews them in the dashboard).
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  service text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON contact_submissions TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can submit a contact message" ON contact_submissions;
CREATE POLICY "Anyone can submit a contact message"
ON contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);
