import db from '../db/client'
import {SqliteError} from "better-sqlite3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const {guest_name, date} = body

    const stmt = db.prepare(`
        INSERT INTO guests (guest_name, date)
        VALUES (?, ?)
    `)

    try{
        stmt.run(guest_name, date)
    }catch(e){
        if (e instanceof SqliteError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Guest già registrato per questa data',
            })
        }
        throw e
    }

    return {success: true}
})