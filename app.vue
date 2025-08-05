<script setup lang="ts">

const loading = ref(true);
const viewport = useViewportStore();

onMounted(async () => {
  viewport.updateWindowSize();
  window.addEventListener('resize', viewport.updateWindowSize);

  await useDatabasesStore().loadDatabases();

  await sleep(200);
  loading.value = false;
});

</script>

<template>

  <NuxtPwaManifest />

  <div v-if="loading"
    class="position-fixed bg-body w-100 h-100 d-flex justify-content-center align-items-center"
    style="z-index: 9999;"
  >
    <Loading />
  </div>

  <div class="vstack h-100">
    <TopBar />
    <NuxtLayout :name="viewport.isLandscape ? 'landscape' : 'default'" >
      <Offcanvas />
      <NuxtPage />
    </NuxtLayout>
  </div>
  
</template>

<style>
html, body, #__nuxt {
  width: 100vw;
  height: 100vh;
}
</style>