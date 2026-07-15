import db from '../db/client'

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

    const stmt = db.prepare(`
        INSERT INTO users (name, username)
        VALUES (?, ?)
    `)

    const result = stmt.run(name, username)

    return {
        id: result.lastInsertRowid,
        name,
        username
    }
})