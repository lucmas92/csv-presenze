import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('top_office_users')
        .select('name, role, giorni_ufficio')
        .limit(5)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il recupero dei dati top utenti: ${error.message}`
        })
    }

    return data
})