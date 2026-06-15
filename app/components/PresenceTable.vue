<script setup>
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Briefcase,
  Home,
  Plane,
  Minus,
  MoveRight,
  NotebookPen
} from 'lucide-vue-next'
import Legend from '~/components/Legend.vue'
import Widget from '~/components/Widget.vue'
import {getCurrentWeek} from "~/utils/dates.ts";

const notesDraft = ref({})
const modal = useTemplateRef('modal')

const currentMonday = ref(getCurrentWeek()[0])
const selectedUserId = ref(null)
const selectedDate = ref(null)
const today = ref(new Date().toISOString().slice(0, 10))

// 📅 settimana corrente
const weekDays = computed(() =>
    getWeekFromMonday(currentMonday.value)
)

const formatDate = (d) => {
  const date = new Date(d)
  const dayName = date.toLocaleDateString('it', {weekday: 'short'}).toUpperCase()
  const dayNumber = date.getDate()
  const monthName = date.toLocaleDateString('it', {month: 'short'})
  return `<span>${dayName}</span> ${dayNumber} ${monthName}`
}

const formatDate2 = (d) => {
  const date = new Date(d)
  const dayName = date.toLocaleDateString('it', {weekday: 'long'})
  const dayNumber = date.getDate()
  const monthName = date.toLocaleDateString('it', {month: 'long'})
  return `<span>${dayName}</span> ${dayNumber} ${monthName}`
}

const from = computed(() => weekDays.value[0])
const to = computed(() => weekDays.value[4])

const {data: users, refresh: refreshUsers} = await useFetch('/api/users')
const {data: notesData, refresh: refreshNotes} = await useFetch('/api/notes', {
  query: {
    from,
    to
  },
  watch: [from, to]
})

watch(
    notesData,
    (val) => {
      const map = {}

      for (const n of val || []) {
        map[`${n.user_id}-${n.date}`] = n.content
      }

      notesDraft.value = map
    },
    {immediate: true}
)


// 📦 dati DB
const {data: presencesData, refresh: refreshPresences} = await useFetch('/api/presences', {
  query: {
    from,
    to
  },
  watch: [from, to]
})

const countByStatus = computed(() => {
  if (!presencesData.value) return {}

  return presencesData.value
      .filter(item => item.date === today.value)
      .reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
})

const countToday = computed(() => {
  if (!presencesData.value) return {}
  return presencesData.value
      .filter(item => item.date === today.value)
      .length
})

const presences = computed(() => {
  const map = {}

  if (!presencesData.value) return map

  for (const p of presencesData.value) {
    const key = `${p.user_id}-${p.date}`
    map[key] = p.status
  }

  return map
})

const presencesCount = computed(() => {
  return presencesData.value.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = 0;
    }
    if (item.status === 'office')
      acc[item.date]++;

    return acc;
  }, {});
})


/**
 * toggle stato
 */
const toggle = async (userId, date) => {
  const key = `${userId}-${date}`
  const current = presences.value[key]

  let next = 'office'

  // PER GESTIONE AVANZATA STATI
  if (current === 'office') next = 'remote'
  else if (current === 'remote') next = 'holiday'
  else if (current === 'holiday') next = null // 👉 vuoto = delete

  if (next === null) {
    // 🧹 DELETE
    await $fetch('/api/presences', {
      method: 'DELETE',
      body: {user_id: userId, date}
    })

    delete presences.value[key]
  } else {
    // 💾 UPSERT
    await $fetch('/api/presences', {
      method: 'POST',
      body: {user_id: userId, date, status: next}
    })

    presences.value[key] = next
  }
  await refreshPresences()
}

let timeout
const saveNote = async () => {
  const userId = selectedUserId.value
  const date = selectedDate.value
  const key = `${userId}-${date}`

  await $fetch('/api/notes', {
    method: 'POST',
    body: {
      user_id: userId,
      date,
      content: notesDraft.value[key]
    }
  })

  modal.value.close()

  await refreshNotes()
}

const goToCurrentWeek = () => {
  currentMonday.value = getCurrentWeek()[0]
}

const prevWeek = () => {
  const d = new Date(currentMonday.value)
  d.setDate(d.getDate() - 7)
  currentMonday.value = d.toISOString().split('T')[0]
}

const nextWeek = () => {
  const d = new Date(currentMonday.value)
  d.setDate(d.getDate() + 7)
  currentMonday.value = d.toISOString().split('T')[0]
}

const hasNote = (userId, date) => {
  return !!notesDraft.value[`${userId}-${date}`]
}

const getClass = (status) => {
  if (status === 'office') return 'bg-green-200'
  if (status === 'remote') return 'bg-gray-200'
  if (status === 'holiday') return 'bg-orange-200'
  return ''
}

const showAddNoteModal = (userId, date) => {
  selectedUserId.value = userId
  selectedDate.value = date
  modal.value.showModal()
}
</script>

<template>
  <div class="w-100 mx-auto">
    <div id="dashboard" class="flex flex-col lg:flex-row justify-between items-center gap-6">
      <h3 class="font-bold text-2xl">STATISTICHE OGGI</h3>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 items-center justify-center py-1">
        <Widget class="bg-green-200" :count="countByStatus['office'] ?? 0" description="Presenti">
          <Briefcase :size="14"/>
        </Widget>
        <Widget class="bg-gray-200" :count="countByStatus['remote'] ?? 0" description="Da casa">
          <Home :size="14"/>
        </Widget>
        <Widget class="bg-orange-200" :count="countByStatus['holiday'] ?? 0" description="In ferie">
          <Plane :size="14"/>
        </Widget>
        <Widget :count="users.length - countToday" description="Da compilare">
          <Plane :size="14"/>
        </Widget>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row justify-between items-center px-1.5 py-2">
      <Legend/>
      <div class="flex gap-2 items-center">
        <div class="range">{{ from }}
          <MoveRight class="inline mx-2"/>
          {{ to }}
        </div>
        <div class="flex items-center">
          <div class="flex gap-2 mx-auto">
            <button class="btn" @click="prevWeek">
              <ChevronLeft :size="18"/>
            </button>

            <button class="btn primary w-1/2" @click="goToCurrentWeek">
              <Calendar :size="16"/>
              <span class="hidden md:inline-block">Oggi</span>
            </button>

            <button class="btn" @click="nextWeek">
              <ChevronRight :size="18"/>
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead class="table w-full table-fixed shadow-md">
        <tr class="table w-full table-fixed">
          <th></th>
          <th :class="{'active-day': d === today}" v-for="d in weekDays" :key="d">
            <span class="date" v-html="formatDate(d)"></span>
            <span v-if="presencesCount[d]">({{ presencesCount[d] }})</span>
          </th>
        </tr>
        </thead>

        <tbody class="table-fixed block overflow-y-auto" style="max-height: 65vh; padding-left: 5px; min-height: 300px;">
        <tr v-for="user in users" :key="user.id" class="table w-full table-fixed">
          <td class="name">{{ user.name }}</td>

          <td :class="{'active-day': date === today}" v-for="date in weekDays" :key="date" class="cell" style="">
            <div style="display: flex; justify-content: center;">
              <button type="button"
                      class="button status"
                      :class="getClass(presences[`${user.id}-${date}`])"
                      @click="toggle(user.id, date)"
              >
                <Briefcase v-if="presences[`${user.id}-${date}`] === 'office'" :size="18"/>
                <Home v-else-if="presences[`${user.id}-${date}`] === 'remote'" :size="18"/>
                <Plane v-else-if="presences[`${user.id}-${date}`] === 'holiday'" :size="18"/>
                <Minus v-else :size="16"/>
              </button>
              <button type="button" class="button addNote"
                      @click="showAddNoteModal(user.id, date)">
                <NotebookPen :size="15" :class="{'active': hasNote(user.id, date)}"/>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>


    <dialog ref="modal" class="rounded-xl p-6 w-96 backdrop:bg-black/30">
      <h2 class="text-base font-medium mb-4">
        Aggiungi nota per
        <span class="font-bold" v-html="formatDate2(selectedDate)"></span></h2>
      <textarea
          v-model="notesDraft[`${selectedUserId}-${selectedDate}`]" class="w-full border rounded-lg p-2 text-sm"/>
      <div class="flex justify-end gap-2 mt-4">
        <button @click="modal.close()" class="px-4 py-2 text-sm">Annulla</button>
        <button @click="saveNote()" class="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg">Salva</button>
      </div>
    </dialog>


  </div>
</template>

<style scoped>
.active {
  color: red;
  font-weight: bold;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.btn:hover {
  background: #f1f5f9;
}

.btn.primary {
  background: #2563eb;
  color: white;
  border: none;
}

.range {
  font-size: 18px;
  color: #64748b;
}

th {
  background: #f1f5f9;
  font-weight: 600;
  font-size: 13px;
  padding: 10px;
}

td {
  border-top: 1px solid #f1f5f9;
  padding: 8px;
  vertical-align: top;
}

.name {
  font-weight: 500;
  white-space: nowrap;
}

.cell {
  min-width: 120px;
}


.button {
  width: 50px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
  cursor: pointer;
}

.status {
  background: white;
}

.addNote {
  background: transparent;
  border: 1px solid transparent;
}

.date {
  margin-right: .1rem;
}

.date * {
  display: block;
}

.active-day{
  background: rgb(5 32 74 / 0.15);
}
</style>