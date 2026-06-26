<template>
  <div class="bg-white rounded-xl border border-gray-100 p-5">
    <h3 class="text-sm font-medium text-gray-700 mb-4">Media presenze per giorno</h3>
    <ClientOnly>
      <apexchart
          type="bar"
          height="220"
          :options="chartOptions"
          :series="series"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
// Dati dalla query #4
const rows = await $fetch('/api/stats/by-weekday')
// rows = [{ giorno: 'Lunedì', media_presenze: 8.3 }, ...]

const series = computed(() => [{
  name: 'Media presenti',
  data: rows.map(r => r.media_presenze)
}])

const chartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  plotOptions: {
    bar: { borderRadius: 6, columnWidth: '55%' }
  },
  colors: ['#10b981'],
  xaxis: {
    categories: rows.map(r => r.giorno),
    labels: { style: { fontSize: '12px', colors: '#9ca3af' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { fontSize: '11px', colors: '#9ca3af' } }
  },
  grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
  dataLabels: {
    enabled: true,
    formatter: val => val.toFixed(1),
    style: { fontSize: '11px', colors: ['#fff'] }
  },
  tooltip: { theme: 'light' },
}))
</script>