<script setup lang="ts">
import * as bootstrap from "bootstrap";
import Sortable from "sortablejs";

const blocksStore = useBlocksStore();

onMounted(async () => {
  const sortable = Sortable.create(document.getElementById("offcanvas-blocks")!, {
    direction: "vertical",
    animation: 150,
    easing: "ease-out",
    delay: 450,
    delayOnTouchOnly: true,
    forceFallback: true
  });
});

async function hideOffcanvas() {
  const bsOffcanvas = bootstrap.Offcanvas.getInstance("#offcanvas")!;
  bsOffcanvas.hide();
}

</script>

<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasLabel">Blocos</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body vstack gap-3">

      <div id="offcanvas-blocks" class="vstack gap-1">
        <div class="hstack rounded-2" v-for="block in blocksStore.blocks">
          <button
            class="btn border-0 p-1 flex-grow-1 text-start overflow-hidden text-truncate"
            @click="() => { hideOffcanvas(); navigateTo(`${block.id}`); }"
          >
            {{ block.content.title }}
          </button>
          <div class="dropdown">
            <button class="btn border-0 p-2" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></button>
            <ul class="dropdown-menu">
              <li><button class="dropdown-item" disabled>Renomear</button></li>
              <li><hr class="dropdown-divider"></li>
              <li><button @click="blocksStore.deleteBlock(block.id!)" class="dropdown-item text-danger">Excluir</button></li>
            </ul>
          </div>
        </div>
      </div>

    </div>

    <div class="p-3">
      <button
        class="btn btn-outline-primary hstack gap-2 p-1 w-100 justify-content-center"
        @click="blocksStore.addBlock(`Página nova (${blocksStore.blocks.length})`, '')"
      >
        <i class="bi bi-plus-lg"></i>Novo bloco
      </button>
    </div>

  </div>
</template>

<style scoped>
i, i::before {
  display: block;
}

.sortable-ghost {
  background-color: var(--bs-tertiary-bg);
}

.sortable-drag {
  opacity: 0 !important;
}

#offcanvas-blocks:not(:has(.sortable-ghost)) > div:hover {
  background-color: var(--bs-tertiary-bg);
}

#offcanvas-blocks:has(.sortable-ghost), #offcanvas-blocks:has(.sortable-ghost) * {
  cursor: grabbing;
}
</style>