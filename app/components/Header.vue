<script setup lang="ts">
import {
  Martini
} from 'lucide-vue-next'

import { ref, computed, onMounted, onUnmounted } from 'vue'

// 1. Creiamo una ref che aggiornerà l'ora corrente ogni minuto
const oraAttuale = ref(new Date())
let timer: ReturnType<typeof setInterval>

// Aggiorna la ref ogni 60 secondi per far ricalcolare la computed
onMounted(() => {
  timer = setInterval(() => {
    oraAttuale.value = new Date()
  }, 60000)
})

onUnmounted(() => {
  clearInterval(timer)
})

// Easter Egg: restituisce true se è scattato l'orario del weekend
const isWeekendMode = computed<boolean>(() => {
  const data = oraAttuale.value

  const isFriday = data.getDay() === 5 // 5 corrisponde a Venerdì

  // Calcoliamo i minuti passati da inizio giornata per non impazzire con le stringhe
  const minutiAttuali = data.getHours() * 60 + data.getMinutes()
  const minutiSoglia = 17 * 60 + 30 // 17:30 = 1050 minuti

  const isNight = minutiAttuali >= minutiSoglia

  return isFriday && isNight
})
</script>
<template>
  <header class="bg-white border-b border-slate-100 sticky flex flex-col top-0 z-20"
          style="padding-top: max(env(safe-area-inset-top,0px), 0px)">

    <!-- Top row -->
    <div class="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
      <div>
        <h1 class="text-base font-semibold text-slate-900 flex"><Martini v-if="isWeekendMode"/> Gestione Presenze </h1>


        <p class="text-xs text-slate-400 mt-0.5" id="range"></p>
      </div>
      <slot name="default"></slot>
    </div>
    <slot name="dayStrip"></slot>
  </header>
</template>