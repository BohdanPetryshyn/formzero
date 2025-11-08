-- Migration number: 0003

CREATE TABLE form_settings (
    id TEXT PRIMARY KEY,
    form_id TEXT NOT NULL UNIQUE,
    notification_email TEXT,
    notification_email_password TEXT,
    smtp_host TEXT,
    smtp_port INTEGER,
    smtp_secure INTEGER DEFAULT 1, -- 1 for TLS, 0 for plain
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
);

CREATE INDEX idx_form_settings_form_id ON form_settings(form_id);
