<script setup>
import { ref, onMounted } from 'vue';
// import '@toast-ui/editor/dist/toastui-editor.css';
import Editor from '@toast-ui/editor';

const repositoryStore = useRepositoryStore();
const editorRef = ref(null);
const props = defineProps(['file']);

onMounted(async () => {
  await nextTick();
  window.tuiEditor = await Editor.factory({
    el: editorRef.value,
    initialEditType: 'markdown',
    initialValue: props.file.content,
    toolbarItems: [], // Remove toolbar
    hideModeSwitch: true, // Remove modo de troca
    height: '100%',
    hooks: {
      change: async () => {
        await repositoryStore.repository.pfs.writeFile(props.file.path, window.tuiEditor.getMarkdown(), 'utf8');
      }
    }
  });
  const proseMirror = editorRef.value.querySelector('.ProseMirror');
  const toastuiEditor = editorRef.value.querySelector('.toastui-editor');
  toastuiEditor.classList.add('h-100', 'd-flex', 'flex-column');
  proseMirror.classList.add('p-3', 'pb-5', 'border-0', 'rounded-0', 'flex-grow-1', 'shadow-none', 'form-control');
});

</script>

<template>
      <!-- <textarea placeholder="Escreva aqui..." class="form-control nowra shadow-none flex-grow-1 p-3 border-0 rounded-0 pb-5" style="resize: none; field-sizing: content; min-height: fit-content;" @input="(e) => block!.content.text = (e.target as HTMLInputElement).value" id="page-text"></textarea> -->
  <div ref="editorRef" class="editor"></div>
</template>

<style>
.toastui-editor-toolbar,
.toastui-editor-pseudo-clipboard,
.toastui-editor-md-splitter,
.toastui-editor-md-preview,
.toastui-editor-ww-container {
  display: none;
}

.editor [class^="toastui"] {
  height: 100%;
}
</style>