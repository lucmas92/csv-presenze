<script setup lang="ts">
import {
  Briefcase,
  Home,
  Plane,
  Minus,
  NotebookPen
} from 'lucide-vue-next'
import {ref} from "vue";
import {initials} from "~/utils/utils";

const sheet = ref()
const modal = ref()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  userNote: {
    type: String,
  },
  currentUser: {
    type: Boolean,
  }
})
const localUserNote = ref(props.userNote)


const emit = defineEmits<{
  (e: 'setStatus', userId: number, date: string, status: string | null): void
  (e: 'saveNote', userId: number, date: string, note: string): void
  (e: 'abort'): void
}>()

const setStatus = (status: string | null) => {
  emit("setStatus", props.user.id, props.date, status)
}

const saveNote = (isDelete = false) => {
  if (isDelete || (localUserNote.value && localUserNote.value.length > 0)) {
    emit("saveNote", props.user.id, props.date, localUserNote.value)
    setTimeout(() => {
      modal.value.close()
    }, 100)
  }
}

const deleteNote = () => {
  localUserNote.value = ''
  saveNote(true)
}

const abort = () => {
  setTimeout(() => {
    emit("abort")
  }, 100)
}

const getClass = () => {
  return props.visible ? 'open' : ''
}

const showAddNoteModal = () => {
  setTimeout(() => {
    modal.value.showModal()
  }, 100)
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
    <div ref="sheet" class="sheet w-full md:w-2/3 xl:w-1/2 mx-auto">
      <div class="sheet-handle"></div>
      <div v-if="user" class="px-5 pt-4 pb-3">
        <p class="flex items-center gap-2 text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
          <span>Imposta stato</span>
          <span>-</span>
          <span v-html="formatDate2(date)"/>
        </p>
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center gap-3">
            <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border border-gray-300"
                id="sheet-avatar">{{ initials(user.name) }}
            </div>
            <div>
              <p class="font-semibold text-lg" id="sheet-name">
                {{ user.name }}
              </p>
            </div>
          </div>
          <button class="flex items-center gap-3" v-if="currentUser" type="button" @click="showAddNoteModal">
            <NotebookPen :size="24"/>
          </button>
        </div>
        <div v-if="userNote" class="mb-3">
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            Note
          </p>
          <span>{{ userNote }} </span>
        </div>
        <div v-if="currentUser" class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <button @click="setStatus('office')"
                  class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-200 active:opacity-70">
            <span
                class="w-10 h-10 rounded-xl bg-green-300 flex items-center justify-center">
              <Briefcase/>
            </span>
            <span class="text-xs font-medium text-green-800">Presente</span>
          </button>
          <button @click="setStatus('remote')"
                  class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-200 active:opacity-70">
            <span class="w-10 h-10 rounded-xl bg-gray-300 flex items-center justify-center">
              <Home/>
            </span>
            <span class="text-xs font-medium text-gray-800">Smart</span>
          </button>
          <button @click="setStatus('holiday')"
                  class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-orange-200 active:opacity-70">
            <span class="w-10 h-10 rounded-xl bg-orange-300 flex items-center justify-center">
              <Plane/>
            </span>
            <span class="text-xs font-medium text-orange-800">Ferie</span>
          </button>
          <button @click="setStatus(null)"
                  class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 active:opacity-70">
            <span class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
              <Minus/>
            </span>
            <span class="text-xs font-medium text-slate-500">Rimuovi</span>
          </button>
        </div>
        <button @click="abort()"
                class="w-full py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-600 active:bg-slate-50">
          Chiudi
        </button>
      </div>
    </div>


    <dialog ref="modal" class="rounded-xl p-6 w-96 backdrop:bg-black/30">
      <h2 class="text-base font-medium mb-4">
        Aggiungi nota per
        <span class="font-bold">{{ date }}</span></h2>
      <textarea
          v-model.trim="localUserNote" class="w-full border rounded-lg p-2 text-sm"/>
      <div class="flex justify-end gap-2 mt-4">
        <button type="button" @click="modal.close()" class="px-4 py-2 text-sm rounded-2xl border border-gray-200">
          Chiudi
        </button>
        <button type="button" @click="deleteNote()" :disabled="!localUserNote || localUserNote.length === 0"
                class="px-4 py-2 text-sm rounded-2xl text-red-500 bg-red-200 disabled:bg-gray-200">Elimina
        </button>
        <button type="button" @click="saveNote()" :disabled="!localUserNote || localUserNote.length === 0"
                class="px-4 py-2 text-sm rounded-2xl bg-emerald-600 text-white disabled:bg-gray-200">Salva
        </button>
      </div>
    </dialog>
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