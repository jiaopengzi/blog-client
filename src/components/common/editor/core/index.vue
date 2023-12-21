<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-21 16:56:41
 * @FilePath     : \blog-client\src\components\common\editor\core\index.vue
 * @Description  : 编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div :class="layoutClass">
        <!-- 工具栏 -->
        <div :class="toolbarClass">
            <Toolbar :toobar-btns="toobarBtns()" :icon-number-per-line="20" @toolbar-btn-clicked="toolbarBtnClicked" />
        </div>

        <!-- 编辑器容器 -->
        <div :class="mdContainerClass">
            <!-- 导航栏 -->
            <div :class="tocClass" v-show="tocShow">
                <Toc :headings="tocHtml" @heading-clicked="tocHeadingClicked" />
            </div>

            <!-- 编辑器 -->
            <div ref="cmContainerRef" :class="editorClass" v-show="editorShow">
                <Codemirror ref="codemirrorRef" :codemirrorDoc="editor" :height="cmHeight"
                    @handle-scroll="debouncedHandleScroll" @update-editor-doc="updateEditorDoc" />
            </div>

            <!-- 预览 -->
            <div :class="previewClass" v-show="previewShow">
                <Preview ref="previewRef" :preview="previewData" :height="cmHeight" @show-image-viewer="showImageViewer"
                    @close-image-viewer="closeImageViewer" />
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, onBeforeMount, computed, onMounted } from 'vue';
import Toolbar from '@/components/common/editor/toolbar'
import Toc from '@/components/common/editor/toc'
import Codemirror from '@/components/common/editor/codemirror'
import Preview from '@/components/common/editor/preview'
import { useToolbar, useToc, useCodemirror, usePreview } from '@/components/common/editor/core/hooks'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import type { CmContainerRef, CodemirrorRef, PreviewRef } from '@/components/common/editor/core'
import { CommandsKey } from '@/components/common/editor/command'

// 文章编辑器命名
defineOptions({ name: "EditorCore" })

// store
const editorStore = useEditorStore()
const { tocHtml, tocShow, editor, editorShow, previewShow, isFullScreen } = storeToRefs(editorStore)

// ref
const cmContainerRef = ref<CmContainerRef | null>(null) //编辑器容器
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
    CommandsKey.strikethrough,
    CommandsKey.mark,
    CommandsKey.emoji,
    CommandsKey.ol,
    CommandsKey.ul,
    CommandsKey.quote,
    CommandsKey.codeBlock,
    CommandsKey.link,
    CommandsKey.image,
    CommandsKey.table,
    CommandsKey.hr,
    CommandsKey.taskList,
    CommandsKey.mathBlock,
    CommandsKey.footnote,
    CommandsKey.superscript,
    CommandsKey.subscript,
    CommandsKey.payContent,
    CommandsKey.save,
    CommandsKey.publish,
    CommandsKey.toc,
    CommandsKey.preview,
    CommandsKey.scroll,
    CommandsKey.fullscreen,
    CommandsKey.desktop,
    CommandsKey.mobile,
    CommandsKey.markdown,
    CommandsKey.html,
    CommandsKey.pdf,
    CommandsKey.help,
    CommandsKey.info,
])
const ModeComment = reactive([
    CommandsKey.undo,
    CommandsKey.redo,
    CommandsKey.clear,
    CommandsKey.bold,
    CommandsKey.italic,
    CommandsKey.strikethrough,
    CommandsKey.mark,
    CommandsKey.emoji,
    CommandsKey.ol,
    CommandsKey.ul,
    CommandsKey.quote,
    CommandsKey.image,
    CommandsKey.codeBlock,
    CommandsKey.table,
    CommandsKey.mathBlock,
    CommandsKey.publish,
    CommandsKey.help,
    CommandsKey.info,
])


// 工具栏点击事件
const { toobarBtns, toolbarBtnClicked } = useToolbar(codemirrorRef, ModeComment)

// 目录点击事件
const { tocHeadingClicked } = useToc(codemirrorRef, previewRef)

// codemirror
const { cmHeight, initializeCmHeight, debouncedHandleScroll, updateEditorDoc } = useCodemirror(cmContainerRef, previewRef)

// preview
const { previewData, showImageViewer, closeImageViewer } = usePreview()


/**
 * @description: 设置是否全屏的类名
 * @param baseClass 基础类名
 * @param fullScreenClass 全屏类名
 * @param isContainerItem 是否是容器子项
 * @param isFullScreen 是否全屏
 * @return {Object} 类名对象
 */
function setIsFullScreenClassName(
    baseClass: string,
    fullScreenClass: string,
    isContainerItem: boolean,
    isFullScreen: boolean,
): object {
    return {
        [baseClass]: !isFullScreen,
        [fullScreenClass]: isFullScreen,
        'md-container-item': isContainerItem && !isFullScreen,
        'md-container-item-fs': isContainerItem && isFullScreen,
    }
}

// 动态生成类名
const layoutClass = computed(() => setIsFullScreenClassName('md-layout', 'md-layout-fs', false, isFullScreen.value));
const toolbarClass = computed(() => setIsFullScreenClassName('md-toolbar', 'md-toolbar-fs', false, isFullScreen.value));
const mdContainerClass = computed(() => setIsFullScreenClassName('md-container', 'md-container-fs', false, isFullScreen.value));
const tocClass = computed(() => setIsFullScreenClassName('md-toc', 'md-toc-fs', true, isFullScreen.value));
const editorClass = computed(() => setIsFullScreenClassName('md-editor', 'md-editor-fs', true, isFullScreen.value));
const previewClass = computed(() => setIsFullScreenClassName('md-preview', 'md-preview-fs', true, isFullScreen.value));

// 初始化
onMounted(() => {
    initializeCmHeight() // 初始化编辑器实例高度
})

onBeforeMount(async () => {
    editorStore.getEditorDocFromApi("src/assets/example/markdown.md")
})

</script>
  
<style scoped lang="scss">
.md-layout {
    .md-container {
        // flex-grow: 1; // 自动撑满剩下的空间
        display: flex;

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
        }

        .md-preview {
            overflow: hidden;
            flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
        }
    }
}


@include respond-to('pc') {
    .md-layout {
        width: pc.$width-page-main;

        .md-container {
            width: pc.$width-page-main;
            height: pc.$editor-md-container-height;
        }

        .md-editor {
            --md-editor-height: #{pc.$editor-md-container-height}; // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
        }

        .md-preview {
            height: pc.$editor-md-container-height;
        }
    }
}

@include respond-to('phone') {

    .md-layout {
        width: 100%;
    }

    .md-editor {
        --md-editor-height: 100%;
    }
}
</style>
