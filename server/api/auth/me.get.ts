// server/api/auth/me.get.ts
import { getCookie } from 'h3'
import db from "#server/db/client";

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')

    console.log('sessionId', sessionId)

    if (!sessionId) {
        return null
    }


    return {
        id: '1',
        name: '1'
    }
})