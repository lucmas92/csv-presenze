import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { hashPassword } from '~/utils/password'

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

    const name = body?.name?.trim()
    const username = body?.username?.trim()
    const isGuest = body?.isGuest as boolean

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

    const role = isGuest ? 'guest' : 'user'
    const password_hash = await hashPassword(username)

    // 2. Client Supabase basato sulla sessione utente
    const client = await serverSupabaseClient(event)

    // 3. Inserimento del record e restituzione dell'ID generato
    const { data, error } = await client
        .from('users')
        .insert({
            name,
            username,
            password_hash,
            role
        })
        .select('id')
        .single()

    if (error) {
        if (error.code === '23505') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Username già esistente'
            })
        }

        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante la creazione dell'utente: ${error.message}`
        })
    }

    return {
        id: data.id,
        name,
        username
    }
})