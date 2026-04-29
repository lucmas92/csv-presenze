import { initDB } from '../db/init'

export default defineNitroPlugin(() => {
    console.log('initBD..')
    initDB()
})