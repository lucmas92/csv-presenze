<template>
  <div class="bg-white rounded-xl border border-gray-100 p-5">
    <h3 class="text-sm font-medium text-gray-700 mb-4">Distribuzione per persona</h3>
    <ClientOnly>
      <apexchart
          type="bar"
          height="320"
          :options="chartOptions"
          :series="series"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
// Dati dalla query #2 — già raggruppati per nome e status
const rows = await $fetch('/api/stats/by-person-status')
// rows = [{ name: 'Giulia', status: 'office', giorni: 18 }, ...]

// Pivot: raggruppa per persona
const names = [...new Set(rows.map(r => r.name))]
const byStatus = (status) => names.map(name => {
  const row = rows.find(r => r.name === name && r.status === status)
  return row?.giorni ?? 0
})

const series = computed(() => [
  { name: 'Ufficio',  data: byStatus('office') },
  { name: 'Remote',    data: byStatus('remote') },
  { name: 'Ferie',    data: byStatus('holiday') },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  plotOptions: {
    bar: { borderRadius: 4, horizontal: true, barHeight: '60%' }
  },
  colors: ['#10b981', '#60a5fa', '#f59e0b'],
  xaxis: {
    categories: names,
    labels: { style: { fontSize: '11px', colors: '#9ca3af' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { fontSize: '12px', colors: '#374151' } }
  },
  legend: {
    position: 'top',
    fontSize: '12px',
    labels: { colors: '#6b7280' },
    markers: { size: 6, shape: 'circle' }
  },
  grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
  dataLabels: { enabled: false },
  tooltip: { theme: 'light' },
}))
</script>