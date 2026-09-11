import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    // 1. Verifica autenticazione utente
    const authUser = await serverSupabaseUser(event)
    if (!authUser) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorizzato'
        })
    }

    // 2. Controllo del ruolo 'admin'
    const currentUser = event.context.user
    if (currentUser?.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Non hai il permesso'
        })
    }

    const body = await readBody(event)
    const id = body?.id

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Id obbligatorio'
        })
    }

    // 3. Client Supabase basato sulla sessione utente
    const client = await serverSupabaseClient(event)

    // 4. Esecuzione della DELETE
    const { error } = await client
        .from('users')
        .delete()
        .eq('id', id)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante la cancellazione dell'utente: ${error.message}`
        })
    }

    return { success: true }
})