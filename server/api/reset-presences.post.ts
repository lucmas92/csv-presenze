import db from '../db/client'

export default defineEventHandler(async (event) => {
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