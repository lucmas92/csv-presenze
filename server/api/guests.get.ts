import db from '../db/client'

export default defineEventHandler((event) => {
    const query = getQuery(event)

    const from = query.fromQuery as string
    const to = query.toQuery as string

    if (!from || !to) {
        return []
    }

    const stmt = db.prepare(`
    SELECT * FROM guests
    WHERE date BETWEEN ? AND ?
  `)

    return stmt.all(from, to)
})