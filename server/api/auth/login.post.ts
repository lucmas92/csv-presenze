import {serverSupabaseClient} from '#supabase/server'
import jwt from "jsonwebtoken";
import {User} from "~/types/User";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const client = await serverSupabaseClient(event)

    const username = typeof body?.username === 'string' ? body.username.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username e password sono obbligatori',
        })
    }

    // const users: User[] = db.prepare(`
    //     SELECT *
    //     FROM users
    //     WHERE username = ? and role != 'guest'
    // `).all(username) as User[]
    //
    // const user = users[0] as User
    // if (!user) {
    //     throw createError({
    //         statusCode: 401,
    //         statusMessage: 'Credenziali non valide',
    //     })
    // }
    //
    // const valid = await verifyPassword(password, user.password_hash!)
    //
    // if (!valid) {
    //     throw createError({
    //         statusCode: 401,
    //         statusMessage: 'Credenziali non valide',
    //     })
    // }


    const emailFormatted = `${username}@sanmarcoinformatica.it`

    const {data, error} = await client.auth.signInWithPassword({
        email: emailFormatted,
        password: password
    })

    if (error) {
        console.error('Errore durante il login:', error.message)
        throw createError({
            statusCode: 401,
            statusMessage: 'Login non riuscito',
        })
    }

    const {data: user} = await client
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Utente non trovato!',
        })
    }

    // todo: provare a togliere JWT custom e tenere access_token supabase
    // const token = data.session.access_token

    const config = useRuntimeConfig(event)
    const token = jwt.sign(
        {
            userId: (user as User).id,
        },
        config.jwtSecret, // La chiave segreta definita nel nuxt.config
        {
            expiresIn: '1d' // Il token scadrà automaticamente dopo 1 giorno
        }
    )

    setCookie(event, 'auth_token', token, {
        httpOnly: true, // Più sicuro, il JS del frontend non può leggerlo
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 // 1 ora
    })

    return {
        ok: true,
        token: token,
        user: user,
    }
})