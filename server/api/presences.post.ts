import db from '../db/client'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const currentUser = event.context.user

    const {user_id, date, status, isInMeeting, isEatingOut} = body

    if (currentUser.id !== user_id && currentUser.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Not authorized',
        })
    }

    const stmt = db.prepare(`
        INSERT INTO presences (user_id, date, status, is_in_meeting, is_eating_out)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, date)
            DO UPDATE SET status = excluded.status,  is_in_meeting = excluded.is_in_meeting,   is_eating_out = excluded.is_eating_out 
    `)

    try {

        stmt.run(user_id, date, status, isInMeeting ? 1 : 0, isEatingOut ? 1 : 0)
        return {success: true}
    } catch (e) {
        console.error(e)
        return {success: false}

    }

})