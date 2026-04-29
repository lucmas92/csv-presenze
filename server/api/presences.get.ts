import db from '../db/client'

export default defineEventHandler((event) => {
    const query = getQuery(event)

    const from = query.from as string
    const to = query.to as string

    if (!from || !to) {
        return []
    }

    const stmt = db.prepare(`
    SELECT * FROM presences
    WHERE date BETWEEN ? AND ?
  `)

    return stmt.all(from, to)
})