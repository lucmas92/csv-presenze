import db from '../../db/client'

export default defineEventHandler(() => {
    return db.prepare("SELECT u.name, u.role, COUNT(*) as giorni_ufficio\n" +
        "  FROM presences p JOIN users u ON u.id = p.user_id\n" +
        "  WHERE p.status = 'office'\n" +
        "  GROUP BY p.user_id, u.name\n" +
        "  ORDER BY giorni_ufficio DESC\n" +
        "  LIMIT 5").all()
})