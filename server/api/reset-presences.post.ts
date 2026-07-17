import db from '../db/client'

export default defineEventHandler(async (event) => {

    const currentUser = event.context.user
    if (currentUser.role !== 'admin')
        throw createError({
            statusCode: 403,
            statusMessage: 'Non hai il permesso'
        })

    db.prepare(`
        DELETE
        FROM presences
    `).run()
    db.prepare(`
        DELETE
        FROM notes
    `).run()
    db.prepare(`
        DELETE
        FROM guests
    `).run()

    return {success: true}
})