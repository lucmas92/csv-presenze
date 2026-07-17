<script setup>
definePageMeta({
  protected: true,
})
import {Save, Trash, Pencil} from 'lucide-vue-next'
import Header from "~/components/Header.vue";
import BottomSheetAddUser from "~/components/BottomSheetAddUser.vue";

const searchQuery = ref('')
const loading = ref(false)
const editing = ref([])
const users = ref([])
const bottomSheetOpen = ref(false)

const fetchUsers = async () => {
  users.value = await $fetch('/api/users')
}

await fetchUsers()

const onSaveUser = async (userName) => {
  if (!userName.trim()) return

  loading.value = true

  try {
    const newUser = await $fetch('/api/users', {
      method: 'POST',
      body: {name: userName}
    })

    users.value.push(newUser)
  } finally {
    loading.value = false
  }
}

const availableUsers = computed(() => {
  if (!users.value) return [{name: '', id: 0}]

  if (searchQuery.value === '')
    return users.value.sort((a, b) => a.name.localeCompare(b.name))

  const filtered = users.value.filter((user) => {
    return user['name'].toLowerCase().includes(searchQuery.value.toLowerCase())
  })
  return filtered.sort((a, b) => a.name.localeCompare(b.name))
})

const editUser = (user) => {
  editing.value = []
  setTimeout(() => {
    if (!editing.value[user.id]) {
      editing.value[user.id] = true
    } else {
      editing.value[user.id] = !editing.value[user.id]
    }
  }, 100)
}

const updateUser = async (user) => {
  loading.value = true
  try {
    const newUser = await $fetch('/api/users', {
      method: 'PUT',
      body: {id: user.id, name: user.name, username: user.username}
    })
    setTimeout(() => {
      editing.value[user.id] = false
    }, 100)
  } finally {
    loading.value = false
  }
}

const deleteUser = async (user) => {
  loading.value = true

  setTimeout(async () => {
    const confirmAction = confirm('Sicuro di voler eliminare questo utente?')
    if (!confirmAction) {
      return
    }
    try {
      await $fetch('/api/users', {
        method: 'DELETE',
        body: {id: user.id}
      })
      await fetchUsers()
    } finally {
      loading.value = false
    }
  }, 100)
}

const openSheet = () => {
  setTimeout(() => {
    bottomSheetOpen.value = true
  }, 100)
}

const closeSheets = () => {
  bottomSheetOpen.value = false
}

</script>

<template>
  <div class="h-screen overflow-scroll pb-48 md:pb-0">
    <Header class="mb-2">

      <template v-slot:default>
        <div class="flex items-center gap-2 md:gap-3">
          <div>Lista Utenti</div>

          <button id="add-user-btn" @click="openSheet"
                  class="inline-flex px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-800">
            Aggiungi
          </button>
        </div>
      </template>
    </Header>
    <input type="text" v-model="searchQuery" class="mx-2 px-7 py-2 w-full mb-2 rounded-xl" placeholder="Ricerca...">

    <div class="mx-1 md:mx-1 flex flex-wrap">
      <div v-for="user in availableUsers" :key="user.id" class="basis-full md:basis-1/2 lg:basis-1/3">
        <div
            class="m-2 flex justify-between bg-white mb-2 rounded-lg p-2">
          <div class="flex flex-col gap-y-2">
            <div class="text-sm font-semibold text-slate-90 truncate">
              <div v-if="!editing[user.id]" class="border border-transparent p-2">{{ user.name }}</div>
              <span v-else>
                  <input class="border border-gray-200 p-2"
                         @keydown.enter="updateUser(user)"
                         autofocus
                         type="text"
                         v-model="user.name">
                </span>
            </div>
            <div class="text-sm font-semibold text-slate-90 truncate">
              <div v-if="!editing[user.id]" class="border border-transparent p-2">{{ user.username || '-' }}</div>
              <span v-else>
                  <input class="border border-gray-200 p-2"
                         @keydown.enter="updateUser(user)"
                         autofocus
                         type="text"
                         v-model="user.username">
                </span>
            </div>
          </div>
          <div class="flex items-center gap-4 mr-3">
            <button v-if="!editing[user.id]" class="action-button" @click="editUser(user)">
              <Pencil/>
            </button>
            <button v-if="editing[user.id]" class="action-button" @click="updateUser(user)">
              <Save/>
            </button>
            <button class="action-button" @click="deleteUser(user)">
              <Trash/>
            </button>
          </div>
        </div>
      </div>
    </div>
    <BottomSheetAddUser :visible="bottomSheetOpen"
                        @saveUser="onSaveUser"
                        @abort="closeSheets"/>
  </div>
</template>
<style scoped>
</style>