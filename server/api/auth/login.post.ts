import db from "#server/db/client";
import {randomUUID} from "node:crypto";
import {verifyPassword} from "~/utils/password";

interface User {
    id: number,
    password_hash: string,
    role: string,
    is_active: boolean,
    last_login_at: Date,
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const username = typeof body?.username === 'string' ? body.username.trim() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    console.log('body',body)

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username e password sono obbligatori',
        })
    }

    const users: User[] = db.prepare(`
        SELECT *
        FROM accounts
        WHERE username = ?
    `).all(username) as User[]


    const user = users[0]
    console.log('#############', user)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Credenziali non valide',
        })
    }

    const valid = await verifyPassword(password, user.password_hash)

    if (!valid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Credenziali non valide',
        })
    }

    const sessionId = randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // await db.session.create({
    //     data: {
    //         id: sessionId,
    //         userId: user.id,
    //         expiresAt,
    //     },
    // })

    setCookie(event, 'session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: expiresAt,
    })

    return {
        ok: true,
        user: {
            id: 1,
            name: 'Luca'
        },
    }
})