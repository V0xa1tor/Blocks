<script setup lang="ts">
onNuxtReady(async () => {
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
@import "bootstrap";
@import "bootstrap-icons/font/bootstrap-icons";

html, body, #__nuxt {
  width: 100vw;
  height: 100vh;
}
</style>