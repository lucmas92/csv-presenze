import db from './client'

export function initDB() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users
        (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );
        CREATE TABLE IF NOT EXISTS weeks
        (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            start_date TEXT
        );

        CREATE TABLE IF NOT EXISTS presences
        (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date    TEXT    NOT NULL, -- YYYY-MM-DD
            status  TEXT    NOT NULL, -- office | remote | holiday

            UNIQUE (user_id, date)
        );

        CREATE TABLE IF NOT EXISTS notes
        (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date    TEXT    NOT NULL,
            content TEXT,

            UNIQUE (user_id, date)
        );
    `)
}