<script setup>
import pkg from '../package.json'
import {
  Users,
  Calendar1,
  LayoutGrid,
  LogOut,
  ChartSpline,
  Settings,
  TriangleAlert,
    CircleCheck
} from 'lucide-vue-next'
import {useAuthStore} from "~/stores/auth.ts";

const auth = useAuthStore()
const user = computed(() => auth.user)
const timeout = ref<any>(null)

const {notification, clearNotification} = useNotification();
// Auto-chiusura della notifica dopo 5 secondi
watch(() => notification.value.show, (newVal) => {
  if (newVal) {
    if (timeout.value){
      clearTimeout(timeout)
    }
    timeout.value = setTimeout(() => {
      clearNotification();
    }, 5000);
  }
});

const isAdmin = computed(() => auth.user.role === 'admin')

const logout = async () => {
  await auth.logout().then(() => {
    navigateTo('/login')
  })
}
</script>
<template>
  <div class="flex min-h-screen md:h-screen md:overflow-hidden">

    <!-- BANNER NOTIFICA CENTRALE -->
    <Transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="notification.show"
           :class="{'bg-red-200': notification.type === 'error', 'bg-white': notification.type !== 'error'}"
           class="fixed top-4 right-4 z-50 max-w-sm w-full rounded-2xl shadow-xl border border-slate-100 p-4 flex items-start gap-3">
        <!-- Icona Dinamica in base al tipo (Errore o Successo) -->
        <div :class="[
          'p-1 text-white rounded-md shrink-0',
          notification.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
        ]">
          <!-- Se usi nuxt-lucide o icone standard, qui inserisci l'icona adatta -->
          <TriangleAlert :size="34" v-if="notification.type === 'error'"/>
          <CircleCheck :size="34" v-else/>
        </div>

        <!-- Contenuto del Testo -->
        <div class="text-sm space-y-0.5 flex-1">
          <span :class="[
            'font-bold block',
            notification.type === 'error' ? 'text-rose-950' : 'text-emerald-950'
          ]">{{ notification.title }}</span>
          <span class="block"
                :class="{'text-slate-600': notification.type !== 'error', 'text-rose-800': notification.type === 'error'}">{{
              notification.message
            }}</span>
        </div>

        <!-- Pulsante di Chiusura -->
        <button @click="clearNotification" class="text-slate-400 hover:text-slate-600 transition p-1">
          <span>✕</span>
        </button>
      </div>
    </Transition>


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
        <NuxtLink to="/settings"
                  class="w-10 h-10 rounded-xl text-slate-400 hover:bg-blue-200 hover:text-blue-500 flex items-center justify-center transition-colors"
                  title="Impostazioni">
          <Settings/>
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
        <NuxtLink to="/settings" class="text-slate-400 my-2">
          <Settings/>
          <!--          <span class="text-xs font-medium">Impostazioni</span>-->
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