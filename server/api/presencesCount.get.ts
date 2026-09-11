import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const date = query.date as string

    if (!date) {
        return {
            success: true,
            count: 0
        }
    }

    const client = await serverSupabaseClient(event)

    // 1. Eseguiamo le due query di conteggio in parallelo per ottimizzare le prestazioni
    const [presencesRes, guestsRes] = await Promise.all([
        // Query 1: Presenze in ufficio e non in riunione
        client
            .from('presences')
            .select('*', { count: 'exact', head: true })
            .eq('date', date)
            .eq('is_in_meeting', false)
            .eq('status', 'office'),

        // Query 2: Ospiti nella data indicata
        client
            .from('guests')
            .select('*', { count: 'exact', head: true })
            .eq('date', date)
    ])

    if (presencesRes.error || guestsRes.error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il conteggio: ${presencesRes.error?.message || guestsRes.error?.message}`
        })
    }

    // 2. Calcolo del totale
    const presencesCount = presencesRes.count ?? 0
    const guestsCount = guestsRes.count ?? 0

    return {
        success: true,
        count: presencesCount + guestsCount
    }
})