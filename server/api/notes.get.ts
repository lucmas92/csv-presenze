import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const { fromQuery, toQuery } = getQuery(event)

    const from = fromQuery as string
    const to = toQuery as string

    if (!from || !to) {
        return []
    }

    // 1. Inizializziamo il client Supabase lato server
    const client = await serverSupabaseClient(event)

    // 2. Query asincrona con filtro tra due date (BETWEEN)
    const { data: notes, error } = await client
        .from('notes')
        .select('*')
        .gte('date', from)
        .lte('date', to)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il recupero delle note: ${error.message}`
        })
    }

    return notes ?? []
})