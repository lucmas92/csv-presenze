<script setup lang="ts">
import {Briefcase, Home, Minus, Plane} from "lucide-vue-next";
</script>
<template>
  <div class="flex gap-4">
    <div class="flex gap-2 bg-green-200 p-2 rounded-md">
      <Briefcase :size="18"/>
      Presente
    </div>
    <div class="flex gap-2 bg-gray-200 p-2 rounded-md">
      <Home :size="18"/>
      Da casa
    </div>
    <div class="flex gap-2 bg-orange-200 p-2 rounded-md">
      <Plane :size="18"/>
      Ferie
    </div>
    <div class="flex gap-2 p-2 rounded-md">
      <Minus :size="16"/>
      Non impostato
    </div>
  </div>
</template>