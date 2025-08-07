<script setup lang="ts">

const loading = ref(true);
const viewport = useViewportStore();

onMounted(async () => {
  viewport.updateWindowSize();
  window.addEventListener('resize', viewport.updateWindowSize);

  window.addEventListener('resize', setAppHeight);
  window.addEventListener('orientationchange', setAppHeight);
  setAppHeight();

  await useDatabasesStore().loadDatabases();

  await sleep(200);
  loading.value = false;
});

function setAppHeight() {
  const height = window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${height}px`);
}

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
  width: 100dvw;
  height: var(--app-height);
}
</style>