<script setup lang="ts">
</script>
<template>
  <header class="bg-white border-b border-slate-100 sticky flex flex-col top-0 z-20"
          style="padding-top: max(env(safe-area-inset-top,0px), 0px)">

    <!-- Top row -->
    <div class="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
      <div>
        <h1 class="text-base font-semibold text-slate-900">Gestione Presenze</h1>
        <p class="text-xs text-slate-400 mt-0.5" id="range"></p>
      </div>
      <slot name="default"></slot>
    </div>
    <slot name="dayStrip"></slot>
  </header>
</template>