// server/middleware/user.ts
import jwt from 'jsonwebtoken'
import {serverSupabaseClient} from "#supabase/server";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const token = getCookie(event, 'auth_token')

    const client = await serverSupabaseClient(event)

    if (token) {
        try {
            // Decodifichiamo il token usando la chiave segreta
            const decoded = jwt.verify(token, config.jwtSecret) as { userId: number; username: string }

            const userId: number = decoded.userId

            const {data: user} = await client
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            // Salviamo i dati dell'utente nel contesto dell'evento Nitro
            event.context.user = user

            // Aggiorna il "last_seen" nel DB a ogni chiamata API dell'utente
            // Usiamo una query non bloccante (senza await se non è critica) per non rallentare l'app
            client
                .from('users')
                .update({ last_login_at: new Date().toISOString() })
                .eq('id', userId)
                .then(({ error }) => {
                    if (error) console.error('Errore aggiornamento last_login_at:', error.message)
                })

        } catch (error) {

            console.log('user.error:', error)

            // Se il token è scaduto o alterato, puliamo il cookie
            // deleteCookie(event, 'auth_token')
        }
    }
})