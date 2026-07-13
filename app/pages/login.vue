<script setup>
definePageMeta({
  public: true,
})

const username = ref("")
const password = ref("")
const errors = ref("")
const auth = useAuthStore()

async function submit() {
  errors.value = ""
  await $fetch('/api/auth/login', {
    method: 'POST',
    body: {
      username: username.value,
      password: password.value,
    },
    credentials: 'include',
  })
      .then((async (response) => {
        await auth.fetchMe()
        await navigateTo('/')
      }))
      .catch((error => errors.value = error.statusMessage))
      .finally(() => {

      })
}
</script>

<template>
  <div class="h-screen overflow-scroll pb-48 md:pb-0 flex items-center justify-center">
    <Transition name="fade">
      <div class="w-100 mx-1 md:mx-3">
        <h1 class="text-xl my-4">Login</h1>
        <div class="flex flex-col gap-4">
          <input class="py-2 px-4"
                 @keydown.enter="submit"
                 type="text" name="username" placeholder="Username" v-model="username">
          <input class="py-2 px-4"
                 @keydown.enter="submit"
                 type="password" name="password" placeholder="Password" v-model="password">
          <span class="text-red-400">
            {{ errors }}
          </span>
          <button @click="submit" :disabled="!username || !password" class="bg-blue-200 py-2 px-4 rounded-xl disabled:bg-gray-200 disabled:text-gray-400">Accedi</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>

</style>