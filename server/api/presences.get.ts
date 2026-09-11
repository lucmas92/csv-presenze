import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const from = query.fromQuery as string
    const to = query.toQuery as string

    if (!from || !to) {
        return []
    }

    // 1. Inizializza il client Supabase lato server
    const client = await serverSupabaseClient(event)

    // 2. Sostituisci la query SQL con i metodi di Supabase (.gte e .lte per il range di date)
    const { data, error } = await client
        .from('presences')
        .select('*')
        .gte('date', from) // gte = Greater Than or Equal (>=)
        .lte('date', to)   // lte = Less Than or Equal (<=)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore Supabase: ${error.message}`
        })
    }

    // 3. Restituisci l'array dei risultati
    return data
})