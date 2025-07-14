<script setup lang="ts">
const ids = useRoute().params.id;
const blockId = ids[ids.length - 1];
const blocksStore = useBlocksStore();
const block = ref(blocksStore.blocks.find((b) => b.id == blockId));

watch(block, async (newBlock) => {
  if (newBlock !== undefined) await blocksStore.updateBlock(toRaw(newBlock));
  console.log("mudou");
}, { deep: true });

onMounted(() => {
  const pageTitle = document.getElementById("page-title") as HTMLInputElement;
  const pageText = document.getElementById("page-text") as HTMLInputElement;
  pageTitle!.value = block.value?.content.title ?? '';
  pageText!.value = block.value?.content.text ?? '';
  pageText.focus();
});
</script>

<template>
  <div class="p-3 vstack">

    <!-- <nav>
      <ol class="breadcrumb">
        <li v-for="id in $route.params.id" class="breadcrumb-item">
          <a href="#">{{ id }}</a>
        </li>
      </ol>
    </nav> -->

    <input placeholder="Título..." type="text" class="form-control shadow-none p-0 border-0 rounded-0 fs-1 mb-3" @input="(e) => block!.content.title = (e.target as HTMLInputElement).value" id="page-title" />
    <textarea placeholder="Escreva aqui..." class="form-control shadow-none flex-grow-1 p-0 border-0 rounded-0 pb-5" style="resize: none;" @input="(e) => block!.content.text = (e.target as HTMLInputElement).value" id="page-text"></textarea>

  </div>
</template>