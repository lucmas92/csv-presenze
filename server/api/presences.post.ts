import {db} from '../db/client'

export default defineEventHandler((event) => {
    const weekId = getQuery(event).weekId

    return db.prepare(`
        SELECT *
        FROM presences
        WHERE week_id = ?
    `).all(weekId)
})