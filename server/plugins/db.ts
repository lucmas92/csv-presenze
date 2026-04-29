import { initDB } from '../db/init'

export default defineNitroPlugin(() => {
    initDB()
})