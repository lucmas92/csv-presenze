// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
export default defineNuxtConfig({
    ssr: true,
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/supabase'],
    runtimeConfig: {
        jwtSecret: process.env.JWT_SECRET // Disponibile solo lato server
    },
    supabase: {
        // Disabilita il reindirizzamento automatico alla pagina di login se non lo usi ancora
        redirect: false,
        types: fileURLToPath(new URL('./app/types/database.types.ts', import.meta.url))
    }
})