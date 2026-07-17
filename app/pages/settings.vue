<script setup>
import {useAuthStore} from "~/stores/auth.ts";

definePageMeta({
  protected: false,
})
import {
  Lock,
  KeyRound
} from 'lucide-vue-next'
import Header from "~/components/Header.vue";

const auth = useAuthStore()
const {notifyError, notifySuccess} = useNotification();

const user = computed(() => auth.user)
const currentPassword = ref("")
const newPassword = ref("")
const validateNewPassword = ref("")
const errors = ref("")

const isValid = computed(() => {
  return currentPassword.value && newPassword && validateNewPassword.value && newPassword.value === validateNewPassword.value
})


const updatePassword = async () => {
  errors.value = ""
  if (isValid) {
    await $fetch('/api/user/updatePassword', {
      method: 'PUT',
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
        validateNewPassword: validateNewPassword.value
      }
    })
        .then(() => {
          notifySuccess('La tua password è stata aggiornata.', 'Modifica salvata');
          currentPassword.value = ""
          newPassword.value = ""
          validateNewPassword.value = ""
        })
        .catch((error) => {
          notifyError(error.data.message, 'Impossibile aggiornare la password')
        })
  }
}
</script>
<template>

  <div class="h-screen overflow-scroll pb-48 md:pb-0">
    <Header class="mb-2">
      <template v-slot:default>
        <div v-if="user.username=='lucmas'" class="flex items-center gap-2 md:gap-3">
          <div>Impostazioni</div>
          <NuxtLink to="/admin" exact
                    class="w-10 h-10 rounded-xl text-slate-400 hover:bg-blue-200 hover:text-blue-500 flex items-center justify-center"
                    title="Calendario">
            <Lock/>
          </NuxtLink>
        </div>
      </template>
    </Header>

    <div class="w-100 mx-1 md:mx-3">

      <div v-if="errors"
           class="flex my-4 items-start gap-3 p-4 bg-rose-50 border border-rose-150 rounded-xl text-rose-900 animate-fade-in">
        <div class="p-1 bg-rose-500 text-white rounded-md shrink-0">
          <i data-lucide="shield-alert" class="w-4 h-4"></i>
        </div>
        <div class="text-xs space-y-0.5">
          <span class="font-bold block text-rose-950">Impossibile aggiornare la password</span>
          <span id="error_banner_message" class="block text-rose-800">{{ errors }}</span>
        </div>
        <button type="button" onclick="document.getElementById('password_error_banner').classList.add('hidden')"
                class="ml-auto text-rose-400 hover:text-rose-600 transition p-1">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <section class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <!-- Sotto-Header della sezione -->
        <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <KeyRound/>
          </div>
          <div>
            <h2 class="font-bold text-slate-800 text-base">Sicurezza Account</h2>
            <p class="text-xs text-slate-500">Aggiorna le tue credenziali d'accesso</p>
          </div>
        </div>

        <!-- Form Password -->
        <div class="p-6 space-y-5">
          <!-- Password Attuale -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password Attuale</label>
            <div class="relative">
                            <span
                                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <i data-lucide="lock" class="w-4 h-4"></i>
                            </span>
              <input type="password" name="current_password" placeholder="••••••••" v-model.trim="currentPassword"
                     class="
              w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm transition
              ">
            </div>
          </div>

          <hr class="border-slate-100 my-4">

          <!-- Nuova Password -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Nuova Password</label>
            <div class="relative">
                            <span
                                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <i data-lucide="key" class="w-4 h-4"></i>
                            </span>
              <input type="password" name="new_password" id="new_password" v-model.trim="newPassword"
                     placeholder="Minimo 8 caratteri" @keydown.enter="updatePassword"
                     class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm transition">
            </div>
          </div>

          <!-- Conferma Nuova Password -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Conferma Nuova
              Password</label>
            <div class="relative">
                            <span
                                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <i data-lucide="check" class="w-4 h-4"></i>
                            </span>
              <input type="password" name="confirm_password" id="confirm_password" v-model.trim="validateNewPassword"
                     placeholder="Ripeti la nuova password" @keydown.enter="updatePassword"
                     class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm transition">
            </div>
            <p id="match_error" class="text-[11px] text-rose-500 font-medium hidden flex items-center gap-1">
              <i data-lucide="alert-circle" class="w-3 h-3"></i> Le password non corrispondono.
            </p>
          </div>

          <!-- Pulsante d'Azione Interno alla sezione -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button @click="updatePassword" :disabled="!isValid"
                    class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:bg-gray-400">
              Salva Nuova Password
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>