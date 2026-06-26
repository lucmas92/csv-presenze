import db from '../../db/client'

export default defineEventHandler(() => {
    return db.prepare("SELECT u.name, p.status, COUNT(*) as giorni\n" +
        "FROM presences p\n" +
        "JOIN users u ON u.id = p.user_id\n" +
        "GROUP BY p.user_id, u.name, p.status\n" +
        "ORDER BY u.name, p.status").all()
})