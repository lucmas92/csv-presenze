<script setup>
definePageMeta({
  protected: true,
})
import {
  Lock
} from 'lucide-vue-next'
import Header from "~/components/Header.vue";
import AffollamentoPerGiorno from "~/components/stats/AffollamentoPerGiorno.vue";
import StatoPerPersona from "~/components/stats/StatoPerPersona.vue";
import ColleghiVsOspiti from "~/components/stats/ColleghiVsOspiti.vue";
import TrendSettimanale from "~/components/stats/TrendSettimanale.vue";
import PresenzePerPersona from "~/components/stats/PresenzePerPersona.vue";
import {useAuthStore} from "~/stores/auth.ts";


const auth = useAuthStore()
const user = computed(() => auth.user)
</script>
<template>

  <div class="h-screen overflow-scroll pb-48 md:pb-0">
    <Header class="mb-2">
      <template v-slot:default>
        <div v-if="user.username=='lucmas'" class="flex items-center gap-2 md:gap-3">
          <div>Impostazioni</div>
          <NuxtLink to="/admin" exact
                    class="w-10 h-10 rounded-xl text-slate-400 hover:bg-blue-200 hover:text-blue-500 flex items-center justify-center"
                    title="Calendario">
            <Lock/>
          </NuxtLink>
        </div>
      </template>
    </Header>
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