<script setup>
import {
  Briefcase,
  Home,
  Plane,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-vue-next'
import Widget from '~/components/Widget.vue'
import {getCurrentWeek} from "~/utils/dates.ts";
import Header from "./../components/Header.vue";
import BottomSheet from "./../components/BottomSheet.vue";
import BottomSheetAddGuest from "~/components/BottomSheetAddGuest.vue";

const notesDraft = ref({})

const currentMonday = ref(getCurrentWeek()[0])
const selectedUser = ref(null)
const selectedUserNote = ref(null)
const selectedDate = ref(null)
const searchQuery = ref('')
const loading = ref(false)
const bottomSheetOpen = ref(false)
const bottomSheetAddGuestOpen = ref(false)
const today = ref(new Date().toLocaleDateString('sv-SE'))
const addGuestError = ref("")

const auth = useAuthStore()
const user = computed(() => auth.user)

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

const dayMonth = (d) => {
  const date = new Date(d)
  return date.toLocaleDateString('it',
      {
        month: 'short'
      })
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

const {data: favorites, refresh: refreshFavorites} = await useFetch('/api/favorites', {query: {userId: user.value.id}})

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

const presences = computed(() => {
  const map = {}

  if (!presencesData.value) return map

  for (const p of presencesData.value) {
    const key = `${p.user_id}-${p.date}`
    map[key] = p.status
  }

  return map
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

  let filtered = users.value.filter((u) => {
    return u.id !== user.value.id
  })
  // rimuovo l'utente preferito se presente
  if (favorites.value) {
    const idsDaRimuovere = new Set(favorites.value.map(item => item.favorite_user_id))
    filtered = filtered.filter((u) => !idsDaRimuovere.has(u.id))
  }

  if (searchQuery.value === '')
    return filtered.sort((a, b) => a.name.localeCompare(b.name))

  filtered = filtered.filter((user) => {
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
      .filter(item => item.status === 'office')
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


const openSheet = (user, date, note) => {
  selectedDate.value = date
  selectedUserNote.value = note
  selectedUser.value = user
  setTimeout(() => {
    bottomSheetOpen.value = true
  }, 100)
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
  addGuestError.value = ""

  // 💾 UPSERT
  await $fetch('/api/guests', {
    method: 'POST',
    body: {guest_name: guest_name, date}
  }).catch((err) => {
    addGuestError.value = err.data.message
  })

  await refreshGuests()
}

const favoriteUsers = computed(() => {
  const idsDaRimuovere = new Set(favorites.value.map(item => item.favorite_user_id))
  return users.value.filter((u) => idsDaRimuovere.has(u.id)).sort((a, b) => a.name.localeCompare(b.name))
})


onBeforeMount(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 200)
})

// Opzionale: aggiorna la lista automaticamente ogni 30 secondi per vedere chi si connette/disconnette
onMounted(() => {
  const interval = setInterval(() => {
    refreshUsers()
  }, 10000)

  onUnmounted(() => clearInterval(interval))
})


const onDeleteGuest = async (guest_name, date) => {
  // 🧹 DELETE
  await $fetch('/api/guests', {
    method: 'DELETE',
    body: {guest_name: guest_name, date: date}
  })
  await refreshGuests()
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
  }, 100)
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
                class="text-xs md:text-sm font-medium text-slate-700 px-1 md:px-2 min-w-[80px] md:min-w-[160px] text-center"
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
                  class="inline-flex px-3 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-800 transition-colors">
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
                    class="flex flex-col items-center w-10 rounded-xl border p-2 px-6 border-gray-150">
              <span class="text-[9px] font-medium uppercase" style="line-height: .8rem">{{ shortDayName(d) }}</span>
              <span class="text-sm font-semibold" style="line-height: .8rem">{{ dayNum(d) }}</span>
              <span class="text-[9px] font-medium" style="line-height: .8rem">{{ dayMonth(d) }}</span>
            </button>
            <div class="font-light text-center">{{ totalPresences(d) }}</div>
          </div>
        </div>
      </template>
    </Header>
    <Transition name="fade">
      <div class="w-100 mx-1 md:mx-3" v-if="!loading">
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

          <UserPresenceRow
              :presencesData="presencesData"
              :weekDays="weekDays"
              :today="today"
              :currentUser="true"
              :notes="notesDraft"
              :user="{...user}"
              @openSheet="openSheet"
          />

          <div v-if="favoriteUsers">

            <UserPresenceRow
                v-for="favorite in favoriteUsers"
                :key="favorite.name"
                :presencesData="presencesData"
                :weekDays="weekDays"
                :today="today"
                :notes="notesDraft"
                :user="favorite"
                :isFavorite="true"
                @openSheet="openSheet"
                @refreshFavorites="refreshFavorites"
            />
          </div>

          <UserPresenceRow
              v-for="user in availableUsers"
              :key="user.name"
              :presencesData="presencesData"
              :weekDays="weekDays"
              :today="today"
              :notes="notesDraft"
              :user="user"
              @openSheet="openSheet"
              @refreshFavorites="refreshFavorites"
          />
        </div>
        <BottomSheet v-if="selectedUser"
                     :visible="bottomSheetOpen"
                     :user="selectedUser"
                     :date="selectedDate"
                     :userNote="selectedUserNote"
                     :currentUser="selectedUser.id === user.id"
                     @setStatus="onSetStatus"
                     @abort="closeSheets"
                     @saveNote="onSaveNote"
        />
        <BottomSheetAddGuest v-if="selectedDate"
                             :guests="guestsPerDay.get(selectedDate) || []"
                             :date="selectedDate"
                             :visible="bottomSheetAddGuestOpen"
                             :errors="addGuestError"
                             @saveGuest="onSaveGuest"
                             @deleteGuest="onDeleteGuest"
                             onDeleteGuest="onDeleteGuest"
                             @abort="closeGuestSheets"/>

      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 1. Stato iniziale quando l'elemento entra (Iniziamo da opacità 0) */
.fade-enter-from {
  opacity: 0;
}

/* 2. Stato attivo dell'animazione (Definiamo la durata e la curva) */
.fade-enter-active {
  transition: opacity 0.5s ease;
}

/* 3. Stato finale dell'animazione (Opacità totale) */
.fade-enter-to {
  opacity: 1;
}

/* --- FACOLTATIVO: Se vuoi gestire anche il Fade-Out quando scompare --- */
.fade-leave-from {
  opacity: 1;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-leave-to {
  opacity: 0;
}

</style>