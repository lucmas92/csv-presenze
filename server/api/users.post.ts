import db from '../db/client'
import {hashPassword} from "~/utils/password";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

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

    const role = 'user'

    const password_hash = await hashPassword(username)

    const stmt = db.prepare(`
        INSERT INTO users (name, username, password_hash, role)
        VALUES (?, ?, ?, ?)
    `)

    const result = stmt.run(name, username, password_hash, role)

    return {
        id: result.lastInsertRowid,
        name,
        username
    }
})