import db from '../db/client'

export default defineEventHandler(async (event) => {
    const { user_id, date, content } = await readBody(event)

    if (!content || content.trim() === '') {
        // se vuoto → delete logico
        db.prepare(`
      DELETE FROM notes
      WHERE user_id = ? AND date = ?
    `).run(user_id, date)

        return { deleted: true }
    }

    db.prepare(`
    INSERT INTO notes (user_id, date, content)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, date)
    DO UPDATE SET content = excluded.content
  `).run(user_id, date, content)

    return { saved: true }
})