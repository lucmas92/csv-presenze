<template>
  <div class="bg-white rounded-xl border border-gray-100 p-5">
    <h3 class="text-sm font-medium text-gray-700 mb-4">Colleghi vs ospiti per mese</h3>
    <ClientOnly>
      <apexchart
          type="bar"
          height="240"
          :options="chartOptions"
          :series="series"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
// Dati dalla query #10 estesa con colleghi e ospiti separati
const rows = await $fetch('/api/stats/monthly')
// rows = [{ mese: '2025-01', colleghi: 320, ospiti: 14 }, ...]

const series = computed(() => [
  { name: 'Colleghi', data: rows.map(r => r.colleghi) },
  { name: 'Ospiti',   data: rows.map(r => r.ospiti) },
])

const chartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  plotOptions: {
    bar: { borderRadius: 5, columnWidth: '60%', groupPadding: 0.1 }
  },
  colors: ['#10b981', '#a78bfa'],
  xaxis: {
    categories: rows.map(r => r.mese),
    labels: { style: { fontSize: '11px', colors: '#9ca3af' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { fontSize: '11px', colors: '#9ca3af' } }
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