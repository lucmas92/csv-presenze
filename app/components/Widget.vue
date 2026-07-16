<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    required: true
  },
  description:{
    type: String,
    required: true
  }
})
</script>
<template>
  <div class="flex gap-4 border border-gray-300 rounded-xl p-3">
    <div class="icon px-4 border border-gray-300 flex items-center rounded-xl">
      <slot/>
    </div>
    <div class="flex flex-col">
      <span id="counter" class="text-xl font-bold">{{count}}</span>
      <span id="description" class="text-sm text-gray-500 font-semibold">{{description}}</span>
    </div>
  </div>
</template>