import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    // 1. Verifica autenticazione utente
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorizzato'
        })
    }

    const body = await readBody(event)

    const id = body?.id
    const name = body?.name?.trim()
    const username = body?.username?.trim()

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID utente obbligatorio'
        })
    }

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Nome obbligatorio'
        })
    }

    if (!username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username obbligatorio'
        })
    }

    // 2. Client Supabase basato sulla sessione utente
    const client = await serverSupabaseClient(event)

    // 3. Esecuzione dell'UPDATE
    const { error } = await client
        .from('users')
        .update({ name, username })
        .eq('id', id)

    // 4. Gestione errori PostgreSQL
    if (error) {
        // Codice PostgreSQL 23505 = unique_violation (username già presente)
        if (error.code === '23505') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Username già registrato'
            })
        }

        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante l'aggiornamento: ${error.message}`
        })
    }

    return { success: true }
})