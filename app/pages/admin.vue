<script setup>
import {
  TriangleAlert
} from 'lucide-vue-next'
import Header from "~/components/Header.vue";

const isAuth = ref(false)
const loading = ref(false)
const password = ref('');
const errorMessage = ref('');
const loginErrorMessages = [
  "La password inserita è più lunga di quella attesa.",
  "Il secondo carattere è l'unico corretto.",
  "Hai indovinato alcune lettere.",
  "Manca solo il primo carattere per essere perfetta.",
  "La password è troppo corta per le normative del 2026.",
  "L'ultimo carattere è giusto, ma non ti dirò²²² quale è.",
  "Hai messo una lettera maiuscola. Il sistema non è contento.",
  "La password contiene numeri. Il sistema preferisce solo lettere.",
  "Il quinto carattere è sbagliato, ma ci siamo quasi.",
  "La password sembra corretta, ma il server è stanco.",
  "Hai indovinato il primo carattere. Il resto è un mistero.",
  "La password contiene simboli. Il server non capisce il linguaggio.",
  "Il terzo carattere è corretto, ma il quarto non lo è.",
  "La password è troppo complessa per il database.",
  "Hai inserito troppi punti esclamativi. Il sistema è confuso.",
  "La password contiene un numero che il server non sa contare.",
  "Il primo carattere è corretto. Il resto è un problema.",
  "La password è troppo simile a 'password'. Il sistema ha sospetti.",
  "Hai indovinato due caratteri. Il server ti ringrazia.",
  "La password contiene un carattere che il server non ha mai visto.",

  // Messaggi nerd (terminale/SQL)
  "SQL ERROR: password non trovata nel result set.",
  "Hash mismatch. Il server ha scelto la pace interiore.",
  "Autenticazione fallita. Il server ha fatto un errore 404.",
  "Brute force non consigliata. Il server si offende facilmente.",
  "Credit check failed: la password ha risposto con il silenzio.",
  "Session denied. Il sistema ha scelto la disciplina.",
  "Authenticating... fallito con stile.",
  "0 rows returned. Una coincidenza statistica molto chiara.",
  "Query fallita. Il risultato è rimasto pericolosamente vuoto.",
  "Login rejected. No leaks, no clues.",
]

const resetPresenze = async () => {
  if (confirm('Sicuro?')) {
    await $fetch('/api/reset-presences', {
      method: 'POST',
    })
  }
}

const getRandomErrorMessage = () => {
  const index = Math.floor(Math.random() * loginErrorMessages.length);
  return loginErrorMessages[index];
}

const handleLoginError = () => {
  if (password.value.length === 0) {
    errorMessage.value = 'ERROR 1045 (28000): Empty string — almeno provaci'
  } else {
    errorMessage.value = getRandomErrorMessage()
  }
}

const sqlInjection = computed(() => {
  return `'${password.value}'`
})

const login = () => {
  loading.value = true
  errorMessage.value = ''
  const isValid = password.value === 'admin123';

  setTimeout(() => {
    if (!isValid) {
      handleLoginError();
    } else {
      showError.value = false;
      isAuth.value = true;
    }
    loading.value = false
  }, 800)
}
</script>
<template>

  <div class="h-screen overflow-scroll pb-48 md:pb-0">
    <Header class="mb-2">
      <template v-slot:default>
        <div class="flex items-center gap-2 md:gap-3 py-2">
          <div>Impostazioni</div>
        </div>
      </template>
    </Header>
    <div v-if="!isAuth"
         class="flex gap-4 flex-col items-center justify-center min-h-64">
      <h3 class="text-2xl">Benvenuto</h3>
      <p class="pb-4">Accedi per modificare le impostazioni</p>
      <input id="password"
             class="bg-transparent w-full md:w-2/3 2xl:w-3/5 focus-visible:outline-none border-b mx-2 py-1 border-blue-500"
             placeholder="scrivi qui la password ... "
             @keydown.enter="login"
             type="text" v-model.trim="password">
      <div class="flex w-full md:w-2/3 2xl:w-3/5 p-3 rounded-md bg-gray-200 border border-gray-600 flex-col text-xl">
        <p><strong>SELECT</strong> 1</p>
        <p><strong>FROM</strong> users</p>
        <p><strong>WHERE</strong> PASSWORD = {{ sqlInjection }}</p>

        <p class="mt-4 font-bold text-base">Stato autenticazione</p>
        <p class="text-sm text-red-600 py-2" v-if="errorMessage">
          {{ errorMessage }}
        </p>
        <p class="text-sm text-gray-600 py-2" v-else-if="loading">
          -- sto calcolando il tuo destino ...
        </p>
        <p class="text-sm text-gray-600 py-2" v-else>
          -- in attessa dell'esecuzione della query ...
        </p>
      </div>
      <button class="bg-green-600 p-3 text-lg rounded-md text-green-100"
              type="button" @click="login">Esegui query
      </button>
    </div>
    <div>
      <div v-if="isAuth" class="flex items-center justify-center p-6">
        <button class="flex border rounded p-2 items-center gap-2" @click="resetPresenze">
          <TriangleAlert/>
          Reset Presenze
        </button>
      </div>
    </div>
  </div>
</template>