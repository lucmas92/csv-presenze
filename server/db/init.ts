import db from './client'

export function initDB() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users
        (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT NOT NULL,
            username      TEXT NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role          VARCHAR(50)  NOT NULL,
            is_active     TINYINT(1)   NOT NULL DEFAULT 1,
            last_login_at DATETIME     NULL,
            UNIQUE (username)
        );

        CREATE TABLE IF NOT EXISTS user_favorites
        (
            user_id          INTEGER NOT NULL,
            favorite_user_id INTEGER NOT NULL,

            UNIQUE (user_id, favorite_user_id)
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

        CREATE TABLE IF NOT EXISTS guests
        (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            guest_name TEXT,
            date       TEXT NOT NULL, -- YYYY-MM-DD
            UNIQUE (guest_name, date)
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