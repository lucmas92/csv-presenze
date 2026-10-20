import {serverSupabaseClient} from "#supabase/server";
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const currentUser = event.context.user
    if (currentUser.role !== 'admin')
        throw createError({
            statusCode: 403,
            statusMessage: 'Non hai il permesso'
        })

    const id = body?.id
    const username = body?.username
    const client = await serverSupabaseClient(event)


    // recupero uuid dell'utente per aggiornare la password
    const { data: utente, error: erroreDb } = await client
        .from('users')
        .select('auth_id')
        .eq('id', id)
        .single()

    if (erroreDb || !utente) {
        throw new Error('Utente non trovato nel database')
    }
    const config = useRuntimeConfig()
    const supabaseServiceRoleKey = config.supabaseServiceRoleKey // Ora è disponibile e sicura!
    const supabaseUrl = config.supabaseUrl // Ora è disponibile e sicura!

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Errore reset password!')
    }
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false // Disabilita la persistenza della sessione per il client admin
        }
    })

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        utente['auth_id'],
        { password: username }
    )
    if (error) {
        throw new Error(`Errore reset password: ${error.message}`)
    }

    return {success: false}
})