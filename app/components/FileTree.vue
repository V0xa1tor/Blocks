<script setup lang="ts">
import Sortable, { MultiDrag } from 'sortablejs';

// Busca recursiva do node pela name e type
function findNodeByName(nodes: FileNode[], name: string): FileNode | undefined {
  for (const node of nodes) {
    if (node.name === name && node.type === 'folder') return node;
    if (node.children) {
      const found = findNodeByName(node.children, name);
      if (found) return found;
    }
  }
  return undefined;
}
// Flag para ignorar clique após drag
let ignoreClick = false;

interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];
  collapsed?: boolean;
}

const props = defineProps<{ nodes: FileNode[] }>();
const emit = defineEmits(['toggle-folder']);

function toggleFolder(node: FileNode) {
  // Garante reatividade usando Vue.set se necessário
  node.collapsed = !node.collapsed;
  // Não emite para cima, pois o estado é local e recursivo
  // Espera renderização e aplica sortable na pasta expandida correta
  if (node.type === 'folder' && !node.collapsed && node.children) {
    nextTick(() => setupSortable('tree-' + node.id));
  }
}

function setupSortable(id: string) {
  setTimeout(() => {
    // Aplica SortableJS em todos os ul.list-unstyled
    const allUls = document.querySelectorAll('ul.list-unstyled');
    allUls.forEach((el) => {
      if (!el.classList.contains('sortable-initialized')) {
        Sortable.create(el as HTMLElement, {
          group: 'tree',
          animation: 150,
          fallbackOnBody: true,
          delay: 450,
          easing: "ease-out",
          invertSwap: true,
          delayOnTouchOnly: true,
          forceFallback: true,
          onStart(evt) {
            ignoreClick = true;
            // Fecha pasta ao iniciar drag
            const item = evt.item;
            // Encontra o node correspondente
            const nodeName = item.querySelector('.fw-bold')?.textContent;
            if (nodeName) {
              const node = findNodeByName(props.nodes, nodeName!);
              if (node && node.collapsed === false) node.collapsed = true;
            }
          },
          onEnd() {
            setTimeout(() => { ignoreClick = false; }, 100);
          }
        });
        el.classList.add('sortable-initialized');
      }
    });
  }, 0);
}
function applySortables() {
  // Não precisa mais de id, aplica SortableJS em todos os ul
  // Aplica sortable em todos os filhos
  nextTick(() => {
    const allUls = document.querySelectorAll('ul[id^="tree-"]');
    allUls.forEach((ul: Element) => {
      setupSortable(ul.id);
    });
  });
}

onMounted(() => {
  applySortables();
});

onUpdated(() => {
  applySortables();
});
</script>

<template>
  <ul class="list-unstyled gap-1 d-flex flex-column user-select-none">
    <template v-for="node in nodes" :key="node.id">
      <li class="rounded gap-1 d-flex flex-column">
        <div
          class="file hstack gap-2 align-items-center rounded-2 py-1 px-2"
          @click="node.type === 'folder' && !ignoreClick ? toggleFolder(node) : null"
        >
          <template v-if="node.type === 'folder'">
            <i class="text-body-tertiary" :class="node.collapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-down'" style="font-size:1.2em"></i>
            <span class="flex-grow-1 text-truncate">{{ node.name }}</span>
          </template>
          <template v-else>
            <i class="bi bi-file-earmark-text" style="font-size:1.2em"></i>
            <span class="flex-grow-1 text-truncate">{{ node.name }}</span>
          </template>
        </div>
        <ul v-if="node.type === 'folder' && !node.collapsed && node.children" class="list-unstyled ms-3">
          <FileTree :nodes="node.children" @toggle-folder="toggleFolder" />
        </ul>
      </li>
    </template>
  </ul>
</template>

<style scoped>
/* Aplica hover apenas ao conteúdo do item, não ao li inteiro */
.file {
  cursor: pointer;
}
.file:hover {
  background-color: var(--bs-tertiary-bg) !important;
}

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
