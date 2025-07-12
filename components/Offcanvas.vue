<script setup lang="ts">
import { useObservable } from "@vueuse/rxjs";
import { liveQuery } from "dexie";
import { from, Observable } from "rxjs";
import Sortable from "sortablejs";
import { v4 as uuidV4 } from "uuid";
import type Database from "~/utils/database";

const dbs = useDatabaseStore();
const blocks = useObservable(
  from(liveQuery(async () => await dbs.openedDb?.blocks?.toArray())), {
    initialValue: []
  }
);

onMounted(async () => {
  const sortable = Sortable.create(document.getElementById("blocks")!, {
    direction: "vertical",
    animation: 150,
    delay: 500,
    delayOnTouchOnly: true
  });

  await dbs.loadDatabases();
});

async function addBlock() {
  await dbs.openedDb.blocks.add({name: uuidV4(), content: 'Hello...'});
  await dbs.loadDatabases();
}

async function deleteBlock(id: number) {
  await dbs.openedDb.blocks.delete(id);
  await dbs.loadDatabases();
}

</script>

<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasLabel">Blocos</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body vstack gap-3">

      <div id="blocks" class="vstack gap-1">
        <div class="hstack rounded-2" v-for="block in blocks">
          <button class="btn border-0 p-1 flex-grow-1 text-start">{{ block.name }}</button>
          <div class="dropdown">
            <button class="btn border-0 p-2" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></button>
            <ul class="dropdown-menu">
              <li><button class="dropdown-item">Renomear</button></li>
              <li><hr class="dropdown-divider"></li>
              <li><button @click="deleteBlock(block.id!)" class="dropdown-item text-danger">Excluir</button></li>
            </ul>
          </div>
        </div>
      </div>

    </div>

    <div class="p-3">
      <button
        class="btn btn-outline-primary hstack gap-2 p-1 w-100 justify-content-center"
        @click="addBlock()"
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
  opacity: 0;
}

#blocks > div:hover {
  background-color: var(--bs-tertiary-bg);
}

.offcanvas-backdrop.show {
  opacity: 1;
}
</style>