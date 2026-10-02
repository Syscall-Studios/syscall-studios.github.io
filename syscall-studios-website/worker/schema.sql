-- WITHOUT ROWID makes email the table's only key, so each sign-up is a single row write.
CREATE TABLE IF NOT EXISTS subscribers (
    email TEXT PRIMARY KEY,
    source TEXT,
    created_at TEXT NOT NULL
) WITHOUT ROWID;
