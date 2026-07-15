import db from '../db/client'

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

    const stmt = db.prepare(`
        UPDATE users set name = ?, username = ? where id = ?
    `)

    const result = stmt.run(name, username, id)

    return {
        id: result.lastInsertRowid,
        name,
        username
    }
})