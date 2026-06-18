<script setup>
import {
  TriangleAlert
} from 'lucide-vue-next'

const resetPresenze = async () => {
  if (confirm('Sicuro?')) {
    await $fetch('/api/reset-presences', {
      method: 'POST',
    })
  }
}
</script>
<template>
  <div class="flex items-center justify-center p-6">
    <button class="flex border rounded p-2 items-center gap-2" @click="resetPresenze">
      <TriangleAlert/>
      Reset Presenze
    </button>
  </div>
</template>