<script setup lang="ts">
import Sortable from "sortablejs";
import { useActionMenuStore } from "~/stores/actionMenu";

const actionMenu = useActionMenuStore();

onMounted(() => {
  const sortable = Sortable.create(document.getElementById("left-menu")!, {
    animation: 150,
    delay: 500,
    delayOnTouchOnly: true
  });
});

</script>

<template>
  <div id="left-menu" class="vstack flex-grow-0 p-2 gap-2">
    <div v-for="item in actionMenu.items">
      <button v-if="item.type == 'action'"
        class="btn btn-outline-secondary fs-4 p-1"
        @click="navigateTo(item.action.to)"
      >
        <i :class="`bi ${item.icon}`"></i>
      </button>
      <hr v-if="item.type == 'divider'" class="my-2">
    </div>
  </div>
</template>

<style scoped>
i, i::before {
  display: block;
}

.sortable-ghost {
  visibility: hidden;
}
</style>