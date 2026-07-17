import db from '../db/client'

export default defineEventHandler((event) => {

    const query = getQuery(event)
    const withoutGuests = !query.withGuests
    const onlyGuests = query.onlyGuests
    let sql = "SELECT * FROM users WHERE 1=1 ";
    if (withoutGuests)
        sql += "AND role != 'guest' "

    if (onlyGuests)
        sql += "AND role = 'guest'"

    return db.prepare(sql).all()
})