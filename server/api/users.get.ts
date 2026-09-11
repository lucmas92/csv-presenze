import { serverSupabaseClient } from '#supabase/server'
import { verifyPassword } from "~/utils/password"
import { User } from "~/types/User"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const withoutGuests = !query.withGuests
    const onlyGuests = query.onlyGuests

    // 1. Inizializziamo il client Supabase lato server
    const client = await serverSupabaseClient(event)

    // 2. Costruiamo la query in modo dinamico
    let dbQuery = client.from('users').select('*')

    if (withoutGuests) {
        dbQuery = dbQuery.neq('role', 'guest')
    }

    if (onlyGuests) {
        dbQuery = dbQuery.eq('role', 'guest')
    }

    // 3. Eseguiamo la query asincrona
    const { data: usersRows, error } = await dbQuery

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il recupero degli utenti: ${error.message}`
        })
    }

    let users: User[] = []

    // 4. Mappiamo i risultati mantenendo la tua verifica per la password predefinita
    if (usersRows) {
        for (let i = 0; i < usersRows.length; i++) {
            const userRow = usersRows[i]! as User
            const isDefaultPassword = await verifyPassword(userRow.username, userRow.password_hash!)

            users.push({
                id: userRow.id,
                name: userRow.name,
                username: userRow.username,
                role: userRow.role,
                is_active: userRow.is_active,
                is_default_password: isDefaultPassword,
                last_login_at: userRow.last_login_at,
            })
        }
    }

    return users
})