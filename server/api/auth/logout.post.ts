export default defineEventHandler(async (event) => {
    // Cancella il cookie impostando una data di scadenza passata
    deleteCookie(event, 'auth_token')

    return { success: true, message: 'Sessione eliminata correttamente' }
})