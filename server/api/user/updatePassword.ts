import {serverSupabaseClient} from "#supabase/server";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const client = await serverSupabaseClient(event)

    const currentPassword = body?.currentPassword
    const newPassword = body?.newPassword
    const validateNewPassword = body?.validateNewPassword

    if (newPassword.length < 6) {
        throw createError({
            statusCode: 400,
            statusMessage: 'La password deve avere almeno 6 caratteri!',
        })
    }

    if (newPassword !== validateNewPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Le due password non coincidono!',
        })
    }

    // const {error: reauthError} = await client.auth.reauthenticate()
    // if (reauthError) {
    //     console.log('reauthError', reauthError)
    //     throw createError({
    //         statusCode: 400,
    //         statusMessage: 'Errore autenticazione',
    //     })
    // }

    const {error} = await client.auth.updateUser({
        password: newPassword,
        current_password: currentPassword
    })

    if (error) {
        console.log('updatePassword.error', error)
        console.log('updatePassword.error.code', error.code)
        const authErrorMessages: Record<string, string> = {
            invalid_credentials: 'Email o password non corretti.',
            email_not_confirmed: 'Devi confermare la tua email prima di accedere.',
            user_not_found: 'Nessun utente trovato con questi dati.',
            weak_password: 'La password è troppo debole. Usa almeno 8 caratteri, con numeri e simboli.',
            same_password: 'La nuova password deve essere diversa da quella attuale.',
            current_password_invalid: 'La password attuale inserita non è corretta.',
        }

        const defaultMessage = 'Si è verificato un errore. Riprova più tardi.'
        const translateAuthError = (error: { code?: string; message?: string } | null): string => {
            if (!error) return ''
            if (error.code && authErrorMessages[error.code]) {
                return authErrorMessages[error.code]!
            }
            return defaultMessage
        }

        throw createError({
            statusCode: 400,
            message: translateAuthError(error)
        })
    }

    return {success: true}
})