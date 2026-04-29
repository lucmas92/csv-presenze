import db from '../db/client'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const name = body?.name?.trim()

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Nome obbligatorio'
        })
    }

    const stmt = db.prepare(`
        INSERT INTO users (name)
        VALUES (?)
    `)

    const result = stmt.run(name)

    return {
        id: result.lastInsertRowid,
        name
    }
})