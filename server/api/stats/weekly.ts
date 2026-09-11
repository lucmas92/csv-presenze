import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('weekly_office_stats')
        .select('*')

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il recupero dei dati settimanali: ${error.message}`
        })
    }

    return data
})