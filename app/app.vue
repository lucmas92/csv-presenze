<script setup>
import {
  Users,
  CalendarDays
} from 'lucide-vue-next'
</script>
<template>
  <div>
    <header class="flex bg-gray-200 justify-center gap-3 p-2">
      <NuxtLink class="hover:bg-gray-400 hover:text-gray-100 font-bold py-3 px-2 flex items-center gap-2"
                to="/">
        Calendario
        <CalendarDays/>
      </NuxtLink>
      <div class="border-r border-gray-800"/>
      <NuxtLink class="hover:bg-gray-400 hover:text-gray-100 py-3 px-2 font-bold flex items-center gap-2"
                to="/users">
        Lista Utenti
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

.table {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
}

.table-wrap {
  overflow: auto;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

</style>