import db from '../db/client'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { user_id, date, status } = body

    const stmt = db.prepare(`
    INSERT INTO presences (user_id, date, status)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, date)
    DO UPDATE SET status = excluded.status
  `)

    stmt.run(user_id, date, status)

    return { success: true }
})