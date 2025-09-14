<script setup lang="ts">
import { Database } from '~/models/Database';
</script>

<template>
  <div class="vstack container align-items-center justify-content-between my-5">
    <div class="d-flex flex-column align-items-center user-select-none">
      <img @click="(e) => { if (e.detail === 3) navigateTo('/game') }"
       src="/bloctopus.svg" style="width: 7rem;" draggable="false" alt="Bloctopus icon">
      <h1 class="fw-semibold">Blocks</h1>
    </div>
    
    <div>
      <a class="btn btn-outline-primary hstack gap-2 justify-content-center" href="https://github.com/V0xa1tor/Bloctopus"><i class="bi bi-github"></i>Source code</a>
    </div>
    
    <div class="text-secondary">
      <p>Version {{ useAppConfig().version }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>