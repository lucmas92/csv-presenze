import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    // 1. Verifica autenticazione
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorizzato'
        })
    }

    const { user_id, date, content } = await readBody(event)

    if (!user_id || !date) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Parametri obbligatori mancanti (user_id o date)'
        })
    }

    const client = await serverSupabaseClient(event)

    // 2. Se il contenuto è vuoto → DELETE
    if (!content || content.trim() === '') {
        const { error: deleteError } = await client
            .from('notes')
            .delete()
            .eq('user_id', user_id)
            .eq('date', date)

        if (deleteError) {
            throw createError({
                statusCode: 500,
                statusMessage: `Errore durante la cancellazione della nota: ${deleteError.message}`
            })
        }

        return { deleted: true }
    }

    // 3. Se presente contenuto → UPSERT (Insert o Update su conflitto)
    const { error: upsertError } = await client
        .from('notes')
        .upsert(
            {
                user_id: user_id,
                date: date,
                content: content
            },
            {
                onConflict: 'user_id,date' // Nome delle colonne con vincolo UNIQUE o PRIMARY KEY composta
            }
        )

    if (upsertError) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il salvataggio della nota: ${upsertError.message}`
        })
    }

    return { saved: true }
})