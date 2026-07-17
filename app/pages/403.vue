<script setup>
import {
  ShieldAlert
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

        <!-- Icona di Errore -->
        <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-100 mb-2">
          <ShieldAlert/>
        </div>

        <!-- Codice e Titolo Errore -->
        <div class="space-y-2">
            <span
                class="text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-full">
                Errore 403
            </span>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">
            Accesso Non Autorizzato
          </h1>
          <p class="text-sm text-slate-500 max-w-xs mx-auto">
            Spiacenti, non disponi dei permessi necessari per visualizzare questa pagina o gestire queste presenze.
          </p>
        </div>

        <!-- Box Informativo / Dettaglio -->
        <div class="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 space-y-2">
        <span
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dettagli della richiesta</span>
          <div class="flex items-start gap-2.5 text-xs text-slate-600">
            <i data-lucide="info" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5"></i>
            <span>L'azione richiesta è riservata agli amministratori o ai responsabili di team.</span>
          </div>
        </div>

        <!-- Pulsanti di Navigazione -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <!-- Torna alla Dashboard -->
          <NuxtLink to="/"
             class="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
            Torna alla Dashboard
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>