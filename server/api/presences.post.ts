import db from '../db/client'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const currentUser = event.context.user

    const { user_id, date, status } = body

    if (currentUser.id !== user_id){
        throw createError({
            statusCode: 403,
            statusMessage: 'Not authorized',
        })
    }

    const stmt = db.prepare(`
    INSERT INTO presences (user_id, date, status)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, date)
    DO UPDATE SET status = excluded.status
  `)

    stmt.run(user_id, date, status)

    return { success: true }
})