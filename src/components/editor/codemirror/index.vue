<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 09:20:29
 * @FilePath     : \blog-client\src\components\editor\codemirror\index.vue
 * @Description  : codemirror 编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div ref="codemirrorRef" id="my-codemirror"></div>
</template>

<script lang="ts" setup>
import { onMounted, watchEffect, onUnmounted, useTemplateRef } from 'vue'
import type { Extension } from '@codemirror/state'
import type { ViewUpdate } from '@codemirror/view'
import { EditorView, EditorState, createCustomSetup } from '@/pkg/codemirror/setup'
import {
  CommandsKey,
  MarkdownEditorCommands,
  editorInsertFormatContent
} from '@/components/editor/command'
import type { MarkdownEditorCommandItemType } from '@/components/editor/command'
import type { CodeEditorProps } from '@/components/editor/codemirror'

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: 'Codemirror' })

const props = defineProps<CodeEditorProps>() // 定义 props
const codemirrorRef = useTemplateRef<HTMLElement | null>('codemirrorRef') // 编辑器 dom 节点

// 定义 emits 子组件 传参
const emit = defineEmits<{
  (event: 'update-editor-doc', editorDoc: string): void
  (
    event: 'handle-scroll',
    scrollHeight: number,
    clientHeight: number,
    scrollTop: number,
    hideDoc: string
  ): void
}>()

const initializeCssVariable = () => {
  // 初始化编辑器宽度和高度
  if (codemirrorRef.value && props.width) {
    codemirrorRef.value.style.setProperty('--my-codemirror-width', `${props.width}`)
  }
  if (codemirrorRef.value && props.height) {
    codemirrorRef.value.style.setProperty('--my-codemirror-height', `${props.height}`)
  }
}

// 监听 props 宽高 变化
watchEffect(() => {
  if (codemirrorRef.value && (props.height || props.width)) {
    initializeCssVariable() // 初始化 css 变量
  }
})

// 编辑器实例
let cmView: EditorView = null! // 编辑器实例 null后的感叹号表示不为空

// 初始化 CodeMirror
const initializeCodeMirror = () => {
  // 初始化编辑器
  const state = EditorState.create({
    doc: props.codemirrorDoc || '',
    extensions: [createCustomSetup(), updateDocInfo]
  })

  // 创建编辑器实例
  cmView = new EditorView({
    state,
    parent: codemirrorRef.value!
  })

  cmView.scrollDOM.addEventListener('scroll', handleScroll) // 监听滚动事件
}

// 更新编辑器内容
const updateDocInfo: Extension = EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
  if (viewUpdate.docChanged) {
    const { state } = viewUpdate.view
    const newDoc = state.doc.toString()
    if (newDoc !== props.codemirrorDoc) {
      // console.log('newDoc-子组件', newDoc)
      emit('update-editor-doc', newDoc) // 更新编辑器内容 提交给父组件
    }
  }
})

// 执行按钮命令
const runCommand = (
  commandName: CommandsKey,
  customContent: MarkdownEditorCommandItemType = {}
): void => {
  if (commandName) {
    if (customContent) {
      // 合并自定义内容
      editorInsertFormatContent(cmView, {
        ...MarkdownEditorCommands[commandName],
        ...customContent
      })
      return
    }
    // 执行命令
    editorInsertFormatContent(cmView, MarkdownEditorCommands[commandName])
  }
}

// 滚动到指定行
const scrollIntoViewLine = (lineNumber: number): void => {
  const line = cmView.state.doc.line(lineNumber) // 获取当前元素在编辑器中的行数

  // 滑动到指定行有一些问题 内容较多的时候不太精确
  // const { top } = cmView.lineBlockAt(line.from); // 获取当前元素在编辑器中的位置
  // cmView.scrollDOM.scrollTo({ top, behavior: 'smooth' }) // 滚动到当前行

  // 精准跳转选中目标行 但不能是平滑滚动
  cmView.dispatch({
    selection: {
      anchor: line.from,
      head: line.from
    },
    effects: EditorView.scrollIntoView(
      // 滚动到当前行
      line.from,
      {
        y: 'start', // 滚动到顶部
        yMargin: 0 // 不留边距
      }
    )
  })
}

/**
 * @description: 处理编辑器滚动事件
 */
const handleScroll = () => {
  const hideTopBlockInfo = cmView.lineBlockAtHeight(cmView.scrollDOM.scrollTop) // 获取不可见部分的 block 信息
  const hideTopMarkdown = cmView.state.sliceDoc(0, hideTopBlockInfo.from) // 不可见部分的 markdown
  emit(
    'handle-scroll',
    cmView.scrollDOM.scrollHeight,
    cmView.scrollDOM.clientHeight,
    cmView.scrollDOM.scrollTop,
    hideTopMarkdown
  ) // 提交给父组件
}

// 监听 props.codemirrorDoc 变化 更新编辑器内容 只有第一次加载的时候才更新
const watchStop = watchEffect(() => {
  if (props.codemirrorDoc && cmView) {
    cmView.dispatch({
      changes: {
        from: 0,
        to: cmView.state.doc.length,
        insert: props.codemirrorDoc
      }
    })
    watchStop() // 只执行一次
  }
})

// 初始化
onMounted(() => {
  initializeCssVariable() // 初始化 css 变量
  initializeCodeMirror() // 初始化 CodeMirror
})

onUnmounted(() => {
  cmView.scrollDOM.removeEventListener('scroll', handleScroll) // 移除监听滚动事件
  cmView.destroy() // 销毁编辑器实例
})

// 导出函数
defineExpose({
  root: codemirrorRef,
  runCommand,
  scrollIntoViewLine
})
</script>

<style scoped lang="scss">
#my-codemirror {
  :deep(.cm-editor) {
    // width: 100%;
    height: var(--my-codemirror-height, 100%);
  }

  // :deep(.cm-content) {
  //     width: 100%;
  //     height: calc(var(--my-codemirror-height, 100%) - pc.$editor-panels-bottom-height - pc.$editor-panels-bottom-border);
  // }

  :deep(.cm-panels-bottom) {
    height: pc.$editor-panels-bottom-height;
    // 文字垂直居中
    display: flex;
    align-items: center;
    padding: 4px 4px;
    font-size: 0.8em;
    color: #6c6c6c;
  }
}
</style>
