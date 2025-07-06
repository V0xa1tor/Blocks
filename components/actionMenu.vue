<script setup lang="ts">
import Sortable from "sortablejs";
import { useActionMenuStore } from "~/stores/actionMenu";

const actionMenu = useActionMenuStore();
const viewport = useViewportStore();

onMounted(() => {
  const sortable = Sortable.create(document.getElementById("action-menu")!, {
    animation: 150,
    delay: 500,
    delayOnTouchOnly: true
  });
});

</script>

<template>
  <div id="action-menu"
    class="flex-grow-0 p-2 gap-2 overflow-auto"
    :class="{ 'hstack': viewport.isPortrait, 'vstack': viewport.isLandscape }"
  >
    <div v-for="item in actionMenu.items"
      :class="{ 'h-100': viewport.isPortrait, 'w-100': viewport.isLandscape }"
    >
      <button v-if="item.type == 'action'"
        class="btn btn-outline-secondary fs-4 p-1"
        @click="navigateTo(item.action.to)"
      >
        <i :class="`bi ${item.icon}`"></i>
      </button>
      <div v-if="item.type == 'divider'" class="w-100 h-100">
        <div v-if="viewport.isPortrait" class="vr mx-2 h-100"></div>
        <hr v-else-if="viewport.isLandscape" class="my-2 w-100">
      </div>
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