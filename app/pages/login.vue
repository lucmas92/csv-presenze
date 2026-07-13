<script setup>
definePageMeta({
  public: true,
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
</script>

<template>
  <div class="h-screen overflow-scroll pb-48 md:pb-0 flex items-center justify-center">
    <Transition name="fade">
      <form class="w-100 mx-1 md:mx-3">
        <h1 class="text-xl my-4">Login</h1>
        <div class="flex flex-col gap-4">
          <input class="py-2 px-4"
                 @keydown.enter="submit"
                 type="text" name="username" placeholder="Username" v-model="username">
          <span class="flex items-center gap-2">
            <input class="py-2 px-4"
                   autocomplete="off"
                   @keydown.enter="submit"
                   :type="showPassword ? 'text' : 'password'" name="password" placeholder="Password" v-model="password">
            <Eye class="cursor-pointer" :szie="10" v-if="!showPassword" @click="showPassword = !showPassword"/>
            <EyeOff class="cursor-pointer" :szie="10"  v-else @click="showPassword = !showPassword"/>
          </span>
          <span class="text-red-400">
            {{ errors }}
          </span>
          <button type="button" @click="submit" :disabled="!username || !password"
                  class="bg-blue-200 py-2 px-4 rounded-xl disabled:bg-gray-200 disabled:text-gray-400">Accedi
          </button>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style scoped>

</style>