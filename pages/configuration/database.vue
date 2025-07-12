<script setup lang="ts">
import Database from '~/utils/database';
import { useDatabaseStore } from '~/stores/databaseStore';
import download from 'downloadjs';
import type { Modal } from 'bootstrap';

const dbs = useDatabaseStore();
const newDatabaseName = ref('');
let newDatabaseModal: Modal;

onMounted(async () => {
  await import('dexie-export-import');
  const bootstrap = await import("bootstrap");

  dbs.loadDatabases();

  const newDatabaseModalEl = document.getElementById('newDatabaseModal')!;
  const newDatabaseNameInput = document.getElementById('newDatabaseName')!;
  
  newDatabaseModal = new bootstrap.Modal(newDatabaseModalEl);

  newDatabaseModalEl.addEventListener('shown.bs.modal', () => {
    newDatabaseNameInput.focus();
  });
});

async function createNewDatabase(name: string) {
  await dbs.createDatabase(name);
  newDatabaseModal.hide();
  newDatabaseName.value = "";
  dbs.loadDatabases();
}

async function exportDatabase(db: Database) {
  try {
    await db.open();
    const blob = await db.export({ prettyJson: true, noTransaction: true});
    db.close();
    download(blob, `${db.name}.json`, "application/json");
  } catch (error) {
    console.error('Error: ' + error);
  }
}

async function importDatabase(files: FileList | null) {
  if (files !== null) {
    const dexieExportImport = await import("dexie-export-import");
    [...files].forEach((file) => {
      dexieExportImport.importDB(file).then((db) => {
        db.close();
        dbs.loadDatabases();
      });
    });
  }
}

function deleteDatabase(db: Database) {
  db.delete().then(() => {
    dbs.loadDatabases();
  });
}

</script>

<template>
  <div class="container my-3">

    <h1 class="mb-3">Bancos de dados</h1>

    <div class="card border-primary" v-for="db in dbs.databases">
      <div class="card-body">

        <div class="d-flex justify-content-between">
          <h2>{{ db.name }}</h2>
          <div class="dropdown">
            <button class="btn p-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-three-dots"></i>
            </button>
            <ul class="dropdown-menu">
              <li><button class="dropdown-item" disabled>Renomear</button></li>
              <li><button class="dropdown-item" @click="exportDatabase(db)">Exportar</button></li>
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item text-danger" @click="deleteDatabase(db)">Excluir</button></li>
            </ul>
          </div>
        </div>
        
        <small class="text-secondary">Version {{ db.verno }}</small>
        
      </div>
    </div>

    <div class="hstack gap-3 justify-content-end flex-wrap mb-3">
      <button class="btn btn-outline-primary hstack gap-2" data-bs-toggle="modal" data-bs-target="#newDatabaseModal"><i class="bi bi-plus-lg"></i>Novo banco</button>
      <label class="btn btn-outline-primary hstack gap-2" for="import"><i class="bi bi-download"></i>Importar banco</label>
      <input class="d-none" @change="(e) => importDatabase((e.target as HTMLInputElement).files)" type="file" multiple id="import">
    </div>

    <div class="vstack gap-3 mb-3">
      <Loading v-if="!dbs.databases.length" />
      <div class="card" v-for="db in dbs.databases">
        <div class="card-body">

          <div class="d-flex justify-content-between">
            <h2>{{ db.name }}</h2>
            <div class="dropdown">
              <button class="btn p-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots"></i>
              </button>
              <ul class="dropdown-menu">
                <li><button class="dropdown-item" disabled>Renomear</button></li>
                <li><button class="dropdown-item" @click="exportDatabase(db)">Exportar</button></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger" @click="deleteDatabase(db)">Excluir</button></li>
              </ul>
            </div>
          </div>
          
          <small class="text-secondary">Version {{ db.verno }}</small>
          
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="newDatabaseModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Criar novo banco de dados</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="vstack gap-3">
              <form @submit.prevent="createNewDatabase(newDatabaseName)">
                <div class="form-floating">
                  <input v-model="newDatabaseName" type="text" class="form-control" id="newDatabaseName" placeholder="Novo banco de dados">
                  <label for="newDatabaseName">Nome do banco</label>
                </div>
              </form>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <small class="text-secondary text-end">Versão {{ dbs.version }}</small>
            <div class="flex-grow-1 text-end">
              <button type="button" class="btn" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="createNewDatabase(newDatabaseName)">Criar banco</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
i, i::before {
  display: block;
}
</style>