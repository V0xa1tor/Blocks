<script setup lang="ts">
import Sortable from "sortablejs";
import { useActionMenuStore } from "~/stores/actionMenu";

const actionMenu = useActionMenuStore();

</script>

<template>
  <div id="action-menu"
    class="vstack flex-grow-0 p-2 gap-3 overflow-auto bg-body-tertiary"
  >
    <div v-for="item in actionMenu.items" class="w-100">
      <button v-if="item.type == 'action'"
        class="btn fs-4 p-1"
        @click="navigateTo(item.action.to)"
      >
        <i :class="`bi ${item.icon}`"></i>
      </button>
      <hr v-if="item.type == 'divider'" class="my-0 w-100" style="color: var(--bs-border-color); opacity: 1;">
    </div>
  </div>
</template>

<style scoped>
i, i::before {
  display: block;
}
</style>