// server/middleware/user.ts
import jwt from 'jsonwebtoken'
import db from "#server/db/client";

export default defineEventHandler((event) => {
    const config = useRuntimeConfig(event)
    const token = getCookie(event, 'auth_token')


    if (token) {
        try {
            // Decodifichiamo il token usando la chiave segreta
            const decoded = jwt.verify(token, config.jwtSecret) as { userId: number; username: string }

            const userId: number = decoded.userId

            const users = db.prepare(`
                    SELECT *
                    FROM users
                    WHERE id = ?
                `).all(userId) as any[]

            // Salviamo i dati dell'utente nel contesto dell'evento Nitro
            event.context.user = users[0]
        } catch (error) {
            console.error('error',error)
            // Se il token è scaduto o alterato, puliamo il cookie
            deleteCookie(event, 'auth_token')
        }
    }
})