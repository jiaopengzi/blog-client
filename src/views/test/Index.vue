<template>
  <div ref="editor" class="editor" id="editor"></div>
  <div class="output" v-html="output"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { EditorView, EditorState, customSetup } from '@/pkg/codemirror/setup'
import type { ViewUpdate } from '@codemirror/view'
import marked from '@/pkg/marked/new-marked' // 引入重新封装的 marked

const editor = ref<HTMLElement | null>(null)
const output = ref('')

onMounted(() => {
  editor.value = document.getElementById('editor')
  const state = EditorState.create({
    doc: '# hello \n==world==\n\n==阿斯蒂芬==',
    extensions: [customSetup, EditorView.updateListener.of(updateDocInfo)],
  })

  const view = new EditorView({
    state,
    parent: editor.value!,
  })
})

function updateDocInfo(viewUpdate: ViewUpdate): void {
  if (viewUpdate.selectionSet) {
    // 如果光标位置发生变化
    const { state } = viewUpdate.view // 获取当前编辑器状态
    output.value = marked.parse(state.doc.toString()).toString() // 获取当前编辑器内容
  }
}
</script>

<style scoped>
.editor {
  height: 500px;
  width: 300px;
  border: 1px solid #000;
  background-color: aquamarine;
}
</style>
