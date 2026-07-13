// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
    runtimeConfig: {
        jwtSecret: process.env.JWT_SECRET // Disponibile solo lato server
    }
})