<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-26 17:26:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-28 16:01:44
 * @FilePath     : \blog-client\src\components\editor\core\EditorComment.vue
 * @Description  : 评论编辑器
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
                @emoji-picker-selected="emojiPickerSelected"
                @table-row-col="insertTableRowCol"
            />
        </div>

        <!-- 编辑器容器 -->
        <div ref="mdContainerRef">
            <el-tabs type="border-card" :class="mdContainerClass">
                <el-tab-pane label="编辑">
                    <!-- 编辑器 -->
                    <div :class="editorClass">
                        <EditorCodemirror
                            ref="codemirrorRef"
                            :codemirror-doc="localEditorState.editor"
                            :height="cmHeight"
                            @update-editor-doc="updateEditorDoc"
                        />
                    </div>
                </el-tab-pane>

                <el-tab-pane label="预览">
                    <!-- 预览 -->
                    <div :class="previewClass">
                        <HtmlPreview
                            ref="previewRef"
                            :preview="previewData"
                            :is-user-scroll-preview="localEditorState.isUserScrollPreview"
                            :height="cmHeight"
                            @show-image-viewer="showImageViewer"
                            @close-image-viewer="closeImageViewer"
                        />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "vue3-emoji-picker/css" // import css

import { computed, onMounted,reactive, useTemplateRef } from "vue"

import EditorCodemirror from "@/components/editor/codemirror"
import { CommandsKey } from "@/components/editor/command" // import picker component
import HtmlPreview from "@/components/editor/preview"
import Toolbar from "@/components/editor/toolbar"

import { useCodemirror, usePreview,useToolbar } from "./hooks"
import { EditorStateManager } from "./state"
import type { CodemirrorRef, EditorState, PreviewRef,ToolbarRef } from "./types"
import { setIsFullScreenClassName } from "./utils"

// 评论编辑器命名
defineOptions({ name: "EditorComment" })

const { editorState } = defineProps<{
    editorState: EditorState
}>()

const emit = defineEmits<{
    (event: "updateEditorStatus", val: boolean): void
}>()

// 状态管理
const localManager = new EditorStateManager(editorState)
const localEditorState = reactive<EditorState>(localManager.getState())

// ref
const mdContainerRef = useTemplateRef<HTMLElement | null>("mdContainerRef") //编辑器容器
const toolbarRef = useTemplateRef<ToolbarRef | null>("toolbarRef") //编辑器容器
const codemirrorRef = useTemplateRef<CodemirrorRef | null>("codemirrorRef") //编辑器
const previewRef = useTemplateRef<PreviewRef | null>("previewRef") // 预览容器
// 将 CommandsKey 解构
const ModeComment = reactive([
    CommandsKey.Undo,
    CommandsKey.Redo,
    CommandsKey.Clear,
    CommandsKey.H1,
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
    CommandsKey.Fullscreen,
    CommandsKey.Publish,
    CommandsKey.Help,
    CommandsKey.Info,
])

// 动态生成类名
const layoutClass = computed(() =>
    setIsFullScreenClassName("md-layout", "md-layout-fs", false, localEditorState.isFullScreen),
)

const toolbarClass = computed(() =>
    setIsFullScreenClassName("md-toolbar", "md-toolbar-fs", false, localEditorState.isFullScreen),
)

const editorClass = computed(() =>
    setIsFullScreenClassName("md-editor", "md-editor-fs", false, localEditorState.isFullScreen),
)

const previewClass = computed(() =>
    setIsFullScreenClassName("md-preview", "md-preview-fs", false, localEditorState.isFullScreen),
)

// 编辑器容器、编辑器、预览容器动态类名
const mdContainerClass = computed(() =>
    setIsFullScreenClassName(
        "md-container",
        "md-container-fs",
        false,
        localEditorState.isFullScreen,
    ),
)

// 工具栏点击事件
const {
    toolbarBtns,
    toolbarBtnClicked,
    iconNumberPerLine,
    emojiPickerSelected,
    insertTableRowCol,
} = useToolbar(mdContainerRef, toolbarRef, codemirrorRef, previewRef, ModeComment, localManager)

// codemirror
const { cmHeight, updateCmHeightNotIsFullScreen } = useCodemirror(
    mdContainerRef,
    codemirrorRef,
    previewRef,
    localManager,
)

const updateEditorDoc = (editorDoc: string) => {
    localManager.updateState(editorDoc) // 更新 store 中的 editor
    emit("updateEditorStatus", true) // 更新编辑器状态
}

// preview
const { previewData, showImageViewer, closeImageViewer } = usePreview(codemirrorRef, localManager)

// 初始化
onMounted(() => {
    updateCmHeightNotIsFullScreen() // 初始化编辑器实例高度
})
</script>

<style scoped lang="scss">
.emoji-picker-wrapper {
    position: absolute;
    z-index: 1000; // 使用足够高的 z-index 以确保 EmojiPicker 显示在其他元素上方
    top: 100%; // 根据需要调整，这将使 EmojiPicker 出现在工具栏下方
    left: 0; // 根据需要调整，这将使 EmojiPicker 从左边开始
}

@include respond-to("pc") {
    .md-layout {
        border: 1px solid #ccc;
        border-radius: 3px;
        margin: 5px 0px;
        background-color: var(--jpz-bg-color-page);
        width: pc.$width-page-main;

        .md-toolbar {
            position: relative;
            --icon-number-per-line: 20;
        }

        .el-tabs__header {
            --el-tabs-header-height: #{pc.$el-tabs-header-height}; // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
            border: none;
        }

        .md-container {
            width: pc.$width-page-main;

            :deep(.el-tabs__content) {
                padding: 0 0;
                height: pc.$editor-md-container-height-comment;
            }

            .md-editor {
                overflow: hidden;
                --md-editor-height: #{pc.$editor-md-container-height-comment}; // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
            }

            .md-preview {
                overflow: hidden;
                height: pc.$editor-md-container-height-comment;
            }
        }
    }

    .md-layout-fs {
        // overflow: hidden;
        border-radius: 3px;
        width: pc.$width-page-main;

        .md-toolbar-fs {
            position: relative;
            --icon-number-per-line: 20;
        }

        .md-container-fs {
            // overflow: hidden;
            width: pc.$width-page-main;

            :deep(.el-tabs__content) {
                width: pc.$width-page-main;
                padding: 0 0;
                height: calc(var(--md-editor-container-height) - var(--jpz-tabs-header-height));
            }

            // .md-editor-fs {
            //     --md-editor-height: calc(var(--md-editor-container-height) - var(--jpz-tabs-header-height));
            // }

            .md-preview-fs {
                height: calc(var(--md-editor-container-height) - var(--jpz-tabs-header-height));
            }
        }
    }
}

@include respond-to("pad") {
    .md-layout {
        // border: 1px solid #ccc;
        border-radius: 3px;
        // margin: 5px 0px;
        width: phone.$width-page;

        .md-toolbar {
            position: relative;
            --icon-number-per-line: 10;
        }

        .el-tabs__header {
            --el-tabs-header-height: #{phone.$el-tabs-header-height};
            border: none;
        }

        .md-container {
            width: phone.$width-page;

            :deep(.el-tabs__content) {
                padding: 0 0;
                height: phone.$editor-md-container-height-comment;
            }

            .md-editor {
                --md-editor-height: #{phone.$editor-md-container-height-comment};
            }

            .md-preview {
                height: phone.$editor-md-container-height-comment;
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
                height: calc(var(--md-editor-container-height) - var(--jpz-tabs-header-height));
            }

            // .md-editor-fs {
            //     --md-editor-height: calc(var(--md-editor-container-height) - var(--jpz-tabs-header-height));
            // }

            .md-preview-fs {
                height: calc(var(--md-editor-container-height) - var(--jpz-tabs-header-height));
            }
        }
    }
}

@include respond-to("phone") {
    .md-layout {
        // border: 1px solid #ccc;
        border-radius: 3px;
        // margin: 5px 0px;
        width: phone.$width-page;

        .md-toolbar {
            position: relative;
            --icon-number-per-line: 10;
        }

        .el-tabs__header {
            --el-tabs-header-height: #{phone.$el-tabs-header-height};
            border: none;
        }

        .md-container {
            width: phone.$width-page;

            :deep(.el-tabs__content) {
                padding: 0 0;
                height: phone.$editor-md-container-height-comment;
            }

            .md-editor {
                --md-editor-height: #{phone.$editor-md-container-height-comment};
            }

            .md-preview {
                height: phone.$editor-md-container-height-comment;
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
                height: calc(var(--md-editor-container-height) - var(--jpz-tabs-header-height));
            }

            // .md-editor-fs {
            //     --md-editor-height: calc(var(--md-editor-container-height) - var(--jpz-tabs-header-height));
            // }

            .md-preview-fs {
                height: calc(var(--md-editor-container-height) - var(--jpz-tabs-header-height));
            }
        }
    }
}
</style>
