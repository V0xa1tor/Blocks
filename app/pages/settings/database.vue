<script setup lang="ts">
import { Database } from '~/models/Database';
import { useDatabasesStore } from '~/stores/databases.store';
import download from 'downloadjs';
import * as bootstrap from "bootstrap";

const dbs = useDatabasesStore();
const newDatabaseName = ref('');
const isNewDatabaseNameValid = computed(() => newDatabaseName.value.trim().length > 0 && !dbs.databases?.some(db => db.name.trim() === newDatabaseName.value.trim()));
let newDatabaseModal: bootstrap.Modal;
const formWasValidated = ref(false);

onMounted(async () => {
  await import('dexie-export-import');

  dbs.loadDatabases();

  const newDatabaseModalEl = document.getElementById('newDatabaseModal')!;
  const newDatabaseNameInput = document.getElementById('newDatabaseName')!;
  
  newDatabaseModal = new bootstrap.Modal(newDatabaseModalEl);

  newDatabaseModalEl.addEventListener('shown.bs.modal', () => {
    newDatabaseNameInput.focus();
  });

  newDatabaseModalEl.addEventListener('hidden.bs.modal', () => {
    formWasValidated.value = false;
  });
});

async function createNewDatabase(name: string) {
  formWasValidated.value = true;

  if (!isNewDatabaseNameValid.value) return;

  await dbs.createDatabase(name);
  newDatabaseModal.hide();
  newDatabaseName.value = "";
  dbs.loadDatabases();

  formWasValidated.value = false;
}

async function exportDatabase(db: Database) {
  const blob = await dbs.exportDatabase(db);
  download(blob, `${db.name}.json`, "application/json");
}

async function importDatabase(files: FileList | null) {
  await dbs.importDatabase(files);
}

function deleteDatabase(db: Database) {
  db.delete().then(() => {
    dbs.loadDatabases();
  });
}

</script>

<template>
  <div class="container vstack gap-3">

    <h1 class="mb-3">Banco de dados</h1>

    <div class="vstack gap-3 mb-3">

      <!-- No database -->
      <div v-if="!dbs.databases?.length" class="card text-body-tertiary" style="border-style: dashed;">
        <div class="card-body text-center">
          <h2 class="m-0">Sem banco de dados</h2>
          <small>Crie ou importe um banco de dados</small>
        </div>
      </div>

      <!-- Databases list -->
      <div v-for="db in dbs.databases" :key="db.name">
        <label class="card" :for="db.name">
          <div class="card-body hstack">
  
            <input type="radio" class="form-check-input m-0 me-3" name="database" :id="db.name" autocomplete="off" checked>

            <div class="me-auto">
              <h2 class="m-0">{{ db.name }}</h2>
              <small class="text-secondary">Version {{ db.verno }}</small>
            </div>
            
            <div class="dropdown align-self-start">
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
        </label>
      </div>

      <div class="hstack gap-3 justify-content-end flex-wrap">
        <button class="btn btn-outline-primary hstack gap-2" data-bs-toggle="modal" data-bs-target="#newDatabaseModal"><i class="bi bi-plus-lg"></i>Novo banco</button>
        <label class="btn btn-outline-primary hstack gap-2" for="import"><i class="bi bi-download"></i>Importar banco</label>
        <input class="d-none" @change="(e) => importDatabase((e.target as HTMLInputElement).files)" type="file" multiple id="import">
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
              <form id="newDatabaseModalForm" @submit.prevent="createNewDatabase(newDatabaseName)">
                <div class="form-floating">
                  <input :class="{'is-valid': formWasValidated && isNewDatabaseNameValid, 'is-invalid': formWasValidated && !isNewDatabaseNameValid}" v-model="newDatabaseName" type="text" class="form-control" id="newDatabaseName" placeholder="Novo banco de dados">
                  <label for="newDatabaseName">Nome do banco</label>
                  <div class="invalid-feedback">
                    {{ dbs.databases?.some(db => db.name.trim() === newDatabaseName.trim()) ? 'Já existe um banco com esse nome' : 'O nome não pode ser vazio' }}
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <small class="text-secondary text-end">Versão {{ useAppConfig().version }}</small>
            <div class="flex-grow-1 text-end">
              <button type="button" class="btn" data-bs-dismiss="modal">Cancelar</button>
              <input type="submit" form="newDatabaseModalForm" class="btn btn-primary" value="Criar banco" />
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

label.card, label.card input {
  cursor: pointer;
  .dropdown {
    cursor: auto;
  }
}

label.card:has(input:checked) {
  border-color: var(--bs-primary);
  background-color: rgba(var(--bs-primary-rgb), .05);
  box-shadow: 0 0 0 2px rgba(var(--bs-primary-rgb), 1);
}
</style>