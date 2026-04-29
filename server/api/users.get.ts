import db from '../db/client'

export default defineEventHandler(() => {
    return db.prepare('SELECT * FROM users').all()
})