import db from '../db/client'
import {verifyPassword} from "~/utils/password";
import {User} from "~/types/User";

export default defineEventHandler(async (event) => {

    const query = getQuery(event)
    const withoutGuests = !query.withGuests
    const onlyGuests = query.onlyGuests
    let sql = "SELECT * FROM users WHERE 1=1 ";
    if (withoutGuests)
        sql += "AND role != 'guest' "

    if (onlyGuests)
        sql += "AND role = 'guest'"

    const usersRows = db.prepare(sql).all() as User[]
    let users: User[] = []
    for(let i = 0; i< usersRows.length; i++){
        const userRow = usersRows[i] as User
        const isDefaultPassword = await verifyPassword(userRow.username, userRow.password_hash!)
        users.push(
            {
                id: userRow.id,
                name:userRow.name,
                username:userRow.username,
                role:userRow.role,
                is_active:userRow.is_active,
                is_default_password:isDefaultPassword,
                last_login_at:userRow.last_login_at,
            }
        )
    }
    return users
})