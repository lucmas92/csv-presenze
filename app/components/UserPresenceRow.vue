<script setup>
import {initials} from "~/utils/utils.ts";
import {Briefcase, Home, Minus, Plane, Star, StickyNote} from "lucide-vue-next";

const emit = defineEmits(['refreshFavorites', 'openSheet'])

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

const presences = computed(() => {
  const map = []

  if (!props.presencesData) return map

  for (const p of props.presencesData) {
    const key = `${p.user_id}-${p.date}`
    map[key] = p.status
  }

  return map
})

const dayNum = (d) => {
  const date = new Date(d)
  return date.getDate()
}

const openSheet = (date) => {
  emit("openSheet", props.user, date, props.notes[`${props.user.id}-${date}`])
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

const countByUser = (user) => {
  if (!props.presencesData) return {}

  return props.presencesData
      .filter(item => item.user_id === user.id && item.status === 'office')
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
      <div class="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0">
        {{ initials(user.name) }}
      </div>
      <div class="flex-1 flex items-center min-w-0">
        <p class="text-sm font-semibold text-slate-900 truncate">{{ user.name }}</p>
        <span v-if="!currentUser" @click="toggleFavorite(user)">
                  <Star v-if="isFavorite" class="ml-2 cursor-pointer hover:text-green-600 font-bold text-green-400 fill-current"
                         :size="15"/>
                  <Star v-else class="ml-2 text-gray-400 cursor-pointer hover:text-green-600"
                        :size="15"/>
                </span>
      </div>
      <span class="text-sm shrink-0">{{ countByUser(user) }}/5</span>
    </div>
    <div class="flex justify-around px-2 py-3">
      <button v-for="d in weekDays" :key="d"
              class="day-pill h-16 md:min-w-24 lg:min-w-40 xl:min-w-52" :class="getDayPillClass(d, presences[`${user.id}-${d}`])"
              @click="openSheet(d)">
          <span
              :class="{'text-blue-500': d===today, 'text-slate-400':d!==today}"
              class="text-[10px] font-medium">
            {{ shortDayName(d) }}
          </span>
        <span class="text-xs font-semibold">
              {{ dayNum(d) }}
          </span>
        <span>
            <StickyNote v-if="hasNote(d)" class="absolute top-0 -right-4 text-blue-800" :size="12"/>
            <Briefcase class="text-green-500" v-if="presences[`${user.id}-${d}`] === 'office'" :size="18"/>
            <Home class="text-gray-500" v-else-if="presences[`${user.id}-${d}`] === 'remote'" :size="18"/>
            <Plane class="text-orange-500" v-else-if="presences[`${user.id}-${d}`] === 'holiday'" :size="18"/>
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
  border-radius: 16px;
  overflow: hidden;
}

.user-card + .user-card {
  margin-top: 8px;
}
</style>