<script setup lang="ts">
</script>

<template>
  <nav class="hstack gap-2 bg-body-tertiary border-bottom p-2">
    <div>
      <button class="btn p-1 fs-4" data-bs-toggle="offcanvas" data-bs-target="#offcanvas"><i class="bi bi-list"></i></button>
    </div>
  </nav>
</template>

<style scoped>
i, i::before {
  display: block;
}

.sortable-drag {
  opacity: 0;
}

/* #tabs {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
#tabs::-webkit-scrollbar { 
  display: none;
} */
</style>