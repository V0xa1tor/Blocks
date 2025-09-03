<script setup lang="ts">
import Sortable from 'sortablejs';

const blocksStore = useBlocksStore();

onMounted(async () => {
  const sortable = Sortable.create(document.getElementById("home-blocks")!, {
    direction: "vertical",
    animation: 150,
    delay: 500,
    delayOnTouchOnly: true
  });
});

async function createNewPage() {
  const id = await blocksStore.addBlock(`Página nova (${blocksStore.blocks.length})`, '');
  navigateTo(`/block/${id}`);
}

</script>

<template>
  <div class="p-3 vstack gap-3">

    <div id="home-blocks" class="vstack flex-grow-0 gap-1">
      <div class="hstack rounded-2" v-for="block in blocksStore.blocks">
        <button
          class="btn border-0 p-1 flex-grow-1 text-start"
          @click="navigateTo(`/block/${block.id}`)"
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

    <div>
      <button
        class="btn btn-outline-primary hstack gap-2 p-1 w-100 justify-content-center"
        @click="createNewPage()"
      >
        <i class="bi bi-plus-lg"></i>Nova página
      </button>
    </div>

  </div>
</template>

<style scoped>
i, i::before {
  display: block;
}

.sortable-ghost {
  opacity: 0;
}

#home-blocks > div:hover {
  background-color: var(--bs-tertiary-bg);
}
</style>