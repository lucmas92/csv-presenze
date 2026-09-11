import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('monthly_presence_guest_stats')
        .select('*')

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il recupero dei dati mensili: ${error.message}`
        })
    }

    return data
})