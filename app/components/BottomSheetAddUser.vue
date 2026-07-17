<script setup lang="ts">
import {ref} from "vue";

const name = ref<string>('')
const username = ref<string>('')
const isGuest = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'saveUser', name: string, username: string, isGuest: boolean): void
  (e: 'abort'): void
}>()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
})

watch(props, () => {
  if (props.visible) {
    name.value = ''
    username.value = ''
  }
})


watch(name, (n) => {
  const split = n.split(" ", 2)
  if (split[0])
    username.value = split[0].slice(0, 3).toLowerCase()
  if (split[1])
    username.value += split[1].slice(0, 3).toLowerCase()
})

const saveUser = () => {
  if (name.value && username.value) {
    emit('saveUser', name.value, username.value, isGuest.value)
    emit('abort')
  }
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
    <div ref="sheet" class="sheet w-full md:w-2/3 xl:w-1/3 mx-auto">
      <div class="sheet-handle"></div>
      <div class="px-5 pt-4 pb-3">
        <p class="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Aggiunta utente</p>
        <div class="flex justify-between">
          <input
              class="w-full rounded-xl px-4 py-2 focus-visible:outline-none border border-gray-200"
              autofocus
              v-model="name"
              placeholder="Nome utente..."
              @keyup.enter="saveUser()"
          />
        </div>
        <div class="flex justify-between my-3">
          <input
              class="w-full rounded-xl px-4 py-2 focus-visible:outline-none border border-gray-200"
              v-model="username"
              placeholder="Username..."
              @keyup.enter="saveUser()"
          />
        </div>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-slate-800">Questo utente è un Ospite</span>
            </div>
            <p class="text-xs text-slate-500 max-w-sm">
              Attiva questa opzione se si tratta di un consulente esterno o di un ospite temporaneo.
            </p>
          </div>

          <!-- Switch Toggle Visivo -->
          <label class="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
            <input type="checkbox" name="is_guest" class="sr-only peer" v-model="isGuest">
            <span
                class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></span>
          </label>
        </div>
        <div class="flex flex-col gap-2 mt-2">
          <button @click="saveUser()"
                  class="w-full py-3 rounded-2xl border bg-green-200 border-green-500 text-sm font-medium text-green-600 active:bg-green-200">
            Salva
          </button>
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