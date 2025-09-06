<script setup lang="ts">

const blocksStore = useBlocksStore();
const breadcrumbItems = computed(() => {
  const breadcrumb: breadcrumbItem[] = [];
  const fullPath = useRouter().currentRoute.value.fullPath;

  if (fullPath != '/') {
    const splitedPath = fullPath.slice(1).split('/');
    breadcrumb.push({
      name: 'Home',
      path: '/'
    });
    for (let i = 0; i < splitedPath.length; i++) {
      const block = useBlocksStore().blocks.find(block => block.id == splitedPath[i]);

      breadcrumb.push({
        name: block ? block.content.title : splitedPath[i],
        path: i == splitedPath.length -1 ? '' : '/' + splitedPath.slice(0, i + 1).join('/')
      });
    }
    return breadcrumb;
  }
});

</script>

<template>
  <nav class="hstack align-items-stretch gap-2 bg-body-tertiary border-bottom">
    <div class="p-2">
      <button class="btn p-1 fs-4" data-bs-toggle="offcanvas" data-bs-target="#offcanvas"><i class="bi bi-list"></i></button>
    </div>
    <ol class="breadcrumb align-items-center flex-nowrap m-0 overflow-auto">
      <li v-for="item in breadcrumbItems" class="breadcrumb-item text-nowrap">
        <NuxtLink :to="item.path">{{ item.name }}</NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
i, i::before {
  display: block;
}
</style>