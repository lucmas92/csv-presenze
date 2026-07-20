<script setup>
import {useAuthStore} from "~/stores/auth.ts";

definePageMeta({
  protected: true,
})
import {KeyRound, Save, Trash, Pencil, Search} from 'lucide-vue-next'
import Header from "~/components/Header.vue";
import BottomSheetAddUser from "~/components/BottomSheetAddUser.vue";

const searchQuery = ref('')
const loading = ref(false)
const editing = ref([])
const bottomSheetOpen = ref(false)

const auth = useAuthStore()
const authUser = computed(() => auth.user)
const defaultPasswords = ref(new Map())

const {notifyError, notifySuccess} = useNotification();

const isDefaultPassword = async (user) => {
  return await verifyPassword(user.username, user.password_hash)
}

const {data: users, refresh: refreshUsers} = await useFetch('/api/users', {
  query: {
    withGuests: 1
  }
})

const fetchDefaultPassword = () => {
  users.value.forEach(async (u) => {
    const def = await isDefaultPassword(u)
    defaultPasswords.value.set(u.id, {default: def})
  })
}

onMounted(() => {
  setTimeout(() => {
    fetchDefaultPassword()
  }, 1000)
})


const resetUserPassword = async (user) => {
  loading.value = true
  try {
    await $fetch('/api/user/resetPassword', {
      method: 'PUT',
      body: {id: user.id, username: user.username}
    })
        .then(async () => {
          notifySuccess('È stata impostata la password di default.', 'Modifica salvata');
        })
        .catch(async (error) => {
          notifyError(error.data.message, 'Impossibile resettare la password')
        })
    await refreshUsers()
    fetchDefaultPassword()

    setTimeout(async () => {
      editing.value[user.id] = false
    }, 100)
  } finally {
    loading.value = false
  }
}

const onSaveUser = async (name, username, isGuest) => {
  loading.value = true

  try {
    const newUser = await $fetch('/api/users', {
      method: 'POST',
      body: {name: name, username: username, isGuest: isGuest}
    })
        .then(() => {
          notifySuccess('Utente creato con successo', 'Modifica salvata');
          refreshUsers()
        })
        .catch((error) => {
          notifyError(error.data.message, 'Impossibile creare l\'utente')
          refreshUsers()
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
    await $fetch('/api/users', {
      method: 'PUT',
      body: {id: user.id, name: user.name, username: user.username}
    })
        .then(() => {
          notifySuccess('È stata aggiornato l\'utente.', 'Modifica salvata');
        })
        .catch((error) => {
          notifyError(error.data.message, 'Impossibile aggiornare l\'utente')
        })
    await refreshUsers()
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
          .then(() => {
            notifySuccess('Utente eliminato.', 'Modifica salvata');
          })
          .catch((error) => {
            notifyError(error.data.message, 'Impossibile eliminare l\'utente')
          })
      await refreshUsers()
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
    <div class="relative mb-3 mx-2">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search class="text-gray-400"/>
            </span>
      <input type="text" v-model="searchQuery" placeholder="Cerca collaboratore..."
             class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition placeholder-slate-400">
    </div>
    <div class="mx-1 md:mx-1 flex flex-wrap">
      <div v-for="user in availableUsers" :key="user.id" class="basis-full md:basis-1/2 lg:basis-1/3 2xl:basis-1/4">
        <div
            class="m-2 flex justify-between mb-2 rounded-lg p-2 bg-white relative border">
          <span v-if="user.role==='guest'"
                class="absolute right-2 border bg-amber-400 font-bold border-amber-600 px-3 rounded-md">
            Ospite
          </span>
          <div class="flex flex-col gap-y-2">
            <div class="text-sm font-semibold text-slate-90 truncate flex flex-col">
              <span class="text-xs text-gray-400">Nome:</span>
              <div v-if="!editing[user.id]" class="border border-transparent p-2">{{ user.name }}</div>
              <span v-else>
                  <input class="border border-gray-200 p-2"
                         @keydown.enter="updateUser(user)"
                         autofocus
                         type="text"
                         v-model="user.name">
                </span>
            </div>
            <div class="text-sm font-semibold text-slate-90 truncate flex flex-col">
              <span class="text-xs text-gray-400">Username</span>
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
            <button v-if="!editing[user.id]" class="action-button" title="Modifica utente"
                    @click="editUser(user)">
              <Pencil/>
            </button>
            <button v-if="editing[user.id]" class="action-button" title="Salva modifiche"
                    @click="updateUser(user)">
              <Save/>
            </button>
            <button v-if="authUser.role === 'admin' && user.role!=='guest'" class="action-button" title="Reset password"
                    @click="resetUserPassword(user)">
              <KeyRound class="text-red-800/50 fill-current"
                        v-if="defaultPasswords.has(user.id) && defaultPasswords.get(user.id)['default']"/>
              <KeyRound v-else/>
            </button>
            <button class="action-button" title="Elimina utente"
                    @click="deleteUser(user)">
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