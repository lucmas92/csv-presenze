import db from "#server/db/client";
import {hashPassword, verifyPassword} from "~/utils/password";
import jwt from 'jsonwebtoken'
import type { User } from '~/types/User'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const username = typeof body?.username === 'string' ? body.username.trim() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username e password sono obbligatori',
        })
    }

    const users: User[] = db.prepare(`
        SELECT *
        FROM users
        WHERE username = ?
    `).all(username) as User[]

    const user = users[0] as User
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

    const config = useRuntimeConfig(event)
    const token = jwt.sign(
        {
            userId: user.id,
        },
        config.jwtSecret, // La chiave segreta definita nel nuxt.config
        {
            expiresIn: '1d' // Il token scadrà automaticamente dopo 1 giorno
        }
    )

    setCookie(event, 'auth_token', token, {
        httpOnly: true, // Più sicuro, il JS del frontend non può leggerlo
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 1 giorno
    })

    return {
        ok: true,
        token: token,
        user: user,
    }
})