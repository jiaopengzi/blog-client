<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <Codemirror v-if="editor" :codemirrorDoc="editor" :width="width" :height="height" @handle-scroll="handleScroll"
    @update-editor-doc="updateEditorDoc" />
</template>

<script lang="ts" setup>
import Codemirror from '@/components/common/editor/Codemirror.vue'
import { onMounted, ref } from 'vue';
import axios from 'axios'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'


// 获取用户信息
const editorStore = useEditorStore()


let { editor } = storeToRefs(editorStore)
const width = ref(500)
const height = ref(500)

// const codemirrorDoc = ref(editor.value);

// watch(editor, () => {
//   codemirrorDoc.value = editor.value;
// });

const handleScroll = (scrollTop: number, hideDoc: string) => {
  // console.log('handleScroll-父组件', scrollTop, hideDoc)
  console.log('handleScroll-父组件')
}

const updateEditorDoc = (editorDoc: string) => {
  // console.log('uadateEditorDoc-父组件', editorDoc)
  console.log('uadateEditorDoc-父组件')
}

const initializeEditorState = async () => {
  const res = await axios.get('src/assets/example/markdown.md').then(res => {
    editorStore.updateEditorStore(res.data) // 更新 store 中的 editor
  })
}

onMounted(async () => {
  await initializeEditorState()
})



</script>

<style scoped lang="scss"></style>
