import { initDB } from '#server/db/init'
import {updateDB} from "#server/db/update";

export default defineNitroPlugin(() => {
    console.log('initBD..')
    initDB()
    updateDB()
})