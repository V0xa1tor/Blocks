<script setup lang="ts">
import * as bootstrap from "bootstrap";

const blocksStore = useBlocksStore();
const repositoryStore = useRepositoryStore();

const treeData = ref<FSItem[]>([]);

onMounted(async () => {
  await repositoryStore.loadRepositories();
  await repositoryStore.listAllFilesAndDirs().then(files => {
    treeData.value = files;
  });
});

function hideOffcanvas() {
  const bsOffcanvas = bootstrap.Offcanvas.getInstance("#offcanvas");
  if (bsOffcanvas) bsOffcanvas.hide();
}

async function createNewBlock() {
  await repositoryStore.repository?.pfs.writeFile("/new-block.md", "# Novo bloco\n\nEscreva aqui...", "utf8");
}

</script>

<template>
  <div data-bs-backdrop="false" class="offcanvas offcanvas-start show" tabindex="-1" id="offcanvas">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasLabel">Blocos</h5>
      <!-- <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button> -->
    </div>
    <div class="offcanvas-body vstack gap-3">
      <div id="offcanvas-blocks" class="vstack gap-1">
        <FileTree :nodes="treeData" :id="'tree-root'" />
      </div>
    </div>
    <div class="p-3">
      <button
        class="btn btn-outline-primary hstack gap-2 p-1 w-100 justify-content-center"
        @click="createNewBlock"
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

.offcanvas {
  --bs-offcanvas-width: 300px;
  --bs-offcanvas-transition: margin 0.3s ease-in-out;
}

#offcanvas {
  position: relative;
  left: inherit;
  height: 100%;
  margin-left: calc(var(--bs-offcanvas-width) * -1);
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