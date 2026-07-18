<script setup lang="ts">
import {Trash} from 'lucide-vue-next'
import {ref} from "vue";
import {initials} from "~/utils/utils";
import {
  Plus
} from 'lucide-vue-next'
import GuestCombobox from "~/components/GuestCombobox.vue";

const props = defineProps({
  date: {
    type: String,
    required: true
  },
  guests: {
    type: Array,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const guestName = ref<string>('')
const selectedDate = ref(props.date)
const emit = defineEmits<{
  (e: 'saveGuest', guestName: string, date: string): void
  (e: 'deleteGuest', guestName: string, date: string): void
  (e: 'abort'): void
}>()
watch(props, () => {
  if (props.visible) {
    guestName.value = ''
  }
  selectedDate.value = props.date
})

const onSelect = (name: string) => {
  guestName.value = name
}

const saveGuest = () => {
  if (guestName.value.length > 1) {
    emit('saveGuest', guestName.value, selectedDate.value)
  }
}

const deleteGuest = (guest: any) => {
  emit('deleteGuest', guest.guest_name, selectedDate.value)
}

const getClass = () => {
  return props.visible ? 'open' : ''
}

const abort = () => {
  emit('abort')
}
const handleKeyDown = (event: any) => {
  if (event.key === 'Escape' || event.key === 'Esc') {
    abort()
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
<template>
  <div class="sheet-backdrop" @click.self="abort()" :class="getClass()" id="sheet">
    <div ref="sheet" class="sheet w-full md:w-2/3 xl:w-1/3 mx-auto min-h-64">
      <div class="sheet-handle"></div>
      <div class="px-5 pt-4 pb-3">
        <p class="flex items-center gap-2 text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
          <span>Aggiunta ospite</span>
          <span>-</span>
          <span v-html="formatDate2(date)"/>
        </p>
        <div class="flex justify-between gap-2">
          <GuestCombobox @select="onSelect"/>
          <button @click="saveGuest()"
                  :disabled="!guestName"
                  class="w-12 py-3 rounded-2xl border bg-green-200 border-green-500 text-sm font-medium text-green-600 active:bg-green-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-400">
            <Plus :size="12" class="mx-auto"/>
          </button>
        </div>
        <div class="flex flex-col gap-2" :class="{'mt-2': guests.length > 0}">
          <div v-for="guest in (guests as any)" :key="guest.id"
               class="relative flex justify-between items-center px-2 pt-2 pb-3 border border-gray-200 rounded-2xl">
            <div class="flex items-center gap-3 px-4 py-2 border-b border-slate-50">
              <div
                  class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold shrink-0">
                {{ initials(guest.guest_name) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-900 truncate">{{ guest.guest_name }}</p>
              </div>
            </div>
            <button type="button" @click="deleteGuest(guest)">
              <Trash/>
            </button>
            <p class="absolute bottom-1 right-3 text-xs text-gray-400">
              Aggiunto da: <strong>{{guest.creator}}</strong>
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-2 mt-2">
          <button @click="abort()"
                  class="w-full py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-600 active:bg-slate-50">
            Chiudi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>

/* ── BOTTOM SHEET (mobile only) ── */
.sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, .4);
  backdrop-filter: blur(3px);
  z-index: 40;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s;
}

.sheet-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

.sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 16px);
  z-index: 50;
  transform: translateY(100%);
  transition: transform .28s cubic-bezier(.4, 0, .2, 1);
}

.sheet-backdrop.open .sheet {
  transform: translateY(0);
}

.sheet-handle {
  width: 36px;
  height: 4px;
  background: #E2E8F0;
  border-radius: 99px;
  margin: 12px auto 0;
}
</style>