import {serverSupabaseClient} from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event)

    try {
        const userId = event.context.user['id']

        const { error: resetError } = await client
            .from('users')
            .update({ last_login_at: null })
            .eq('id', userId)

        if (resetError) {
            throw createError({
                statusCode: 500,
                statusMessage: `Errore durante il reset dell'ultimo accesso: ${resetError.message}`
            })
        }

        // Disconnette l'utente e cancella i cookie di sessione
        const { error: authError } = await client.auth.signOut()

        if (authError) {
            console.error('Errore durante il logout:', authError.message)
        }
    } catch (error) {
    }

    // Cancella il cookie impostando una data di scadenza passata
    deleteCookie(event, 'auth_token')


    return {success: true, message: 'Sessione eliminata correttamente'}
})