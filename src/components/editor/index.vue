<!--
 * FilePath    : blog-client\src\components\editor\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器
-->

<template>
    <div class="md-layout" ref="mdLayoutRef">
        <!-- 工具栏 -->
        <div class="md-toolbar">
            <Toolbar
                ref="toolbarRef"
                :toolbar-btns="toolbarBtns"
                :icon-number-per-line="iconNumberPerLine()"
                @toolbar-btn-clicked="toolbarBtnClicked"
                @emoji-picker-selected="emojiPickerSelected"
                @table-row-col="insertTableRowCol"
            />
        </div>

        <!-- 编辑器容器 -->
        <div ref="mdContainerRef" class="md-container">
            <!-- 导航栏 -->
            <div class="md-toc md-container-item" v-show="state.tocShow">
                <EditorToc :headings="state.tocHtml" :heading-show-current-index="state.headingShowCurrentIndex" @heading-clicked="tocHeadingClicked" />
            </div>

            <!-- 编辑器 -->
            <div class="md-editor md-container-item" v-show="state.editorShow">
                <EditorCodemirror
                    ref="codemirrorRef"
                    :doc="state.editor"
                    :height="cmHeight"
                    :vim-mode="state.vimMode"
                    @handle-scroll="handleScroll"
                    @update-editor-doc="updateEditorDoc"
                />
            </div>

            <!-- 预览 -->
            <div class="md-preview md-container-item" v-show="state.previewShow">
                <HtmlPreview
                    ref="previewRef"
                    :html="state.html"
                    :img-urls="state.imgUrls"
                    :is-show-el-image-viewer="state.isShowElImageViewer"
                    :is-show-preview-wechat="state.isShowPreviewWechat"
                    :is-user-scroll-preview="state.isUserScrollPreview"
                    :height="cmHeight"
                    @show-image-viewer="showImageViewer"
                    @close-image-viewer="closeImageViewer"
                    @is-mouse-in-element="handleMouseInElement"
                    @heading-show-current="handleHeadingShowCurrent"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "vue3-emoji-picker/css"

import { onMounted, useTemplateRef, watch } from "vue"

import EditorCodemirror, { type CodemirrorRef } from "./components/codemirror"
import HtmlPreview, { type PreviewRef } from "./components/preview"
import EditorToc from "./components/toc"
import Toolbar, { type ToolbarRef } from "./components/toolbar"
import { useCodemirror, usePreview, useToc, useToolbar } from "./hooks"
import { EditorStateManager } from "./state"

// 文章编辑器命名
defineOptions({ name: "JEditor" })

const { stateManager } = defineProps<{
    stateManager: EditorStateManager
}>()

const emit = defineEmits<{
    (event: "updateEditorStatus", val: boolean): void
}>()

const state = stateManager.getState()

// ref
const mdLayoutRef = useTemplateRef<HTMLElement | null>("mdLayoutRef") //编辑器布局
const mdContainerRef = useTemplateRef<HTMLElement | null>("mdContainerRef") //编辑器容器
const toolbarRef = useTemplateRef<ToolbarRef | null>("toolbarRef") //编辑器容器
const codemirrorRef = useTemplateRef<CodemirrorRef | null>("codemirrorRef") //编辑器
const previewRef = useTemplateRef<PreviewRef | null>("previewRef") // 预览容器

// 工具栏点击事件
const { toolbarBtns, toolbarBtnClicked, iconNumberPerLine, emojiPickerSelected, insertTableRowCol } = useToolbar(
    mdLayoutRef,
    mdContainerRef,
    toolbarRef,
    codemirrorRef,
    previewRef,
    stateManager,
)

// 目录点击事件
const { tocHeadingClicked } = useToc(codemirrorRef, previewRef, stateManager)

// codemirror
const { cmHeight, updateCmHeightNotIsFullScreen, handleScroll } = useCodemirror(mdContainerRef, codemirrorRef, previewRef, stateManager)

const updateEditorDoc = (editorDoc: string) => {
    stateManager.updateState(editorDoc) // 更新 store 中的 editor
    emit("updateEditorStatus", true) // 更新编辑器状态
}

// preview
const { showImageViewer, closeImageViewer, handleMouseInElement, handleHeadingShowCurrent } = usePreview(stateManager, codemirrorRef)

// 监听编辑器宽度变化
watch(
    () => state.width,
    (newWidth) => {
        document.documentElement.style.setProperty("--md-editor-width", `${newWidth}px`)
    },
)

// 初始化
onMounted(() => {
    updateCmHeightNotIsFullScreen() // 初始化编辑器实例高度
    // console.log('editorCore onMounted', previewRef.value?.$el)
})

// 暴露给父组件的属性
defineExpose({
    codemirror: codemirrorRef,
})
</script>

<style scoped lang="scss">
// 全屏样式
.web--fullscreen {
    @include webFullscreen();
}

.emoji-picker-wrapper {
    position: absolute;
    z-index: 1000; // 使用足够高的 z-index 以确保 EmojiPicker 显示在其他元素上方
    top: 100%; // 根据需要调整，这将使 EmojiPicker 出现在工具栏下方
    left: 0; // 根据需要调整，这将使 EmojiPicker 从左边开始
}

.md-layout {
    border-radius: 3px;
    background-color: var(--jpz-bg-color-page);
    width: 100%;

    .md-toolbar {
        position: relative;
    }

    .md-container {
        display: flex;

        .md-container-item {
            border-radius: 3px;
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
            display: flex;
            justify-content: center;
            align-items: center;
            border-left: 1px solid var(--jpz-border-color); // 子元素居中
        }
    }
}

// 媒介查询
@include respond-to("pc") {
    .md-layout {
        // border: 1px solid var(--jpz-border-color);

        .md-toolbar {
            --icon-number-per-line: 20;
        }

        .md-container {
            height: pc.$editor-md-container-height;

            .md-editor {
                // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
                --md-editor-height: #{pc.$editor-md-container-height};
            }

            .md-preview {
                height: pc.$editor-md-container-height;
            }
        }
    }

    .web--fullscreen {
        .md-toolbar {
            --icon-number-per-line: 30;
        }

        .md-container {
            height: var(--md-editor-container-height);

            .md-toc,
            .md-editor,
            .md-preview {
                height: var(--md-editor-container-height);
            }
        }
    }
}

@include respond-to("pad") {
    .md-layout {
        // border: 1px solid var(--jpz-border-color);

        .md-toolbar {
            --icon-number-per-line: 15;
        }

        .md-container {
            height: phone.$editor-md-container-height;

            .md-editor {
                // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
                --md-editor-height: #{phone.$editor-md-container-height};
            }

            .md-preview {
                height: phone.$editor-md-container-height;
            }
        }
    }

    .web--fullscreen {
        .md-toolbar {
            --icon-number-per-line: 20;
        }

        .md-container {
            height: var(--md-editor-container-height);

            .md-toc,
            .md-editor,
            .md-preview {
                height: var(--md-editor-container-height);
            }
        }
    }
}

@include respond-to("phone") {
    .md-layout {
        .md-toolbar {
            --icon-number-per-line: 15;
        }

        .md-container {
            height: phone.$editor-md-container-height;

            .md-editor {
                // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
                --md-editor-height: #{phone.$editor-md-container-height};
            }

            .md-preview {
                height: phone.$editor-md-container-height;
            }
        }
    }

    .web--fullscreen {
        .md-toolbar {
            --icon-number-per-line: 15;
        }

        .md-container {
            height: var(--md-editor-container-height);

            .md-toc,
            .md-editor,
            .md-preview {
                height: var(--md-editor-container-height);
            }
        }
    }
}
</style>
