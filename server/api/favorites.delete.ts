import db from '../db/client'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const currentUser = event.context.user

    const { favorite_user_id } = body

    db.prepare(`
    DELETE FROM user_favorites
    WHERE user_id = ? AND favorite_user_id = ?
  `).run(currentUser.id, favorite_user_id)

    return { success: true }
})