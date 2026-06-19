import db from '../db/client'

export default defineEventHandler(async (event) => {
    const { guest_name, date } = await readBody(event)

    db.prepare(`
        DELETE FROM guests
        WHERE guest_name = ? AND date = ?
    `).run(guest_name, date)

    return { deleted: true }
})