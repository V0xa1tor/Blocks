<script setup lang="ts">
import * as bootstrap from "bootstrap";

const blocksStore = useBlocksStore();

// Dados fictícios de tree de pastas e arquivos
interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];
  collapsed?: boolean;
}

const treeData = ref<FileNode[]>([
  {
    id: "folder1",
    name: "Documentos",
    type: "folder",
    collapsed: false,
    children: [
      { id: "file1", name: "Resumo.txt", type: "file" },
      { id: "file2", name: "Notas.md", type: "file" },
      {
        id: "folder2",
        name: "Projetos",
        type: "folder",
        collapsed: true,
        children: [
          { id: "file3", name: "Projeto1.docx", type: "file" },
          {
            id: "folder4",
            name: "Subprojetos",
            type: "folder",
            collapsed: true,
            children: [
              { id: "file4", name: "SubprojetoA.txt", type: "file" },
              {
                id: "folder6",
                name: "Arquivos Finais",
                type: "folder",
                collapsed: true,
                children: [
                  { id: "file5", name: "Final1.pdf", type: "file" },
                  { id: "file6", name: "Final2.pdf", type: "file" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "folder3",
    name: "Imagens",
    type: "folder",
    collapsed: true,
    children: [
      { id: "file7", name: "foto1.png", type: "file" },
      { id: "file8", name: "foto2.jpg", type: "file" },
      {
        id: "folder5",
        name: "Mais Imagens",
        type: "folder",
        collapsed: true,
        children: [
          { id: "file9", name: "extra1.png", type: "file" },
          {
            id: "folder7",
            name: "Arquivos RAW",
            type: "folder",
            collapsed: true,
            children: [
              { id: "file10", name: "raw1.cr2", type: "file" },
              { id: "file11", name: "raw2.cr2", type: "file" }
            ]
          }
        ]
      }
    ]
  },
  { id: "file12", name: "README.md", type: "file" }
]);

function hideOffcanvas() {
  const bsOffcanvas = bootstrap.Offcanvas.getInstance("#offcanvas");
  if (bsOffcanvas) bsOffcanvas.hide();
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
        @click="hideOffcanvas"
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