<script setup lang="ts">
import { Chart, type ChartConfiguration } from 'chart.js/auto';

const estimate = ref<StorageEstimate>();
const freeSpace = computed(() => {
  if (estimate.value !== undefined) {
    if (estimate.value.quota !== undefined && estimate.value.usage !== undefined) {
      return (estimate.value!.quota! - estimate.value!.usage!);
    } else {
      return 0;
    }
  } else {
    return 0;
  }
});
const dbSpace = computed(() => {
  if (estimate.value !== undefined) {
    if (estimate.value.quota !== undefined && estimate.value.usage !== undefined) {
      return (estimate.value!.usage!);
    } else {
      return 0;
    }
  } else {
    return 0;
  }
});

onMounted(async () => {
  const ctx = document.getElementById('storage-chart') as HTMLCanvasElement;

  if (navigator.storage) {

    estimate.value = await navigator.storage.estimate();
  
    const data = {
      labels: [
        `Livre (${(freeSpace.value / 1024 / 1024 / 1024).toFixed(1)} MB)`,
        `Usado (${(dbSpace.value / 1024).toFixed(1)} kB)`
      ],
      datasets: [{
        data: [freeSpace.value, dbSpace.value],
        backgroundColor: [
          'rgb(255, 205, 86)',
          'rgb(54, 162, 235)'
        ],
        hoverOffset: 4
      }]
    };
    
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: data
    };
    
    new Chart(ctx, config);
  }

});

</script>

<template>
  <div class="container my-3">

    <h1 class="mb-3">Armazenamento</h1>

    <div class="vstack gap-3">

      <div class="card">
        <div class="card-body">

          <canvas v-show="estimate" id="storage-chart"></canvas>

          <div v-if="!estimate">
            <h2 class="text-danger">Estimativa não suportada</h2>
            <p>Motivos prováveis:</p>
            <ul>
              <li>Você está em um contexto não seguro (HTTP)</li>
              <li>Seu navegador não suporta o Storage</li>
            </ul>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>