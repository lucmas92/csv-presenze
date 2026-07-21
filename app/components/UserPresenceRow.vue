<script setup>
import {initials} from "~/utils/utils.ts";
import {Briefcase, Home, Minus, Plane, Star, StickyNote, Utensils, Presentation} from "lucide-vue-next";

const emit = defineEmits(['refreshFavorites', 'openSheet', 'setStatus'])

const props = defineProps({
  user: {
    required: true
  },
  presencesData: {
    required: true
  },
  weekDays: {
    required: true
  },
  today: {
    required: true
  },
  notes: {
    required: true
  },
  currentUser: {
    default: false
  },
  isFavorite: {
    default: false
  }
})

const isOnline = computed(() => {
  if (props.currentUser)
    return true

  const lastLoginAt = props.user.last_login_at
  if (!lastLoginAt) return false

  const now = Date.now() // Timestamp attuale in millisecondi

  // Convertiamo il valore in millisecondi
  let lastLoginTime = new Date(lastLoginAt).getTime()

  // Se il tuo database SQLite salva in secondi (timestamp Unix a 10 cifre) invece che millisecondi,
  // moltiplichiamo per 1000 per allinearlo a Javascript
  if (typeof lastLoginAt === 'number' && lastLoginAt < 10000000000) {
    lastLoginTime = lastLoginAt * 1000
  }

  const dueMinutiInMs = 2 * 60 * 1000

  // Ritorna true se la differenza è inferiore a 2 minuti
  return (now - lastLoginTime) < dueMinutiInMs
})

const presences = computed(() => {
  const map = []

  if (!props.presencesData) return map

  for (const p of props.presencesData) {
    map[p.date] = p.status
  }

  return map
})


const dayNum = (d) => {
  const date = new Date(d)
  return date.getDate()
}

const isInMeeting = (date) => {
  const presence = props.presencesData.find(p => p.date === date)
  return presence?.status === 'office' && !!presence?.is_in_meeting
}
const isEatingOut = (date) => {
  const presence = props.presencesData.find(p => p.date === date)
  return presence?.status === 'office' && !!presence?.is_eating_out
}

const toggleOfficeStatus = (date) => {
  toggleStatus(date, 'office')
}

const toggleRemoteStatus = (date) => {
  toggleStatus(date, 'remote')
}

const toggleStatus = (date, status) => {

  const currentDateStatus = presences.value[`${props.user.id}-${date}`] || null
  if (currentDateStatus === status)
    emit("setStatus", props.user.id, date, null)
  else
    emit("setStatus", props.user.id, date, status)
}

const openSheet = (date) => {
  const note = props.notes[`${props.user.id}-${date}`]
  const presence = props.presencesData.find(p => {
    return p.date === date;
  })
  emit("openSheet", props.user, date, note, presence)
}

const hasNote = (date) => {
  return !!props.notes[`${props.user.id}-${date}`]
}

const getDayPillClass = (date, status) => {
  let classes = date === props.today ? 'today-pill ' : ''
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

const userClass = computed(() => {
  if (props.currentUser) return 'border border-orange-400';
  if (props.isFavorite) return 'border-2 border-green-400'
})

const countByUser = () => {
  if (!props.presencesData) return {}

  return props.presencesData
      .filter(item => item.status === 'office')
      .length
}

const shortDayName = (d) => {
  const date = new Date(d)
  return date.toLocaleDateString('it', {weekday: 'short'}).toUpperCase()
}

const deleteFavorite = async (favorite) => {
  await $fetch('/api/favorites', {
    method: 'DELETE',
    body: {favorite_user_id: "" + favorite.id}
  })
}

const toggleFavorite = async (favorite) => {
  if (props.isFavorite) {
    await deleteFavorite(favorite)
  } else {
    await setFavorite(favorite)
  }
  emit('refreshFavorites')
}

const setFavorite = async (favorite) => {
  await $fetch('/api/favorites', {
    method: 'POST',
    body: {favorite_user_id: "" + favorite.id}
  })
}
</script>
<template>
  <div class="user-card bg-white mb-2 shadow-sm"
       :class="userClass">
    <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-50">
      <span class="relative flex size-3 w-10 h-10 ">
        <span class="absolute  inline-flex w-10 h-10 animate-ping rounded-full opacity-75"
              :class="{'bg-green-300': isOnline}">
        </span>
        <span class="relative inline-flex items-center w-10 h-10 size-3 rounded-full border border-gray-300"
              :class="{'bg-green-400': isOnline}">
          <span class="mx-auto">{{ initials(user.name) }}</span>
        </span>

      </span>
      <div class="flex-1 flex items-center min-w-0">
        <p class="text-lg font-semibold text-slate-900 truncate">{{ user.name }}</p>
        <span v-if="!currentUser" @click="toggleFavorite(user)">
                  <Star v-if="isFavorite"
                        class="ml-2 cursor-pointer hover:text-green-600 font-bold text-green-400 fill-current"
                        :size="15"/>
                  <Star v-else class="ml-2 text-gray-400 cursor-pointer hover:text-green-600"
                        :size="15"/>
                </span>
      </div>
      <span class="text-sm shrink-0 bg-gray-100 px-3 py-1 rounded-full ">Presenze {{ countByUser(user) }}/5</span>
    </div>
    <div class="flex justify-around px-2 py-3">
      <button v-for="d in weekDays" :key="d"
              class="day-pill h-16 md:min-w-24 lg:min-w-40 xl:min-w-52 border border-gray-150 rounded-xl"
              :class="getDayPillClass(d, presences[`${d}`])"
              @click.ctrl="toggleRemoteStatus(d)"
              @click.meta="toggleRemoteStatus(d)"
              @click.shift="toggleOfficeStatus(d)"
              @click.exact="openSheet(d)">
          <span
              :class="{'text-blue-500': d===today, 'text-slate-400':d!==today}"
              class="text-[10px] font-medium">
            {{ shortDayName(d) }}
          </span>
        <span class="text-xs font-semibold">
              {{ dayNum(d) }}
          </span>
        <span>
            <StickyNote v-if="hasNote(d)" class="absolute fill-current top-0 md:top-1 -right-5 md:right-1 text-black" :size="16"/>
            <Presentation v-if="isInMeeting(d)" class="absolute fill-current top-6 md:top-6 -right-5 md:right-1 text-black"
                          :size="16"/>
            <Utensils v-if="isEatingOut(d)"
                      class="absolute fill-current top-11 md:top-11 -right-5 md:right-1 text-black" :size="16"/>

            <Briefcase data-tooltip-target="tooltip-utensils" class="text-green-500" v-if="presences[`${d}`] === 'office'" :size="18"/>
            <Home class="text-gray-500" v-else-if="presences[`${d}`] === 'remote'" :size="18"/>
            <Plane class="text-orange-500" v-else-if="presences[`${d}`] === 'holiday'" :size="18"/>
            <Minus v-else :size="16"/>
          </span>
      </button>
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
  padding: 6px 0;
  cursor: pointer;
  transition: background .12s, transform .1s;
  position: relative;
}

.day-pill.today-pill {
  box-shadow: 0 0 0 2px #2563EB;
}

/* User card */
.user-card {
  border-radius: 16px;
  overflow: hidden;
}

.user-card + .user-card {
  margin-top: 8px;
}
</style>