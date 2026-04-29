import db from '../db/client'

export default defineEventHandler(async (event) => {
    const { user_id, date } = await readBody(event)

    db.prepare(`
        DELETE FROM notes
        WHERE user_id = ? AND date = ?
    `).run(user_id, date)

    return { deleted: true }
})