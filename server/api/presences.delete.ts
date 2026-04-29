import db from '../db/client'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { user_id, date } = body

    db.prepare(`
    DELETE FROM presences
    WHERE user_id = ? AND date = ?
  `).run(user_id, date)

    return { success: true }
})