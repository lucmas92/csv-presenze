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
      <span id="counter">{{count}}</span>
      <span id="description">{{description}}</span>
    </div>
  </div>
</template>