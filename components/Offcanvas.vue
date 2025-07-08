<script setup lang="ts">
import Sortable from "sortablejs";

const blocks = ref(["Teste 1", "Teste 2", "Teste 3"]);

onMounted(() => {
  const sortable = Sortable.create(document.getElementById("blocks")!, {
    direction: "vertical",
    animation: 150,
    delay: 500,
    delayOnTouchOnly: true
  });
});

</script>

<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasLabel">Blocos</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">

      <div id="blocks" class="vstack gap-1">
        <div class="hstack rounded-2" v-for="text in blocks">
          <button class="btn border-0 p-1 flex-grow-1 text-start">{{ text }}</button>
          <div class="dropdown">
            <button class="btn border-0 p-2" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></button>
            <ul class="dropdown-menu">
              <li><button class="dropdown-item">Renomear</button></li>
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item text-danger">Excluir</button></li>
            </ul>
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

.sortable-ghost {
  opacity: 0;
}

#blocks > div:hover {
  background-color: var(--bs-tertiary-bg);
}
</style>