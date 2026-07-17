<script setup lang="ts">
import {ref} from "vue";

const name = ref<string>('')
const username = ref<string>('')
const emit = defineEmits<{
  (e: 'saveUser', name: string, username: string): void
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

const saveUser = () => {
  if (name.value && username.value) {
    emit('saveUser', name.value, username.value)
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
        <div class="flex justify-between mb-3">
          <input
              class="w-full rounded-xl px-4 py-2 focus-visible:outline-none border border-gray-200"
              autofocus
              v-model="name"
              placeholder="Nome utente..."
              @keyup.enter="saveUser()"
          />
        </div>
        <div class="flex justify-between">
          <input
              class="w-full rounded-xl px-4 py-2 focus-visible:outline-none border border-gray-200"
              v-model="username"
              placeholder="Username..."
              @keyup.enter="saveUser()"
          />
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