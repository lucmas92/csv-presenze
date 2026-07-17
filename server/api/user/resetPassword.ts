import db from '../../db/client'
import {hashPassword} from "~/utils/password";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const currentUser = event.context.user
    if (currentUser.role !== 'admin')
        throw createError({
            statusCode: 403,
            statusMessage: 'Non hai il permesso'
        })

    const id = body?.id
    const username = body?.username

    const newPassword = await hashPassword(username)

    const stmt = db.prepare(`
        UPDATE users
        set password_hash = ?
        where id = ?
    `)

    const result = stmt.run(newPassword, id)

    return {success: true}
})