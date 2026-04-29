import Database from 'better-sqlite3'
import { join } from 'path'

const db = new Database(
    join(process.cwd(), 'server/db/database.sqlite')
)

export default db