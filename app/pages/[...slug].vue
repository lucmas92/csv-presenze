<script setup>
import {
  Compass
} from 'lucide-vue-next'
definePageMeta({
  protected: false,
  public: true,
})
</script>

<template>
  <div class="h-screen overflow-scroll pb-48 md:pb-0 ">
    <div class="flex justify-center items-center h-full">

      <div class="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">

        <!-- Icona di Errore (Bussola Smarrita) -->
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 mb-2">
          <Compass/>
        </div>

        <!-- Codice e Titolo Errore -->
        <div class="space-y-2">
            <span class="text-xs font-bold tracking-widest text-rose-600 uppercase bg-rose-50 px-2.5 py-1 rounded-full">
                Errore 404
            </span>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pagina Non Trovata
          </h1>
          <p class="text-sm text-slate-500 max-w-xs mx-auto">
            La pagina che stai cercando non esiste, è stata rimossa o l'URL inserito non è corretto.
          </p>
        </div>

        <!-- Pulsanti di Navigazione -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <!-- Torna alla Dashboard -->
          <a href="/" class="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition">
            <i data-lucide="home" class="w-4 h-4"></i>
            Torna alla Dashboard
          </a>
        </div>

        <!-- Footer Discreto -->
        <div class="text-[11px] text-slate-400 pt-4 border-t border-slate-100 flex items-center justify-center gap-1">
          <i data-lucide="calendar-range" class="w-3 h-3"></i>
          <span>Portale Presenze Aziendale</span>
        </div>

      </div>
    </div>
  </div>
</template>
<style scoped>
</style>