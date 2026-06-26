import db from '../../db/client'

export default defineEventHandler(() => {
    return db.prepare("SELECT\n" +
        "    strftime('%Y-%W', date) as settimana,\n" +
        "    COUNT(*) as totale_presenze,\n" +
        "    COUNT(DISTINCT user_id) as persone_diverse\n" +
        "  FROM presences\n" +
        "  WHERE status = 'office'\n" +
        "  GROUP BY settimana\n" +
        "  ORDER BY settimana").all()
})