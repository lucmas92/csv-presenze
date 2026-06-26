<script setup>
import {
  Calendar1,
  TriangleAlert,
    Lock
} from 'lucide-vue-next'
import Header from "~/components/Header.vue";
</script>
<template>

  <div class="h-screen overflow-scroll pb-48 md:pb-0">
    <Header class="mb-2">
      <template v-slot:default>
        <div class="flex items-center gap-2 md:gap-3">
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
         class="flex gap-4 flex-col items-center justify-center min-h-64">
    </div>
  </div>
</template>