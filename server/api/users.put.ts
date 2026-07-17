import db from '../db/client'
import {SqliteError} from "better-sqlite3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const id = body?.id
    const name = body?.name?.trim()
    const username = body?.username?.trim()

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Nome obbligatorio'
        })
    }
    if (!username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username obbligatorio'
        })
    }
    try {

        const stmt = db.prepare(`
            UPDATE users
            set name     = ?,
                username = ?
            where id = ?
        `)

        stmt.run(name, username, id)
    } catch (e) {
        if (e instanceof SqliteError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Username già registrato',
            })
        }
        throw e
    }

    return {success: true}
})