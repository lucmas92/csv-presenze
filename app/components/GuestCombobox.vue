<script setup>
import {Search, ChevronsUpDown} from 'lucide-vue-next'

const emit = defineEmits(['select'])

const isOpen = ref(false)
const search = ref('')

const selectGuest = (guest) => {
  emit('select', guest.name)
  search.value = guest.name
  isOpen.value = false
}

const onInput = () => {
  emit('select', search.value)
}


const {data: guests} = await useFetch('/api/users', {
  query: {
    withGuests: 1,
    onlyGuests: 1
  }
})

const filteredGuests = computed(() => {
  return guests.value.filter(u =>
      u.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

</script>
<template>
  <div class="w-full space-y-1.5 relative">
    <!-- INPUT DI RICERCA -->
    <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search/>
            </span>

      <input type="text"
             id="combobox_input"
             @focus="isOpen = true"
             @input="onInput"
             v-model="search"
             placeholder="Cerca o seleziona un utente..."
             autocomplete="off"
             class="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm transition">

      <!-- Pulsante di reset / toggle a destra -->
      <button type="button" id="combobox_toggle" @click="isOpen = !isOpen"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition">
        <ChevronsUpDown/>
      </button>
    </div>

    <!-- MENU A DISCESA PERSONALIZZATO (Nascosto di default con 'hidden') -->
    <div id="combobox_menu"
         :class="{'hidden':!isOpen}"
         class="absolute bg-white top-full left-0 w-full mt-1.5  border border-slate-100 rounded-xl shadow-xl max-h-32 overflow-y-auto z-50 p-1 space-y-0.5">

      <button v-for="guest in filteredGuests" :key="guest.id" type="button" @click="selectGuest(guest)"
              class="combobox-item w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center justify-between text-sm transition">
        <span class="flex items-center gap-2">
          <span
              class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px]">
            {{ initials(guest.name) }}
          </span>
          <span class="font-medium text-slate-800">{{ guest.name }}</span>
        </span>
      </button>

      <!-- Messaggio "Nessun risultato" -->
      <div v-if="guests.length === 0" id="no_results" class="text-center py-4 text-xs text-slate-400">
        <i data-lucide="user-x" class="w-4 h-4 mx-auto mb-1 text-slate-300"></i>
        Nessun utente trovato
      </div>

    </div>
  </div>
</template>