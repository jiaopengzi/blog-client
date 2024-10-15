<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-24 15:51:08
 * @FilePath     : \blog-client\src\components\editor\core\EditorPost.vue
 * @Description  : 文章编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div :class="layoutClass">
    <!-- 工具栏 -->
    <div :class="toolbarClass">
      <Toolbar
        ref="toolbarRef"
        :toolbar-btns="toolbarBtns()"
        :icon-number-per-line="iconNumberPerLine()"
        @toolbar-btn-clicked="toolbarBtnClicked"
        @emoji-picker-selected="onSelectEmoji"
      />
    </div>

    <!-- 编辑器容器 -->
    <div ref="mdContainerRef" :class="mdContainerClass">
      <!-- 导航栏 -->
      <div :class="tocClass" v-show="tocShow">
        <Toc :headings="tocHtml" @heading-clicked="tocHeadingClicked" />
      </div>

      <!-- 编辑器 -->
      <div :class="editorClass" v-show="editorShow">
        <Codemirror
          ref="codemirrorRef"
          :codemirrorDoc="editor"
          :height="cmHeight"
          @handle-scroll="handleScroll"
          @update-editor-doc="updateEditorDoc"
        />
      </div>

      <!-- 预览 -->
      <div :class="previewClass" v-show="previewShow">
        <Preview
          ref="previewRef"
          :preview="previewData"
          :is-show-preview-wechat="isShowPreviewWechat"
          :height="cmHeight"
          @show-image-viewer="showImageViewer"
          @close-image-viewer="closeImageViewer"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef, reactive, computed, onMounted } from 'vue'
import { useToolbar, useToc, useCodemirror, usePreview } from '@/components/editor/core/hooks'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import type { ToolbarRef, CodemirrorRef, PreviewRef } from '@/components/editor/core'
import { setIsFullScreenClassName } from '@/components/editor/core'
import { CommandsKey } from '@/components/editor/command'
import 'vue3-emoji-picker/css' // import css

import Toolbar from '@/components/editor/toolbar'
import Toc from '@/components/editor/toc'
import Codemirror from '@/components/editor/codemirror'
import Preview from '@/components/editor/preview'

// 文章编辑器命名
defineOptions({ name: 'EditorPost' })

// store
const editorStore = useEditorStore()
const { tocHtml, tocShow, editor, editorShow, previewShow, isFullScreen, isShowEmojiPicker } =
  storeToRefs(editorStore)

// ref
const mdContainerRef = useTemplateRef<HTMLElement | null>('mdContainerRef') //编辑器容器
const toolbarRef = useTemplateRef<ToolbarRef | null>('toolbarRef') //编辑器容器
const codemirrorRef = useTemplateRef<CodemirrorRef | null>('codemirrorRef') //编辑器
const previewRef = useTemplateRef<PreviewRef | null>('previewRef') // 预览容器

const ModePost = reactive([
  CommandsKey.Undo,
  CommandsKey.Redo,
  CommandsKey.Clear,
  CommandsKey.H1,
  CommandsKey.H2,
  CommandsKey.H3,
  CommandsKey.Bold,
  CommandsKey.Italic,
  CommandsKey.Quote,
  CommandsKey.CodeBlock,
  CommandsKey.Link,
  CommandsKey.Ol,
  CommandsKey.Ul,
  CommandsKey.TaskList,
  CommandsKey.Mark,
  CommandsKey.Emoji,
  CommandsKey.Strikethrough,
  CommandsKey.Image,
  CommandsKey.Table,
  CommandsKey.Hr,
  CommandsKey.MathBlock,
  CommandsKey.Footnote,
  CommandsKey.Superscript,
  CommandsKey.Subscript,
  CommandsKey.PayContent,
  CommandsKey.Toc,
  CommandsKey.Edit,
  CommandsKey.Scroll,
  CommandsKey.Preview,
  CommandsKey.WechatOfficialAccount,
  CommandsKey.Fullscreen,
  CommandsKey.Save,
  CommandsKey.Copy,
  CommandsKey.Publish,
  CommandsKey.Markdown,
  CommandsKey.Html,
  CommandsKey.Pdf,
  CommandsKey.Help,
  CommandsKey.Info
])

// 动态生成类名
const layoutClass = computed(() =>
  setIsFullScreenClassName('md-layout', 'md-layout-fs', false, isFullScreen.value)
)
const toolbarClass = computed(() =>
  setIsFullScreenClassName('md-toolbar', 'md-toolbar-fs', false, isFullScreen.value)
)
const mdContainerClass = computed(() =>
  setIsFullScreenClassName('md-container', 'md-container-fs', false, isFullScreen.value)
)
const tocClass = computed(() =>
  setIsFullScreenClassName('md-toc', 'md-toc-fs', true, isFullScreen.value)
)
const editorClass = computed(() =>
  setIsFullScreenClassName('md-editor', 'md-editor-fs', true, isFullScreen.value)
)
const previewClass = computed(() =>
  setIsFullScreenClassName('md-preview', 'md-preview-fs', true, isFullScreen.value)
)

// 工具栏点击事件
const { toolbarBtns, toolbarBtnClicked, iconNumberPerLine } = useToolbar(
  mdContainerRef,
  toolbarRef,
  codemirrorRef,
  previewRef,
  ModePost
)

// event callback
function onSelectEmoji(emoji: any) {
  codemirrorRef.value?.runCommand(CommandsKey.Emoji, { prefix: '', content: emoji.i, suffix: '' })
  isShowEmojiPicker.value = false
}

// 目录点击事件
const { tocHeadingClicked } = useToc(codemirrorRef, previewRef)

// codemirror
const { cmHeight, updateCmHeightNotIsFullScreen, handleScroll, updateEditorDoc } = useCodemirror(
  mdContainerRef,
  codemirrorRef,
  previewRef
)

// preview
const { previewData, isShowPreviewWechat, showImageViewer, closeImageViewer } = usePreview()

// 初始化
onMounted(() => {
  updateCmHeightNotIsFullScreen() // 初始化编辑器实例高度
  // console.log('editorCore onMounted', previewRef.value?.$el)
})

// onBeforeMount(async () => {
//     await editorStore.getEditorContentFromUrl("src/assets/example/markdown.md")
// })
</script>

<style scoped lang="scss">
.emoji-picker-wrapper {
  position: absolute;
  z-index: 1000; // 使用足够高的 z-index 以确保 EmojiPicker 显示在其他元素上方
  top: 100%; // 根据需要调整，这将使 EmojiPicker 出现在工具栏下方
  left: 0; // 根据需要调整，这将使 EmojiPicker 从左边开始
}

// 公共样式
.md-layout,
.md-layout-fs {
  border-radius: 3px;

  .md-toolbar,
  .md-toolbar-fs {
    position: relative;
  }

  .md-container,
  .md-container-fs {
    display: flex;
    width: 100vw;

    .md-container-item,
    .md-container-item-fs {
      border-radius: 3px;
    }

    .md-toc,
    .md-toc-fs {
      overflow: auto;
      flex: 1 1 0; // 1 1 0 代表 flex-grow: 1; flex-shrink: 1; flex-basis: 0; 五分之一
    }

    .md-editor,
    .md-editor-fs {
      overflow: hidden;
      flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
    }

    .md-preview,
    .md-preview-fs {
      overflow: hidden;
      flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
      display: flex;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #ccc; // 子元素居中
    }
  }
}

// 媒介查询
@include respond-to('pc') {
  .md-layout {
    border: 1px solid #ccc;
    margin: 4px 0px;

    .md-toolbar {
      --icon-number-per-line: 20;
    }

    .md-container {
      height: pc.$editor-md-container-height;

      .md-editor {
        --md-editor-height: #{pc.$editor-md-container-height}; // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
      }

      .md-preview {
        height: pc.$editor-md-container-height;
      }
    }
  }

  .md-layout-fs {
    width: 100vw;

    .md-toolbar-fs {
      --icon-number-per-line: 30;
    }

    .md-container-fs {
      height: var(--md-editor-container-height);

      .md-toc-fs,
      .md-editor-fs,
      .md-preview-fs {
        height: var(--md-editor-container-height);
      }
    }
  }
}

@include respond-to('pad') {
  .md-layout {
    border: 1px solid #ccc;
    margin: 5px 0px;

    .md-toolbar {
      --icon-number-per-line: 10;
    }

    .md-container {
      height: phone.$editor-md-container-height;

      .md-editor {
        --md-editor-height: #{phone.$editor-md-container-height}; // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
      }

      .md-preview {
        height: phone.$editor-md-container-height;
      }
    }
  }

  .md-layout-fs {
    width: 100vw;

    .md-toolbar-fs {
      --icon-number-per-line: 10;
    }

    .md-container-fs {
      height: var(--md-editor-container-height);

      .md-toc-fs,
      .md-editor-fs,
      .md-preview-fs {
        height: var(--md-editor-container-height);
      }
    }
  }
}

@include respond-to('phone') {
  .md-layout {
    border: 1px solid #ccc;
    margin: 5px 0px;

    .md-toolbar {
      --icon-number-per-line: 10;
    }

    .md-container {
      height: phone.$editor-md-container-height;

      .md-editor {
        --md-editor-height: #{phone.$editor-md-container-height}; // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
      }

      .md-preview {
        height: phone.$editor-md-container-height;
      }
    }
  }

  .md-layout-fs {
    width: 100vw;

    .md-toolbar-fs {
      --icon-number-per-line: 10;
    }

    .md-container-fs {
      height: var(--md-editor-container-height);

      .md-toc-fs,
      .md-editor-fs,
      .md-preview-fs {
        height: var(--md-editor-container-height);
      }
    }
  }
}
</style>
