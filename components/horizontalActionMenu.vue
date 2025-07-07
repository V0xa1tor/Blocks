<script setup lang="ts">
import Sortable from "sortablejs";
import { useActionMenuStore } from "~/stores/actionMenu";

const actionMenu = useActionMenuStore();

onMounted(() => {
  const sortable = Sortable.create(document.getElementById("action-menu")!, {
    direction: "horizontal",
    animation: 150,
    delay: 500,
    delayOnTouchOnly: true
  });
});

</script>

<template>
  <div class="overflow-auto">
    <div id="action-menu"
      class="hstack flex-grow-0 p-3 gap-3 mx-auto"
      style="width: fit-content;"
    >
      <div v-for="item in actionMenu.items">
        <button v-if="item.type == 'action'"
          class="btn fs-4 p-1"
          @click="navigateTo(item.action.to)"
        >
          <i :class="`bi ${item.icon}`" style="font-size: 2.5rem;"></i>
        </button>
        <div v-if="item.type == 'divider'" class="vr mx-2 d-block" style="color: var(--bs-border-color); opacity: 1;"></div>
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