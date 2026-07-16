import db from "#server/db/client";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig(event)
    const token = getCookie(event, 'auth_token')!

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as unknown as { userId: number; username: string }

        const userId: number = decoded.userId
        db.prepare("UPDATE users SET last_login_at = NULL WHERE id = ?").run(decoded.userId)
    } catch (error) {
    }

    // Cancella il cookie impostando una data di scadenza passata
    deleteCookie(event, 'auth_token')

    return {success: true, message: 'Sessione eliminata correttamente'}
})