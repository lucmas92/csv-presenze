import db from '../../db/client'

export default defineEventHandler(() => {
    return db.prepare("SELECT\n" +
        "    u.name,\n" +
        "    SUM(CASE WHEN p.status = 'office' THEN 1.0 ELSE 0 END) as ufficio,\n" +
        "    COUNT(*) as totale,\n" +
        "    ROUND(SUM(CASE WHEN p.status = 'office' THEN 1.0 ELSE 0 END)\n" +
        "      / COUNT(*) * 100, 1) as percentuale\n" +
        "  FROM presences p JOIN users u ON u.id = p.user_id\n" +
        "  GROUP BY p.user_id, u.name\n" +
        "  ORDER BY percentuale DESC").all()
})