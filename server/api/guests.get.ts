import db from '../db/client'

export default defineEventHandler((event) => {
    const query = getQuery(event)

    const from = query.fromQuery as string
    const to = query.toQuery as string

    if (!from || !to) {
        return []
    }

    const stmt = db.prepare(`
    SELECT users.name as creator, guests.* FROM guests
     JOIN users on guests.created_by = users.id
    WHERE date BETWEEN ? AND ?
  `)

    return stmt.all(from, to)
})