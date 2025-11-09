-- Migration number: 0004

-- Create global settings table
CREATE TABLE settings (
    id TEXT PRIMARY KEY,
    notification_email TEXT,
    notification_email_password TEXT,
    smtp_host TEXT,
    smtp_port INTEGER,
    smtp_secure INTEGER DEFAULT 1,
    updated_at INTEGER NOT NULL
);

-- Migrate first form_settings to global settings (if exists)
INSERT INTO settings (id, notification_email, notification_email_password, smtp_host, smtp_port, smtp_secure, updated_at)
SELECT
    'global',
    notification_email,
    notification_email_password,
    smtp_host,
    smtp_port,
    smtp_secure,
    updated_at
FROM form_settings
ORDER BY updated_at DESC
LIMIT 1;

-- Drop old form_settings table
DROP TABLE form_settings;
