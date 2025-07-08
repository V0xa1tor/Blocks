<script setup lang="ts">
import Sortable from "sortablejs";

const blocks = ref(["Teste 1", "Teste 2", "Teste 3", "Teste 4", "Teste 5", "Teste 6"]);

onMounted(() => {
  const sortable = Sortable.create(document.getElementById("tabs")!, {
    direction: "horizontal",
    animation: 150,
    delay: 500,
    delayOnTouchOnly: true
  });
});

</script>

<template>
  <nav class="sticky-top hstack gap-2 bg-body-tertiary border-bottom p-2 pb-0">
    <div>
      <button class="btn p-1 fs-4" data-bs-toggle="offcanvas" data-bs-target="#offcanvas"><i class="bi bi-list"></i></button>
    </div>
    <ul id="tabs" class="nav nav-tabs text-nowrap overflow-x-auto overflow-y-hidden flex-nowrap border-bottom-0 w-100">
      <li v-for="text in blocks" class="nav-item">
        <a class="nav-link text-body" :class="{ 'active': text == 'Teste 1' }" aria-current="page" href="#">{{ text }}</a>
      </li>
    </ul>
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