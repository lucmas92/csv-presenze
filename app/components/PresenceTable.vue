<script setup>
const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven']

// utenti mock (poi li leggeremo dal DB)
const users = [
  { id: 1, name: 'Alberto' },
  { id: 2, name: 'Jacopo' },
  { id: 3, name: 'Andrea' }
]

// stato presenze
const presences = ref({})

// carica dati da API
const { data, refresh } = await useFetch('/api/presences')

watchEffect(() => {
  if (data.value) {
    presences.value = {}

    data.value.forEach(p => {
      const key = `${p.user_id}-${p.day}`
      presences.value[key] = p.status
    })
  }
})

// toggle stato
const toggle = async (userId, day) => {
  const key = `${userId}-${day}`
  const current = presences.value[key]

  let next = 'office'
  if (current === 'office') next = 'remote'
  else if (current === 'remote') next = 'holiday'

  presences.value[key] = next

  await $fetch('/api/presences', {
    method: 'POST',
    body: {
      user_id: userId,
      day,
      status: next
    }
  })

  refresh()
}

// colore celle
const getClass = (status) => {
  if (status === 'office') return 'bg-green'
  if (status === 'remote') return 'bg-gray'
  if (status === 'holiday') return 'bg-orange'
  return ''
}
</script>

<template>
  <table class="table">
    <thead>
    <tr>
      <th>Nome</th>
      <th v-for="(d, i) in days" :key="i">{{ d }}</th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="user in users" :key="user.id">
      <td>{{ user.name }}</td>

      <td
          v-for="(d, i) in days"
          :key="i"
          :class="getClass(presences[`${user.id}-${i+1}`])"
          @click="toggle(user.id, i+1)"
      >
        {{ presences[`${user.id}-${i+1}`] || '' }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table {
  border-collapse: collapse;
}

td, th {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.bg-green {
  background: #86efac;
}

.bg-gray {
  background: #e5e7eb;
}

.bg-orange {
  background: #fdba74;
}
</style>