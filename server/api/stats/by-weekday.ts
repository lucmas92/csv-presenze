import db from '../../db/client'

export default defineEventHandler(() => {
    return db.prepare("SELECT\n" +
        "  CASE strftime('%w', p.date)\n" +
        "    WHEN '1' THEN 'Lunedì'\n" +
        "    WHEN '2' THEN 'Martedì'\n" +
        "    WHEN '3' THEN 'Mercoledì'\n" +
        "    WHEN '4' THEN 'Giovedì'\n" +
        "    WHEN '5' THEN 'Venerdì'\n" +
        "  END as giorno,\n" +
        "  strftime('%w', p.date) as dow,\n" +
        "  ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT strftime('%Y-%W', p.date)), 1) as media_presenze\n" +
        "FROM presences p\n" +
        "WHERE p.status = 'office'\n" +
        "GROUP BY dow\n" +
        "ORDER BY dow").all()
})