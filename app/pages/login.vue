<script setup>
definePageMeta({
  public: false,
  protected: false,
})

import {
  Eye, EyeOff
} from 'lucide-vue-next'

const username = ref("")
const password = ref("")
const errors = ref("")
const showPassword = ref(false)
const auth = useAuthStore()

async function submit() {
  errors.value = ""
  auth.login({username: username.value, password: password.value})
      .then(async (result) => {
        if (result) {
          await navigateTo('/')
        } else {
          errors.value = "Credenziali errate!"
        }
      })
      .catch((error) => {
        errors.value = error.message
      })
}
const handleInputUsername = (event) => {
  // Convertiamo il valore inserito in minuscolo e aggiorniamo la ref
  username.value = event.target.value.toLowerCase()
}
const handleInputPassword = (event) => {
  // Convertiamo il valore inserito in minuscolo e aggiorniamo la ref
  password.value = event.target.value.toLowerCase()
}
</script>

<template>
  <div class="h-screen overflow-scroll pb-48 md:pb-0 flex items-center justify-center bg-[url('/images/wallpaper.png')] bg-cover bg-no-repeat bg-center">
    <Transition name="fade">
      <form class="w-96 mx-1 md:mx-3 bg-black/50 border border-black shadow-xl rounded-xl  p-12">
        <h1 class="text-xl mb-8 text-center text-white uppercase">Login</h1>
        <div class="flex flex-col gap-4">
          <input class="p-4 text-base"
                 @keydown.enter="submit"
                 @input="handleInputUsername"
                 type="text" name="username" placeholder="Username" v-model="username">
          <span class="flex items-center gap-3">
            <input class="p-4 text-base flex-1"
                   autocomplete="off"
                   @keydown.enter="submit"
                   @input="handleInputPassword"
                   :type="showPassword ? 'text' : 'password'" name="password" placeholder="Password" v-model="password">
            <Eye class="cursor-pointer text-white" :size="18" v-if="!showPassword" @click="showPassword = !showPassword"/>
            <EyeOff class="cursor-pointer text-white" :size="18"  v-else @click="showPassword = !showPassword"/>
          </span>
          <span class="bg-red-400 text-white text-center rounded-xl">
            {{ errors }}
          </span>
          <button type="button" @click="submit" :disabled="!username || !password"
                  class="bg-green-400 py-2 px-4 rounded-xl disabled:bg-gray-100 disabled:text-gray-400">Accedi
          </button>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style scoped>

</style>