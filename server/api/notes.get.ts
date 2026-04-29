import db from '../db/client'

export default defineEventHandler((event) => {
    const {from, to} = getQuery(event)

    return db.prepare(`
        SELECT *
        FROM notes
        WHERE date BETWEEN ? AND ?
    `).all(from, to)
})