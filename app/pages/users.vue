<script setup>
import {Plus, Save, Trash, Pencil} from 'lucide-vue-next'

const name = ref('')
const loading = ref(false)
const editing = ref([])
const users = ref([])

const fetchUsers = async () => {
  users.value = await $fetch('/api/users')
}

await fetchUsers()

const createUser = async () => {
  if (!name.value.trim()) return

  loading.value = true

  try {
    const newUser = await $fetch('/api/users', {
      method: 'POST',
      body: {name: name.value}
    })

    users.value.push(newUser)
    name.value = ''
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  if (!editing.value[user.id]) {
    editing.value[user.id] = true
  } else {
    editing.value[user.id] = !editing.value[user.id]
  }
}

const updateUser = async (user) => {
  loading.value = true

  try {
    const newUser = await $fetch('/api/users', {
      method: 'PUT',
      body: {id: user.id, name: user.name}
    })
    editing.value[user.id] = false
  } finally {
    loading.value = false
  }
}

const deleteUser = async (user) => {
  loading.value = true

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
}
</script>

<template>
  <div class="w-100 mx-auto md:w-2/3">
    <div class="flex flex-col sm:flex-row justify-between items-center px-1.5 py-2">
      <h2 class="title">Utenti</h2>

      <div class="nav">
        <!-- FORM -->
        <div class="card">
          <input
              v-model="name"
              placeholder="Nome utente..."
              @keyup.enter="createUser"
          />

          <button class="btn" :disabled="loading" @click="createUser">
            <Plus :size="16"/>
          </button>
        </div>
      </div>
    </div>

    <!-- LISTA -->
    <div class="table-wrap">
      <table class="table">
        <thead class="table w-full table-fixed">
        <tr>
          <th>Nome</th>
          <th>&nbsp;</th>
        </tr>
        </thead>
        <tbody class="block overflow-y-auto" style="max-height: 65vh; min-height: 300px;">
        <tr v-for="user in users" :key="user.id" class="table w-full table-fixed">
          <td class="name">
            <div v-if="!editing[user.id]" style="padding: .5rem 1rem;">{{ user.name }}</div>
            <span v-else>
              <input class="edit-name"
                     @keydown.enter="updateUser(user)"
                     type="text"
                     v-model="user.name">
            </span>
          </td>
          <td class="actions">
            <button v-if="!editing[user.id]" class="action-button" @click="editUser(user)">
              <Pencil/>
            </button>
            <button v-if="editing[user.id]" class="action-button" @click="updateUser(user)">
              <Save/>
            </button>
            <button class="action-button" @click="deleteUser(user)">
              <Trash/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>

.title {
  font-size: 18px;
  font-weight: 600;
}

.nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card {
  align-items: center;
  display: flex;
}

.actions {
  text-align: right;
}

button {
  align-items: center;
  margin: 0 .5rem;
  gap: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

th {
  border: 1px solid #e5e7eb;
  background: #f1f5f9;
  font-weight: 600;
  font-size: 13px;
  padding: 10px;
}

th:first-child {
  width: 60%;
}

td {
  border-top: 1px solid #f1f5f9;
  padding: 8px;
  vertical-align: top;
}

input {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 3px 1rem;
  width: 200px;
  font-size: 16px;
}

.table {
  min-width: 400px !important;
}
</style>