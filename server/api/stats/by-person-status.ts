import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('user_status_breakdown')
        .select('name, status, giorni')

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il recupero dei dati: ${error.message}`
        })
    }

    return data
})