import db from '../db/client'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { guest_name, date } = body

    const stmt = db.prepare(`
    INSERT INTO guests (guest_name, date)
    VALUES (?, ?)
  `)

    stmt.run(guest_name, date)

    return { success: true }
})