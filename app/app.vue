<script setup>
import {
  Users,
  CalendarDays
} from 'lucide-vue-next'
</script>
<template>
  <div>
    <header class="header">
      <NuxtLink to="/">
        <CalendarDays/>
      </NuxtLink>
      <NuxtLink to="/users">
        <Users/>
      </NuxtLink>
    </header>
    <main class="main">
      <NuxtPage/>
    </main>
  </div>
</template>
<style>
body, html {
  height: 100vh;
  font-size: .9rem !important;
  font-family: system-ui, sans-serif;
  background: #f8fafc;
}

.main {
  padding: 1rem;
}

.header {
  background: #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
}

.header a {
  color: black
}
</style>