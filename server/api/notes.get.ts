import db from '../db/client'

export default defineEventHandler((event) => {
    const {fromQuery, toQuery} = getQuery(event)

    return db.prepare(`
        SELECT *
        FROM notes
        WHERE date BETWEEN ? AND ?
    `).all(fromQuery, toQuery)
})