import db from '../db/client'

export default defineEventHandler((event) => {
    const query = getQuery(event)

    const date = query.date as string

    const result = db.prepare(`
      SELECT COUNT(*) as total 
      FROM presences WHERE date = ?
    `).get(date) as { total: number } | undefined

    const count = result ? result.total : 0

    return {
        success: true,
        count: count
    }
})