import db from '../db/client'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const id = body?.id
    const name = body?.name?.trim()

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Nome obbligatorio'
        })
    }

    const stmt = db.prepare(`
        UPDATE users set name = ? where id = ?
    `)

    const result = stmt.run(name, id)

    return {
        id: result.lastInsertRowid,
        name
    }
})