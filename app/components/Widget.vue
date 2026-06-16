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
  <div class="flex gap-4 border border-gray-300 rounded-md p-3">
    <div class="icon pt-2 px-2">
      <slot/>
    </div>
    <div class="flex flex-col">
      <span id="counter" class="text-xl">{{count}}</span>
      <span id="description" class="text-sm text-gray-500">{{description}}</span>
    </div>
  </div>
</template>