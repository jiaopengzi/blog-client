<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 12:23:25
 * @FilePath     : \blog-client\src\components\common\editor\core\EditorPost.vue
 * @Description  : 编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div :class="layoutClass">
        <!-- 工具栏 -->
        <div :class="toolbarClass">
            <Toolbar ref="toolbarRef" :toobar-btns="toobarBtns()" :icon-number-per-line="iconNumberPerLine()"
                @toolbar-btn-clicked="toolbarBtnClicked" />
            <!-- emoji 选择组件 -->
            <div class="emoji-picker-wrapper" v-if="isShowEmojiPicker">
                <EmojiPicker :native="true" @select="onSelectEmoji" />
            </div>
        </div>

        <!-- 编辑器容器 -->
        <div ref="mdContainerRef" :class="mdContainerClass">
            <!-- 导航栏 -->
            <div :class="tocClass" v-show="tocShow">
                <Toc :headings="tocHtml" @heading-clicked="tocHeadingClicked" />
            </div>

            <!-- 编辑器 -->
            <div :class="editorClass" v-show="editorShow">
                <Codemirror ref="codemirrorRef" :codemirrorDoc="editor" :height="cmHeight"
                    @handle-scroll="debouncedHandleScroll" @update-editor-doc="updateEditorDoc" />
            </div>

            <!-- 预览 -->
            <div :class="previewClass" v-show="previewShow">
                <Preview ref="previewRef" :preview="previewData" :is-show-preview-wechat="isShowPreviewWechat"
                    :height="cmHeight" @show-image-viewer="showImageViewer" @close-image-viewer="closeImageViewer" />
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import Toolbar from '@/components/editor/toolbar'
import Toc from '@/components/editor/toc'
import Codemirror from '@/components/editor/codemirror'
import Preview from '@/components/editor/preview'
import { useToolbar, useToc, useCodemirror, usePreview } from '@/components/editor/core/hooks'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import type { ToolbarRef, CodemirrorRef, PreviewRef } from '@/components/editor/core'
import { setIsFullScreenClassName } from '@/components/editor/core'
import { CommandsKey } from '@/components/editor/command'
import EmojiPicker from 'vue3-emoji-picker' // import picker compopnent
import 'vue3-emoji-picker/css'// import css


// 文章编辑器命名
defineOptions({ name: "EditorPost" })

// store
const editorStore = useEditorStore()
const { tocHtml, tocShow, editor, editorShow, previewShow, isFullScreen, isShowEmojiPicker } = storeToRefs(editorStore)

// ref
const mdContainerRef = ref<HTMLElement | null>(null) //编辑器容器
const toolbarRef = ref<ToolbarRef | null>(null) //编辑器容器
const codemirrorRef = ref<CodemirrorRef | null>(null) //编辑器
const previewRef = ref<PreviewRef | null>(null) // 预览容器
// 将 CommandsKey 解构

const ModePost = reactive([
    CommandsKey.undo,
    CommandsKey.redo,
    CommandsKey.clear,
    CommandsKey.h1,
    CommandsKey.h2,
    CommandsKey.h3,
    CommandsKey.bold,
    CommandsKey.italic,
    CommandsKey.quote,
    CommandsKey.codeBlock,
    CommandsKey.link,
    CommandsKey.ol,
    CommandsKey.ul,
    CommandsKey.taskList,
    CommandsKey.mark,
    CommandsKey.emoji,
    CommandsKey.strikethrough,
    CommandsKey.image,
    CommandsKey.table,
    CommandsKey.hr,
    CommandsKey.mathBlock,
    CommandsKey.footnote,
    CommandsKey.superscript,
    CommandsKey.subscript,
    CommandsKey.payContent,
    CommandsKey.toc,
    CommandsKey.edit,
    CommandsKey.scroll,
    CommandsKey.preview,
    CommandsKey.WeChatOfficialAccount,
    CommandsKey.fullscreen,
    CommandsKey.save,
    CommandsKey.copy,
    CommandsKey.publish,
    CommandsKey.markdown,
    CommandsKey.html,
    CommandsKey.pdf,
    CommandsKey.help,
    CommandsKey.info,
])


// 动态生成类名
const layoutClass = computed(() => setIsFullScreenClassName('md-layout', 'md-layout-fs', false, isFullScreen.value));
const toolbarClass = computed(() => setIsFullScreenClassName('md-toolbar', 'md-toolbar-fs', false, isFullScreen.value));
const mdContainerClass = computed(() => setIsFullScreenClassName('md-container', 'md-container-fs', false, isFullScreen.value));
const tocClass = computed(() => setIsFullScreenClassName('md-toc', 'md-toc-fs', true, isFullScreen.value));
const editorClass = computed(() => setIsFullScreenClassName('md-editor', 'md-editor-fs', true, isFullScreen.value));
const previewClass = computed(() => setIsFullScreenClassName('md-preview', 'md-preview-fs', true, isFullScreen.value));

// 工具栏点击事件
const { toobarBtns, toolbarBtnClicked, iconNumberPerLine } = useToolbar(mdContainerRef, toolbarRef, codemirrorRef, previewRef, ModePost)

// event callback
function onSelectEmoji(emoji: any) {
    codemirrorRef.value?.runCommand(CommandsKey.emoji, { prefix: "", content: emoji.i, suffix: "" })
    isShowEmojiPicker.value = false
}

// 目录点击事件
const { tocHeadingClicked } = useToc(codemirrorRef, previewRef)

// codemirror
const { cmHeight, updateCmHeightNotIsFullScreen, debouncedHandleScroll, updateEditorDoc } = useCodemirror(mdContainerRef, codemirrorRef, previewRef)

// preview
const { previewData, isShowPreviewWechat, showImageViewer, closeImageViewer } = usePreview()

// 初始化
onMounted(() => {
    updateCmHeightNotIsFullScreen() // 初始化编辑器实例高度
    // console.log('editorCore onMounted', previewRef.value?.$el)
})

// onBeforeMount(async () => {
//     await editorStore.getEditorDocFromApi("src/assets/example/markdown.md")
// })

</script>
  
<style scoped lang="scss">
.emoji-picker-wrapper {
    position: absolute;
    z-index: 1000; // 使用足够高的 z-index 以确保 EmojiPicker 显示在其他元素上方
    top: 100%; // 根据需要调整，这将使 EmojiPicker 出现在工具栏下方
    left: 0; // 根据需要调整，这将使 EmojiPicker 从左边开始
}


@include respond-to('pc') {
    .md-layout {
        border: 1px solid #ccc;
        border-radius: 3px;
        margin: 5px 0px;
        width: pc.$width-page-main;

        .md-toolbar {
            position: relative;
            --icon-number-per-line: 20;
        }

        .md-container {
            display: flex;
            width: pc.$width-page-main;
            height: pc.$editor-md-container-height;

            .md-container-item {
                border-radius: 3px;
                // box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
            }

            .md-toc {
                overflow: auto;
                flex: 1 1 0; // 1 1 0 代表 flex-grow: 1; flex-shrink: 1; flex-basis: 0; 五分之一
            }

            .md-editor {
                overflow: hidden;
                flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
                --md-editor-height: #{pc.$editor-md-container-height}; // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
            }

            .md-preview {
                overflow: hidden;
                flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
                height: pc.$editor-md-container-height;
                // 子元素居中
                display: flex;
                justify-content: center;
                align-items: center;
                border-left: 1px solid #ccc;
            }
        }

    }

    .md-layout-fs {
        // border: 1px solid #ccc;
        border-radius: 3px;
        // margin: 5px 0px;
        width: 100vw;

        .md-toolbar-fs {
            position: relative;
            --icon-number-per-line: 30;
        }

        .md-container-fs {
            display: flex;
            width: 100vw;
            height: var(--md-editor-container-height);

            .md-container-item-fs {
                border-radius: 3px;
                // box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
            }

            .md-toc-fs {
                overflow: auto;
                flex: 1 1 0; // 1 1 0 代表 flex-grow: 1; flex-shrink: 1; flex-basis: 0; 五分之一
                height: var(--md-editor-container-height);
            }

            .md-editor-fs {
                overflow: hidden;
                flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
                --md-editor-height: var(--md-editor-container-height);
            }

            .md-preview-fs {
                overflow: hidden;
                flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
                height: var(--md-editor-container-height);
                // 子元素居中
                display: flex;
                justify-content: center;
                align-items: center;
                border-left: 1px solid #ccc;
            }
        }

    }

}

@include respond-to('phone') {

    .md-layout {
        border: 1px solid #ccc;
        border-radius: 3px;
        margin: 5px 0px;
        width: 100vw;

        .md-toolbar {
            position: relative;
            --icon-number-per-line: 10;
        }

        .md-container {
            display: flex;
            width: 100vw;
            height: phone.$editor-md-container-height;

            .md-container-item {
                border-radius: 3px;
                // box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
            }

            .md-toc {
                overflow: auto;
                flex: 1 1 0; // 1 1 0 代表 flex-grow: 1; flex-shrink: 1; flex-basis: 0; 五分之一
            }

            .md-editor {
                overflow: hidden;
                flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
                --md-editor-height: #{phone.$editor-md-container-height}; // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
            }

            .md-preview {
                overflow: hidden;
                flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
                height: phone.$editor-md-container-height;
                // 子元素居中
                display: flex;
                justify-content: center;
                align-items: center;
                border-left: 1px solid #ccc;
            }
        }

    }

    .md-layout-fs {
        border-radius: 3px;
        width: 100vw;

        .md-toolbar-fs {
            position: relative;
            --icon-number-per-line: 10;
        }

        .md-container-fs {
            display: flex;
            width: 100vw;
            height: var(--md-editor-container-height);

            .md-container-item-fs {
                border-radius: 3px;
            }

            .md-toc-fs {
                overflow: auto;
                flex: 1 1 0; // 1 1 0 代表 flex-grow: 1; flex-shrink: 1; flex-basis: 0; 五分之一
                height: var(--md-editor-container-height);
            }

            .md-editor-fs {
                overflow: hidden;
                flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
                --md-editor-height: var(--md-editor-container-height);
            }

            .md-preview-fs {
                overflow: hidden;
                flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
                height: var(--md-editor-container-height);
                // 子元素居中
                display: flex;
                justify-content: center;
                align-items: center;
                border-left: 1px solid #ccc;
            }
        }

    }
}
</style>
