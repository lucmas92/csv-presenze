<script setup>
definePageMeta({
  protected: true,
})
import Header from "~/components/Header.vue";
import AffollamentoPerGiorno from "~/components/stats/AffollamentoPerGiorno.vue";
import StatoPerPersona from "~/components/stats/StatoPerPersona.vue";
import ColleghiVsOspiti from "~/components/stats/ColleghiVsOspiti.vue";
import TrendSettimanale from "~/components/stats/TrendSettimanale.vue";
import PresenzePerPersona from "~/components/stats/PresenzePerPersona.vue";
</script>
<template>

  <div class="h-screen overflow-scroll pb-48 md:pb-0">
    <Header class="mb-2"/>
    <div
        class="flex gap-4 flex-wrap items-center justify-center min-h-64">
      <AffollamentoPerGiorno/>
      <StatoPerPersona/>
      <PresenzePerPersona/>
      <ColleghiVsOspiti/>
      <TrendSettimanale/>
    </div>
  </div>
</template>