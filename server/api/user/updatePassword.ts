import db from '../../db/client'
import {hashPassword, verifyPassword} from "~/utils/password";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const currentUser = event.context.user

    const currentPassword = body?.currentPassword
    const newPassword = body?.newPassword
    const validateNewPassword = body?.validateNewPassword

    const currentPasswordIsValid = await verifyPassword(currentPassword, currentUser.password_hash)

    if (!currentPasswordIsValid){
        throw createError({
            statusCode: 400,
            statusMessage: 'Password corrente non valida!',
        })
    }

    if (newPassword !== validateNewPassword){
        throw createError({
            statusCode: 400,
            statusMessage: 'Le due password non coincidono!',
        })
    }

    if (newPassword === currentPassword){
        throw createError({
            statusCode: 400,
            statusMessage: 'La nuova password deve essere diversa dalla precedente!',
        })
    }

    if (newPassword.length < 8){
        throw createError({
            statusCode: 400,
            statusMessage: 'La password deve avere almeno 8 caratteri!',
        })
    }

    const newPasswordHash = await hashPassword(newPassword)

    const stmt = db.prepare(`
        UPDATE users
        set password_hash = ?
        where id = ?
    `)

    const result = stmt.run(newPasswordHash, currentUser.id)

    return {success: true}
})