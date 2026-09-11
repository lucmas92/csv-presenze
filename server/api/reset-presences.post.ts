import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    // 1. Verifica la sessione dell'utente
    const authUser = await serverSupabaseUser(event)
    if (!authUser) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorizzato'
        })
    }

    const client = await serverSupabaseClient(event)

    // 2. Recupera il ruolo dell'utente dalla tabella public.users
    const username = authUser.email?.split('@')[0]

    const { data: userData, error: userError } = await client
        .from('users')
        .select('role')
        .eq('username', username)
        .single()

    if (userError || !userData || userData.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Non hai il permesso di eseguire questa operazione'
        })
    }

    // 3. Esegue la cancellazione di tutti i record con il client standard
    const [presencesRes, notesRes, guestsRes] = await Promise.all([
        client.from('presences').delete().neq('id', 0),
        client.from('notes').delete().neq('id', 0),
        client.from('guests').delete().neq('id', 0)
    ])

    if (presencesRes.error || notesRes.error || guestsRes.error) {
        const errorMsg = presencesRes.error?.message || notesRes.error?.message || guestsRes.error?.message
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il reset dei dati: ${errorMsg}`
        })
    }

    return { success: true }
})