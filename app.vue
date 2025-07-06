<script setup lang="ts">

const loading = ref(true);

const viewport = useViewportStore();

onNuxtReady(async () => {
  const bootstrap = await import("bootstrap");

  viewport.updateWindowSize();
  window.addEventListener('resize', viewport.updateWindowSize);

  await sleep(200);
  loading.value = false;
});

</script>

<template>
  <div v-if="loading"
    class="position-fixed bg-body vw-100 vh-100 d-flex justify-content-center align-items-center"
    style="z-index: 9999;"
  >
    <Loading />
  </div>
  <div class="h-100">
    <NuxtLayout :name="viewport.isLandscape ? 'landscape' : 'default'" >
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