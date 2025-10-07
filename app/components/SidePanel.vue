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

new BootstrapMenu('.tree-item', {
  fetchElementData: (el) => {
    // Retorna qualquer dado associado ao elemento
    return { id: el.id, text: el.textContent };
  },
  actionsGroups: [
    ['refresh'],
    ['delete']
  ],
  menuEvent: 'right-click',
  actions: {
    refresh: {
      name: 'Atualizar',
      iconClass: 'arrow-clockwise',
      onClick: (data) => alert('Atualizando: ' + data.text)
    },
    delete: {
      name: 'Excluir',
      iconClass: 'trash',
      isEnabled: () => false,
      onClick: (data) => alert('Excluindo: ' + data.text)
    }
  }
});

});

function hideOffcanvas() {
  const bsOffcanvas = bootstrap.Offcanvas.getInstance("#offcanvas");
  if (bsOffcanvas) bsOffcanvas.hide();
}

async function createFile() {
  await repositoryStore.repository?.pfs.writeFile("/Novo arquivo.txt", "# Novo bloco\n\nEscreva aqui...", "utf8");
  await repositoryStore.loadRepositories();
}

async function createFolder() {
  await repositoryStore.repository?.pfs.mkdir("/new-folder");
  await repositoryStore.loadRepositories();
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
    <div class="p-3 hstack gap-2">
      <button
        class="btn btn-outline-primary hstack gap-2 p-1 w-100 justify-content-center"
        @click="createFolder"
      >
        <i class="bi bi-folder"></i>Nova pasta
      </button>
      <button
        class="btn btn-outline-primary hstack gap-2 p-1 w-100 justify-content-center"
        @click="createFile"
      >
        <i class="bi bi-file-earmark-text"></i>Novo arquivo
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