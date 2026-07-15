import db from '../db/client'

export default defineEventHandler((event) => {
    const query = getQuery(event)

    const user_id = query.userId as number

    const stmt = db.prepare(`
    SELECT * FROM user_favorites
    WHERE user_id = ?
  `)

    return stmt.all(user_id)
})