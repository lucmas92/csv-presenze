<script setup lang="ts">
import {ref} from "vue";

const sheet = ref()
const userName = ref<string>('')
const modal = ref()
const emit = defineEmits<{
  (e: 'saveUser', userName: string): void
  (e: 'abort'): void
}>()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
})

watch(props, (newVal, oldVal) => {
  if (props.visible)
    userName.value = ''
})

const saveUser = () => {
  emit('saveUser', userName.value)
  emit('abort')
}

const getClass = () => {
  return props.visible ? 'open' : ''
}

const abort = () => {
  emit('abort')
}
</script>
<template>
  <div class="sheet-backdrop" @click.self="abort()" :class="getClass()" id="sheet">
    <div ref="sheet" class="sheet">
      <div class="sheet-handle"></div>
      <div class="px-5 pt-4 pb-3">
        <div class="flex justify-between">
          <input
              class="w-full my-2 px-4 py-2 focus-visible:outline-none border border-gray-200"
              autofocus
              v-model="userName"
              placeholder="Nome utente..."
              @keyup.enter="saveUser()"
          />
        </div>
        <div class="flex flex-col gap-2">
          <button @click="saveUser()"
                  class="w-full py-3 rounded-2xl border bg-green-200 border-green-500 text-sm font-medium text-green-600 active:bg-green-200">
            Salva
          </button>
          <button @click="abort()"
                  class="w-full py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-600 active:bg-slate-50">
            Annulla
          </button>
        </div>
      </div>
    </div>
    <dialog ref="modal" class="rounded-xl p-6 w-96 backdrop:bg-black/30">
      <h2 class="text-base font-medium mb-4">
        Aggiungi utente</h2>
      <div class="flex justify-end gap-2 mt-4">
        <button @click="modal.close()" class="px-4 py-2 text-sm">Annulla</button>
        <button @click="saveUser()" class="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg">Salva</button>
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