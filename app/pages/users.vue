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
  <div class="page">
    <div class="header">
      <h2 class="title">Utenti</h2>

      <div class="nav">
        <!-- FORM -->
        <div class="card">
          <input
              v-model="name"
              class="new-name"
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
        <thead>
        <tr>
          <th>Nome</th>
          <th>&nbsp;</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
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
.page {
  padding: 20px;
  font-family: system-ui, sans-serif;
  background: #f8fafc;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

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

.table-wrap {
  width: 90%;
  margin: 0 auto;
  min-width: 400px;
  overflow: auto;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.actions {
  text-align: right;
}

button {
  background: none;
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
  padding: 7px 1rem;
  width: 150px;
  font-size: 16px;
}
</style>