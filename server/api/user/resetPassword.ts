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

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
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