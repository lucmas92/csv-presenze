import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const user_id = query.userId as string | number

    if (!user_id) {
        return []
    }

    // 1. Inizializziamo il client Supabase lato server
    const client = await serverSupabaseClient(event)

    // 2. Eseguiamo la query sulla tabella user_favorites
    const { data, error } = await client
        .from('user_favorites')
        .select('*')
        .eq('user_id', user_id)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il recupero dei preferiti: ${error.message}`
        })
    }

    return data ?? []
})