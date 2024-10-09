<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-12 13:02:01
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-11 11:40:33
 * @FilePath     : \blog-client\src\components\editor\toolbar\index.vue
 * @Description  : 工具栏组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div ref="toolbarRef" id="toolbar">
    <button
      v-for="(btn, index) in props.toobarBtns"
      :key="index"
      class="toolbar-btn"
      @click="emitToolbarBtnClicked(btn.name)"
    >
      <el-popover
        v-if="btn.name === CommandsKey.Emoji"
        placement="bottom"
        width="310"
        trigger="hover"
        popper-class="popper-class"
        popper-style="background-color: transparent; border: none; box-shadow: none;"
        :show-arrow="false"
        :offset="0"
      >
        <template #reference>
          <Icon :name="btn.icon" customClass="iconfont" />
        </template>

        <EmojiPicker :native="true" @select="onSelectEmoji" />
      </el-popover>

      <el-tooltip v-else effect="dark" :content="btn.display" :hide-after="0">
        <Icon :name="btn.icon" customClass="iconfont" />
      </el-tooltip>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, useTemplateRef } from 'vue'
import { CommandsKey } from '@/components/editor/command'
import type { ToolbarProps } from '@/components/editor/toolbar'

import EmojiPicker from 'vue3-emoji-picker' // import picker compopnent

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: 'Toolbar' })

// 定义 props
const props = defineProps<ToolbarProps>()

// 设置 iconNumberPerLine 默认值为 20
// const iconNumberPerLine = ref<number>(props.iconNumberPerLine || 20);

// 子组件 传参
const emit = defineEmits<{
  (e: 'toolbar-btn-clicked', name: CommandsKey): void
  (e: 'emoji-picker-selected', emoji: any): void
}>()

const toolbarRef = useTemplateRef<HTMLElement | null>('toolbarRef') // 工具栏
const toolbarHeight = ref(0) // 工具栏高度

function emitToolbarBtnClicked(name: CommandsKey) {
  // 触发自定义事件 "onToolbarBtnClicked"，将 name 传递给父组件
  emit('toolbar-btn-clicked', name)
}

// 监听工具栏高度变化
watch(
  toolbarRef,
  () => {
    updateToolbarHeight()
  },
  { deep: true }
)

/**
 * @description: 更新工具栏高度
 */
function updateToolbarHeight() {
  if (toolbarRef.value) {
    toolbarHeight.value = toolbarRef.value.clientHeight
    document.documentElement.style.setProperty('--toolbar-height', `${toolbarHeight.value}px`)
  }
}

// const toolbarClass = computed(() => getClassName('toolbar', 'toolbar-fs', false));
// const toolbarBtnClass = computed(() => getClassName('toolbar-btn', 'toolbar-btn-fs', false));

// const setToolbarIconNumberPerLine = () => {
//     // 初始化编辑器宽度和高度
//     if (toolbarRef.value) {
//         toolbarRef.value.style.setProperty('--icon-number-per-line', `${iconNumberPerLine.value}`);
//     }
// }

// emoji 选择
function onSelectEmoji(emoji: any) {
  emit('emoji-picker-selected', emoji)
  // console.log(emoji)
}

onMounted(async () => {
  // 初始化 CodeMirror
  // setToolbarIconNumberPerLine() // 初始化工具栏每行显示的按钮个数
  updateToolbarHeight() // 初始化工具栏高度
})

defineExpose({
  root: toolbarRef
})
</script>

<style scoped lang="scss">
#toolbar {
  display: flex;
  flex-wrap: wrap; // 自动换行
  align-items: center;
  // justify-content: left;
  border-bottom: 1px solid #ccc;
  min-height: pc.$editor-toolbar-height;
  margin-top: pc.$editor-toolbar-margin-top;
  margin-bottom: pc.$editor-toolbar-margin-top;

  .toolbar-btn {
    border: none;
    background-color: transparent;
    cursor: pointer;
    outline: none;
    height: pc.$editor-toolbar-height;
    // 通过计算每个按钮的 margin-left 和 margin-right 来实现每行显示的按钮个数
    margin: 0 calc((100% - 24px * var(--icon-number-per-line)) / var(--icon-number-per-line) / 2);
    padding: 0;
  }
}

.iconfont {
  font-size: 20px;
  fill: #333;
  transition: fill 0.3s ease;
  /* 添加平滑过渡效果 */
}

.iconfont:hover {
  fill: #666;
  /* 悬停时的颜色变化 */
}

.popper-class {
  background: transparent;
  border: none;
  // 无阴影
  box-shadow: none;
}
</style>
