<script setup>
import {
  Briefcase,
  Home,
  Plane,
  Minus,
  ChevronLeft,
  ChevronRight,
  Star,
  Users
} from 'lucide-vue-next'
import Widget from '~/components/Widget.vue'
import {getCurrentWeek} from "~/utils/dates.ts";
import Header from "./../components/Header.vue";
import {initials} from "../utils/utils";
import BottomSheet from "./../components/BottomSheet.vue";
import BottomSheetAddGuest from "~/components/BottomSheetAddGuest.vue";

const notesDraft = ref({})
const modal = useTemplateRef('modal')

const currentMonday = ref(getCurrentWeek()[0])
const selectedUserId = ref(null)
const selectedUser = ref(null)
const selectedUserNote = ref(null)
const selectedDate = ref(null)
const selectedGuestDate = ref(null)
const searchQuery = ref('')
const bottomSheetOpen = ref(false)
const bottomSheetAddGuestOpen = ref(false)
const today = ref(new Date().toLocaleDateString('sv-SE'))

// 📅 settimana corrente
const weekDays = computed(() =>
    getWeekFromMonday(currentMonday.value)
)

const classDayStripButton = (d) => {
  return d === today.value ? 'bg-blue-500 text-white' : 'text-slate-500'
}

const shortDayName = (d) => {
  const date = new Date(d)
  return date.toLocaleDateString('it', {weekday: 'short'}).toUpperCase()
}

const dayNum = (d) => {
  const date = new Date(d)
  return date.getDate()
}


const fromQuery = computed(() => weekDays.value[0])
const toQuery = computed(() => weekDays.value[4])

const from = computed(() => {
  const date = new Date(weekDays.value[0])
  return date.toLocaleDateString('it',
      {
        day: 'numeric',
        month: 'short'
      })
})
const to = computed(() => {
  const date = new Date(weekDays.value[4])
  return date.toLocaleDateString('it',
      {
        day: 'numeric',
        month: 'short'
      })
})

const {data: users, refresh: refreshUsers} = await useFetch('/api/users')
const {data: notesData, refresh: refreshNotes} = await useFetch('/api/notes', {
  query: {
    fromQuery,
    toQuery
  },
  watch: [fromQuery, toQuery]
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
const {data: guests, refresh: refreshGuests} = await useFetch('/api/guests', {
  query: {
    fromQuery,
    toQuery
  },
  watch: [fromQuery, toQuery]
})


// 📦 dati DB
const {data: presencesData, refresh: refreshPresences} = await useFetch('/api/presences', {
  query: {
    fromQuery,
    toQuery
  },
  watch: [fromQuery, toQuery]
})

const availableUsers = computed(() => {
  if (!users.value) return [{name: '', id: 0}]

  if (searchQuery.value === '')
    return users.value.sort((a, b) => a.name.localeCompare(b.name))

  const filtered = users.value.filter((user) => {
    return user['name'].toLowerCase().includes(searchQuery.value.toLowerCase())
  })
  return filtered.sort((a, b) => a.name.localeCompare(b.name))
})

const countOspiti = computed(() => {
  if (!guests.value) return {}
  return (guestsPerDay.value.get(today.value) || []).length
})


const guestsPerDay = computed(() => {
  const map = new Map()

  for (const guest of guests.value) {
    if (!map.has(guest.date)) {
      map.set(guest.date, [])
    }
    map.get(guest.date).push(guest)
  }
  return map
})

const totalPresences = (date) => {

  let guests = 0
  let total = presencesData.value
      .filter(item => item.date === date)
      .length

  const b = guestsPerDay.value.get(date)
  if (b) {
    guests = b.length
  }

  return guests > 0 ? total + ' + ' + guests : total

}

const countByStatus = computed(() => {
  if (!presencesData.value) return {}

  return presencesData.value
      .filter(item => item.date === today.value)
      .reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
})

const countByUser = (user) => {
  if (!presencesData.value) return {}

  return presencesData.value
      .filter(item => item.user_id === user.id && item.status === 'office')
      .length
}

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

let timeout
const onSaveNote = async (userId, date, note) => {
  const key = `${userId}-${date}`

  await $fetch('/api/notes', {
    method: 'POST',
    body: {
      user_id: userId,
      date,
      content: note
    }
  })

  notesDraft.value[key] = note

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
const getDayPillClass = (date, status) => {
  let classes = date === today.value ? 'today-pill ' : ''
  switch (status) {
    case 'office':
      classes = classes += 'bg-green-200'
      break
    case 'remote':
      classes = classes += 'bg-gray-200'
      break
    case 'holiday':
      classes = classes += 'bg-orange-200'
      break
    default:
      break

  }
  return classes
}

const showAddNoteModal = (userId, date) => {
  selectedUserId.value = userId
  selectedDate.value = date
  modal.value.showModal()
}


const openSheet = (user, date) => {
  selectedUser.value = user
  selectedDate.value = date
  selectedUserNote.value = notesDraft.value[`${user.id}-${date}`]
  setTimeout(() => {
    bottomSheetOpen.value = true
  }, 200)
}

const closeSheets = () => {
  selectedUser.value = null
  selectedDate.value = null
  bottomSheetOpen.value = false
}

const closeGuestSheets = () => {
  selectedDate.value = null
  bottomSheetAddGuestOpen.value = false
}

const onSaveGuest = async (guest_name, date) => {

  // 💾 UPSERT
  await $fetch('/api/guests', {
    method: 'POST',
    body: {guest_name: guest_name, date}
  })

  refreshGuests()
}

const onDeleteGuest = async (guest_name, date) => {
  // 🧹 DELETE
  await $fetch('/api/guests', {
    method: 'DELETE',
    body: {guest_name: guest_name, date: date}
  })
  refreshGuests()
}

const onSetStatus = async (userId, date, status) => {

  const key = `${userId}-${date}`

  if (status === null) {
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
      body: {user_id: userId, date, status: status}
    })

    presences.value[key] = status
  }

  await refreshPresences()
  closeSheets()
}

const showAddGuest = (d) => {
  selectedDate.value = d
  setTimeout(() => {
    bottomSheetAddGuestOpen.value = true
  }, 200)
}

</script>

<template>
  <div class="h-screen overflow-scroll pb-48 md:pb-0">
    <Header>
      <template v-slot:default>
        <div class="flex items-center gap-2 md:gap-3">
          <!-- Week nav -->
          <div class="flex items-center gap-1 bg-slate-50 rounded-xl px-2 py-1.5">
            <button id="prev-btn" @click="prevWeek"
                    class="nav-btn w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 transition-colors">
              <ChevronLeft :size="18"/>
            </button>
            <span
                class="text-xs md:text-sm font-medium text-slate-700 px-1 md:px-2 min-w-[100px] md:min-w-[160px] text-center"
                id="week-label">
              {{ from }} - {{ to }}
            </span>
            <button id="next-btn" @click="nextWeek"
                    class="nav-btn w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 transition-colors">
              <ChevronRight :size="18"/>
            </button>
          </div>

          <!-- Oggi (desktop only) -->
          <button id="today-btn" @click="goToCurrentWeek"
                  class="inline-flex px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-800 transition-colors">
            Oggi
          </button>
        </div>
      </template>
      <template v-slot:dayStrip>
        <!-- Day strip (mobile only) -->
        <div class="flex justify-around px-4 pb-3" id="day-strip-mobile">
          <div class="relative" v-for="d in weekDays" :key="d">
            <button type="button" @click="showAddGuest(d)"
                    :class="classDayStripButton(d)"
                    class="flex flex-col items-center w-10 py-1.5 rounded-xl">
              <span class="text-[10px] font-medium uppercase">{{ shortDayName(d) }}</span>
              <span class="text-sm font-semibold">{{ dayNum(d) }}</span>
            </button>
            <div class="font-bold text-center">{{ totalPresences(d) }}</div>
          </div>
        </div>
      </template>
    </Header>

    <div class="w-100 mx-1 md:mx-3">
      <div id="dashboard" class="grid m-2 grid-cols-2 lg:grid-cols-4 gap-3 items-center justify-center py-1">
        <Widget class="bg-green-200" :count="countByStatus['office'] ?? 0" description="Presenti">
          <Briefcase :size="14"/>
        </Widget>
        <Widget class="bg-blue-200" :count="countOspiti" description="Ospiti">
          <Users :size="14"/>
        </Widget>
        <Widget class="bg-gray-200" :count="countByStatus['remote'] ?? 0" description="Da casa">
          <Home :size="14"/>
        </Widget>
        <Widget class="bg-orange-200" :count="countByStatus['holiday'] ?? 0" description="In ferie">
          <Plane :size="14"/>
        </Widget>
      </div>
      <input type="text" v-model="searchQuery" class="px-7 py-2 w-full mb-2 rounded-xl" placeholder="Ricerca...">
      <div id="user-list" class="">
        <div v-for="user in availableUsers" :key="user.name" class="user-card mb-2 shadow-sm">
          <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0">
              {{ initials(user.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-900 truncate">{{ user.name }}</p>
            </div>
            <span class="text-sm shrink-0">{{ countByUser(user) }}/5</span>
          </div>
          <div class="flex justify-around px-2 py-3">
            <button v-for="d in weekDays" :key="d"
                    class="day-pill h-16" :class="getDayPillClass(d, presences[`${user.id}-${d}`])"
                    @click="openSheet(user, d)">
            <span
                :class="{'text-blue-500': d===today, 'text-slate-400':d!==today}"
                class="text-[10px] font-medium">{{ shortDayName(d) }}</span>
              <span class="text-xs font-semibold">
                {{ dayNum(d) }}
              </span>
              <span>
              <Star v-if="hasNote(user.id, d)" class="absolute top-0 -right-4 text-blue-800" :size="12"/>
              <Briefcase class="text-green-500" v-if="presences[`${user.id}-${d}`] === 'office'" :size="18"/>
              <Home class="text-gray-500" v-else-if="presences[`${user.id}-${d}`] === 'remote'" :size="18"/>
              <Plane class="text-orange-500" v-else-if="presences[`${user.id}-${d}`] === 'holiday'" :size="18"/>
              <Minus v-else :size="16"/>
            </span>
            </button>
          </div>
        </div>
      </div>
      <BottomSheet v-if="selectedUser"
                   :visible="bottomSheetOpen"
                   :user="selectedUser"
                   :date="selectedDate"
                   :userNote="selectedUserNote"
                   @setStatus="onSetStatus"
                   @abort="closeSheets"
                   @saveNote="onSaveNote"
      />
      <BottomSheetAddGuest v-if="selectedDate"
                           :guests="guestsPerDay.get(selectedDate) || []"
                           :date="selectedDate"
                           :visible="bottomSheetAddGuestOpen"
                           @saveGuest="onSaveGuest"
                           @deleteGuest="onDeleteGuest"
                           onDeleteGuest="onDeleteGuest"
                           @abort="closeGuestSheets"/>

    </div>
  </div>
</template>

<style scoped>

/* Day pill */
.day-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 44px;
  border-radius: 12px;
  padding: 6px 0;
  cursor: pointer;
  transition: background .12s, transform .1s;
  position: relative;
  border: none;
}

.day-pill.today-pill {
  box-shadow: 0 0 0 2px #2563EB;
}

/* User card */
.user-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}

.user-card + .user-card {
  margin-top: 8px;
}
</style>