import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    // 1. Verifica sessione utente
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorizzato'
        })
    }

    const body = await readBody(event)
    const currentUser = event.context.user
    const { user_id, date, status, isInMeeting, isEatingOut } = body

    // 2. Controllo autorizzazioni (solo l'utente proprietario o un admin)
    if (currentUser?.id !== user_id && currentUser?.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Not authorized'
        })
    }

    const client = await serverSupabaseClient(event)

    // 3. Upsert su Supabase con conversione booleana diretta
    const { error } = await client
        .from('presences')
        .upsert(
            {
                user_id: user_id,
                date: date,
                status: status,
                is_in_meeting: Boolean(isInMeeting),
                is_eating_out: Boolean(isEatingOut)
            },
            {
                onConflict: 'user_id,date' // Vincolo UNIQUE / Chiave primaria composta
            }
        )

    if (error) {
        console.error('Errore durante l\'upsert della presenza:', error.message)
        return { success: false }
    }

    return { success: true }
})