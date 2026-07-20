import db from './client'

export function updateDB() {

    // leggo versione database
    const row = db.prepare('PRAGMA user_version').get() as {user_version:number}

    let version = row.user_version

    console.log('Database version:', version)

    // per uso RESET
    db.prepare(`PRAGMA user_version = 0`).run()

    if (version < 1) {
        console.log('update 1')

        db.exec(`
            ALTER TABLE presences
                ADD COLUMN is_in_meeting TINYINT(1) NOT NULL DEFAULT 0;

            ALTER TABLE presences
                ADD COLUMN is_eating_out TINYINT(1) NOT NULL DEFAULT 0;
        `)
        db.prepare(`PRAGMA user_version = 1`).run()
    }

    db.pragma('schema_version')
}