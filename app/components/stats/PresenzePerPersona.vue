<!-- components/stats/PresenceRateChart.vue -->
<template>
  <div class="bg-white rounded-xl border border-gray-100 p-5">
    <div class="mb-4">
      <h3 class="text-sm font-medium text-gray-900">Tasso di presenza in ufficio</h3>
      <p class="text-xs text-gray-400 mt-0.5">% giorni in ufficio sul totale registrato</p>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center h-48 text-gray-300">
      <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center h-48 text-red-400 text-sm gap-2">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Impossibile caricare i dati
    </div>

    <!-- Chart -->
    <ClientOnly v-else>
      <apexchart
        type="bar"
        :height="chartHeight"
        :options="chartOptions"
        :series="series"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
interface PersonRate {
  name: string
  ufficio: number
  totale: number
  percentuale: number
}

const { data, pending, error } = await useFetch<PersonRate[]>('/api/stats/by-person')

const series = computed(() => [{
  name: '% in ufficio',
  data: data.value?.map(p => p.percentuale) ?? []
}])

// Altezza dinamica in base al numero di persone
const chartHeight = computed(() => Math.max(280, (data.value?.length ?? 0) * 28))

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
    background: 'transparent',
    animations: { enabled: true, speed: 600 },
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      horizontal: true,
      barHeight: '55%',
      colors: {
        ranges: [
          { from: 60, to: 100, color: '#16A37F' }, // verde — alta presenza
          { from: 40, to: 59,  color: '#D97706' }, // ambra — media
          { from: 0,  to: 39,  color: '#E5E7EB' }, // grigio — bassa
        ],
      },
    },
  },
  xaxis: {
    categories: data.value?.map(p => p.name) ?? [],
    min: 0,
    max: 100,
    labels: {
      formatter: (val: number) => `${val}%`,
      style: { fontSize: '11px', colors: '#9CA3AF' },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { fontSize: '12px', colors: '#374151' },
    },
  },
  grid: {
    borderColor: '#F3F4F6',
    strokeDashArray: 3,
    padding: { left: 4, right: 16 },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val}%`,
    style: { fontSize: '11px', fontWeight: '500', colors: ['#1F2937'] },
    offsetX: 6,
  },
  tooltip: {
    theme: 'light',
    custom: ({ dataPointIndex }: { dataPointIndex: number }) => {
      const p = data.value?.[dataPointIndex]
      if (!p) return ''
      return `
        <div style="padding:10px 12px;font-size:12px;line-height:1.6">
          <div style="font-weight:500;margin-bottom:4px">${p.name}</div>
          <div style="color:#6B7280">${p.ufficio} giorni in ufficio</div>
          <div style="color:#6B7280">${p.totale} giorni totali</div>
          <div style="font-weight:500;color:#16A37F;margin-top:4px">${p.percentuale}% in ufficio</div>
        </div>`
    },
  },
}))
</script>