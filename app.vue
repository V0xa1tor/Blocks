<script setup lang="ts">
onMounted(async () => {
  const bootstrap = await import("bootstrap");
});
</script>

<template>
  <div class="h-100">
    <NuxtLayout>
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