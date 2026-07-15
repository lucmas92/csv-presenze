import db from '../db/client'
import {SqliteError} from "better-sqlite3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const user_id = body?.user_id?.trim()
    const favorite_user_id = body?.favorite_user_id?.trim()

    const stmt = db.prepare(`
        INSERT INTO user_favorites (user_id, favorite_user_id)
        VALUES (?, ?)
    `)

    try {
        const result = stmt.run(user_id, favorite_user_id)
    } catch (e) {
        if (e instanceof SqliteError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Preferito già registrato',
            })
        }
        throw e
    }

    return {success: true}
})