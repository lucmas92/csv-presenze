<script setup>
import pkg from '../package.json'
import {
  Users,
  Calendar1,
  LayoutGrid,
  LogOut,
  ChartSpline,
} from 'lucide-vue-next'
import {useAuthStore} from "~/stores/auth.ts";

const auth = useAuthStore()
const user = computed(() => auth.user)

const isAdmin = computed(() => auth.user.role === 'admin')

const logout = async () => {
  await auth.logout().then(() => {
    navigateTo('/login')
  })
}
</script>
<template>
  <div class="flex min-h-screen md:h-screen md:overflow-hidden">
    <!-- ── SIDEBAR (hidden mobile, visible desktop) ── -->
    <aside v-if="auth.isAuthenticated"
           class="hidden md:flex w-16 bg-white border-r border-slate-100 flex-col items-center py-5 gap-6 shrink-0">
      <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
        <LayoutGrid class="text-white" :size="14"/>
      </div>
      <nav class="flex flex-col gap-2 mt-4">
        <NuxtLink to="/" exact
                  class="w-10 h-10 rounded-xl text-slate-400 hover:bg-blue-200 hover:text-blue-500 flex items-center justify-center"
                  title="Calendario">
          <Calendar1/>
        </NuxtLink>
        <NuxtLink to="/users"
                  v-if="isAdmin"
                  class="w-10 h-10 rounded-xl text-slate-400 hover:bg-blue-200 hover:text-blue-500 flex items-center justify-center transition-colors"
                  title="Utenti">
          <Users/>
        </NuxtLink>
        <NuxtLink to="/stats"
                  v-if="isAdmin"
                  class="w-10 h-10 rounded-xl text-slate-400 hover:bg-blue-200 hover:text-blue-500 flex items-center justify-center transition-colors"
                  title="Statistiche">
          <ChartSpline/>
        </NuxtLink>
      </nav>
      <div class="mt-auto">
        <div v-if="user" class="font-bold text-slate-400">
          {{ initials(user.name) }}
        </div>
        <div
            @click="logout"
            class="w-8 h-8 mb-2 rounded-full text-slate-400 active:scale-90">
          <LogOut/>
        </div>
        v{{ pkg.version }}
      </div>
    </aside>
    <main class="w-full mx-1">
      <NuxtPage/>
      <!-- ── BOTTOM NAV (mobile only) ── -->
      <nav v-if="auth.isAuthenticated" class="bottom-nav flex md:hidden">
        <NuxtLink to="/" exact class="text-slate-400 my-2">
          <Calendar1/>
          <!--          <span class="text-xs font-medium text-slate-400">Calendario</span>-->
        </NuxtLink>
        <NuxtLink
            v-if="isAdmin" to="/users" class="text-slate-400 my-2">
          <Users/>
          <!--          <span class="text-xs font-medium">Utenti</span>-->
        </NuxtLink>
        <NuxtLink
            v-if="isAdmin" to="/stats" class="text-slate-400 my-2">
          <ChartSpline/>
          <!--          <span class="text-xs font-medium">Impostazioni</span>-->
        </NuxtLink>
        <NuxtLink @click="logout" class="text-slate-400 my-2 active:scale-90 ">
          <div class="flex gap-x-2 items-center ">
            <div v-if="user" class="font-bold text-slate-400">
              {{ initials(user.name) }}
            </div>
            <LogOut/>
          </div>
          <!--          <span class="text-xs font-medium">LogOut</span>-->
        </NuxtLink>
      </nav>
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

/* ── BOTTOM NAV (mobile) ── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #F1F5F9;
  padding-bottom: env(safe-area-inset-bottom, 0);
  z-index: 30;
}

.bottom-nav a {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

/* Scrollbar */
::-webkit-scrollbar {
  display: none;
}


button:active {
  transform: scale(0.93);
}

input {
  font-size: 16px;
}

/* prevent iOS zoom */


.router-link-exact-active {
  font-weight: bold;
  color: rgb(59 130 246);
  background-color: rgb(191 219 254);
}
</style>