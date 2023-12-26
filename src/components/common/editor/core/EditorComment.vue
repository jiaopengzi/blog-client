<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-26 17:26:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-27 00:42:43
 * @FilePath     : \blog-client\src\components\common\editor\core\EditorComment.vue
 * @Description  : 评论编辑器
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
            <div class="emoji-picker-wrapper" v-if="inShowEmojiPicker">
                <EmojiPicker :native="true" @select="onSelectEmoji" />
            </div>
        </div>

        <!-- 编辑器容器 -->
        <div ref="mdContainerRef">
            <el-tabs type="border-card" :class="mdContainerClass">
                <el-tab-pane label="编辑">
                    <!-- 编辑器 -->
                    <div ref="cmContainerRef" :class="editorClass">
                        <Codemirror ref="codemirrorRef" :codemirrorDoc="editor" :height="cmHeight"
                            @update-editor-doc="updateEditorDoc" />
                    </div>
                </el-tab-pane>

                <el-tab-pane label="预览">
                    <!-- 预览 -->
                    <div :class="previewClass">
                        <Preview ref="previewRef" :preview="previewData" :height="cmHeight"
                            @show-image-viewer="showImageViewer" @close-image-viewer="closeImageViewer" />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, onBeforeMount, computed, onMounted } from 'vue';
import Toolbar from '@/components/common/editor/toolbar'
import Codemirror from '@/components/common/editor/codemirror'
import Preview from '@/components/common/editor/preview'
import { useToolbar, useCodemirror, usePreview } from '@/components/common/editor/core/hooks'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import type { MdContainerRef, ToolbarRef, CmContainerRef, CodemirrorRef, PreviewRef } from '@/components/common/editor/core'
import { setIsFullScreenClassName } from '@/components/common/editor/core'
import { CommandsKey } from '@/components/common/editor/command'
import EmojiPicker from 'vue3-emoji-picker' // import picker compopnent
import 'vue3-emoji-picker/css'// import css

// 评论编辑器命名
defineOptions({ name: "EditorComment" })

// store
const editorStore = useEditorStore()
const { editor, isFullScreen, inShowEmojiPicker } = storeToRefs(editorStore)

// ref
const mdContainerRef = ref<MdContainerRef | null>(null) //编辑器容器
const toolbarRef = ref<ToolbarRef | null>(null) //编辑器容器
const cmContainerRef = ref<CmContainerRef | null>(null) //编辑器容器
const codemirrorRef = ref<CodemirrorRef | null>(null) //编辑器
const previewRef = ref<PreviewRef | null>(null) // 预览容器
// 将 CommandsKey 解构
const ModeComment = reactive([
    CommandsKey.undo,
    CommandsKey.redo,
    CommandsKey.clear,
    CommandsKey.h1,
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
    CommandsKey.fullscreen,
    CommandsKey.publish,
    CommandsKey.help,
    CommandsKey.info,
])

// 动态生成类名
const layoutClass = computed(() => setIsFullScreenClassName('md-layout', 'md-layout-fs', false, isFullScreen.value));
const toolbarClass = computed(() => setIsFullScreenClassName('md-toolbar', 'md-toolbar-fs', false, isFullScreen.value));
const mdContainerClass = computed(() => setIsFullScreenClassName('md-container', 'md-container-fs', false, isFullScreen.value));
const editorClass = computed(() => setIsFullScreenClassName('md-editor', 'md-editor-fs', false, isFullScreen.value));
const previewClass = computed(() => setIsFullScreenClassName('md-preview', 'md-preview-fs', false, isFullScreen.value));

// 工具栏点击事件
const { toobarBtns, toolbarBtnClicked, iconNumberPerLine } = useToolbar(mdContainerRef, toolbarRef, codemirrorRef, ModeComment)

// event callback
function onSelectEmoji(emoji: any) {
    codemirrorRef.value?.runCommand(CommandsKey.emoji, { prefix: "", content: emoji.i, suffix: "" })
    inShowEmojiPicker.value = false
}

// codemirror
const { cmHeight, updateCmHeightNotIsFullScreen, updateEditorDoc } = useCodemirror(mdContainerRef, cmContainerRef, previewRef)

// preview
const { previewData, showImageViewer, closeImageViewer } = usePreview()

// 初始化
onMounted(() => {
    updateCmHeightNotIsFullScreen() // 初始化编辑器实例高度
})

onBeforeMount(async () => {
    await editorStore.getEditorDocFromApi("src/assets/example/markdown.md")
})

</script>
  
<style scoped lang="scss">
.el-tabs {
    --el-tabs-header-height: 40px;
    border: none;
}

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

            width: pc.$width-page-main;

            :deep(.el-tabs__content) {
                padding: 0 0;
                height: 200px;
            }

            .md-editor {
                overflow: hidden;
                --md-editor-height: 200px
            }

            .md-preview {
                overflow: hidden;
                height: 200px;
            }
        }
    }

    .md-layout-fs {
        border-radius: 3px;
        width: pc.$width-page-main;

        .md-toolbar-fs {
            position: relative;
            --icon-number-per-line: 20;
        }

        .md-container-fs {

            width: pc.$width-page-main;

            :deep(.el-tabs__content) {
                width: pc.$width-page-main;
                padding: 0 0;
                height: calc(var(--md-editor-container-height) - var(--el-tabs-header-height));
            }

            .md-editor-fs {
                --md-editor-height: calc(var(--md-editor-container-height) - var(--el-tabs-header-height));
            }

            .md-preview-fs {
                height: calc(var(--md-editor-container-height) - var(--el-tabs-header-height));
            }
        }
    }
}

@include respond-to('phone') {

    .md-layout {
        // border: 1px solid #ccc;
        border-radius: 3px;
        // margin: 5px 0px;
        width: 100vw;

        .md-toolbar {
            position: relative;
            --icon-number-per-line: 10;
        }

        .md-container {

            width: 100vw;


            :deep(.el-tabs__content) {
                padding: 0 0;
                height: 50vh;
            }

            .md-editor {
                --md-editor-height: 50vh;
            }

            .md-preview {
                height: 50vh;
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
            --icon-number-per-line: 10;
        }

        .md-container-fs {

            width: 100vw;

            :deep(.el-tabs__content) {
                padding: 0 0;
                height: calc(var(--md-editor-container-height) - var(--el-tabs-header-height));
            }

            .md-editor-fs {
                --md-editor-height: calc(var(--md-editor-container-height) - var(--el-tabs-header-height));
            }

            .md-preview-fs {
                height: calc(var(--md-editor-container-height) - var(--el-tabs-header-height));
            }
        }
    }

}
</style>
