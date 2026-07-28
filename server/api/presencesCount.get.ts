import db from '../db/client'

export default defineEventHandler((event) => {
    const query = getQuery(event)

    const date = query.date as string

    const resultPresences = db.prepare(`
        SELECT COUNT(*) as total
        FROM presences
        WHERE date = ? AND is_in_meeting = false and status == 'office'
    `).get(date) as { total: number } | undefined

    const resultGuests = db.prepare(`
        SELECT COUNT(*) as total
        FROM guests
        WHERE date = ?
    `).get(date) as { total: number } | undefined

    const count = (resultPresences ? resultPresences.total : 0)
        + (resultGuests ? resultGuests.total : 0)

    return {
        success: true,
        count: count
    }
})