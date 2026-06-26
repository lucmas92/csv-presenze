<template>
  <div class="bg-white rounded-xl border border-gray-100 p-5">
    <h3 class="text-sm font-medium text-gray-700 mb-4">Presenze per settimana</h3>
    <ClientOnly>
      <apexchart
        type="area"
        height="240"
        :options="chartOptions"
        :series="series"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
// Dati che arrivano dalla query #6
const rows = await $fetch('/api/stats/weekly')
// rows = [{ settimana: '2025-20', totale_presenze: 42 }, ...]

const series = computed(() => [{
  name: 'Presenze in ufficio',
  data: rows.map(r => r.totale_presenze)
}])

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 }
  },
  colors: ['#10b981'],
  xaxis: {
    categories: rows.map(r => r.settimana),
    labels: { style: { fontSize: '11px', colors: '#9ca3af' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { fontSize: '11px', colors: '#9ca3af' } }
  },
  grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
  tooltip: { theme: 'light' },
  dataLabels: { enabled: false },
}))
</script>