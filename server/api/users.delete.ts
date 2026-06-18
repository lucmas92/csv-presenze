import db from '../db/client'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const id = body?.id

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Id obbligatorio'
        })
    }

    const stmt = db.prepare(`
        DELETE FROM users where id = ?
    `)

    const result = stmt.run(id)

    return { success: true }
})