import db from '../../db/client'

export default defineEventHandler(() => {
    return db.prepare("SELECT\n" +
        "    strftime('%Y-%m', d.date) as mese,\n" +
        "    COALESCE(p.colleghi, 0) as colleghi,\n" +
        "    COALESCE(g.ospiti, 0) as ospiti\n" +
        "  FROM (\n" +
        "    SELECT DISTINCT date FROM presences WHERE status='office'\n" +
        "    UNION SELECT DISTINCT date FROM guests\n" +
        "  ) d\n" +
        "  LEFT JOIN (\n" +
        "    SELECT date, COUNT(*) as colleghi FROM presences\n" +
        "    WHERE status='office' GROUP BY date\n" +
        "  ) p ON p.date = d.date\n" +
        "  LEFT JOIN (\n" +
        "    SELECT date, COUNT(*) as ospiti FROM guests GROUP BY date\n" +
        "  ) g ON g.date = d.date\n" +
        "  GROUP BY mese ORDER BY mese").all()
})