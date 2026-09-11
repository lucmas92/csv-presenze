import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('user_presence_stats')
        .select('*')

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il recupero delle statistiche: ${error.message}`
        })
    }

    return data
})