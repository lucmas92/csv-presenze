import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('weekday_office_averages')
        .select('*')

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il recupero delle medie per giorno: ${error.message}`
        })
    }

    return data
})