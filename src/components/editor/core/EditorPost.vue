<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-28 15:59:24
 * @FilePath     : \blog-client\src\components\editor\core\EditorPost.vue
 * @Description  : 文章编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div :class="layoutClass">
        <!-- 工具栏 -->
        <div :class="toolbarClass">
            <EditorToolbar
                ref="toolbarRef"
                :toolbar-btns="toolbarBtns()"
                :icon-number-per-line="iconNumberPerLine()"
                @toolbar-btn-clicked="toolbarBtnClicked"
                @emoji-picker-selected="emojiPickerSelected"
                @table-row-col="insertTableRowCol"
            />
        </div>

        <!-- 编辑器容器 -->
        <div ref="mdContainerRef" :class="mdContainerClass">
            <!-- 导航栏 -->
            <div :class="tocClass" v-show="localEditorState.tocShow">
                <EditorToc
                    :headings="localEditorState.tocHtml"
                    :heading-show-current-index="localEditorState.headingShowCurrentIndex"
                    @heading-clicked="tocHeadingClicked"
                />
            </div>

            <!-- 编辑器 -->
            <div :class="editorClass" v-show="localEditorState.editorShow">
                <EditorCodemirror
                    ref="codemirrorRef"
                    :codemirror-doc="localEditorState.editor"
                    :height="cmHeight"
                    @handle-scroll="handleScroll"
                    @update-editor-doc="updateEditorDoc"
                />
            </div>

            <!-- 预览 -->
            <div :class="previewClass" v-show="localEditorState.previewShow">
                <HtmlPreview
                    ref="previewRef"
                    :preview="previewData"
                    :is-show-preview-wechat="localEditorState.isShowPreviewWechat"
                    :is-user-scroll-preview="localEditorState.isUserScrollPreview"
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
import { useTemplateRef, reactive, computed, onMounted, watchEffect } from "vue"
import { useToolbar, useCodemirror, usePreview, useToc } from "./hooks"
import type { EditorState, ToolbarRef, CodemirrorRef, PreviewRef } from "./types"
import { EditorStateManager } from "./state"
import { setIsFullScreenClassName } from "./utils"
import { CommandsKey } from "@/components/editor/command"
import "vue3-emoji-picker/css" // import css

import EditorToolbar from "@/components/editor/toolbar"
import EditorToc from "@/components/editor/toc"
import EditorCodemirror from "@/components/editor/codemirror"
import HtmlPreview from "@/components/editor/preview"

// 文章编辑器命名
defineOptions({ name: "EditorPost" })

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
    CommandsKey.Video,
    CommandsKey.Toc,
    CommandsKey.Edit,
    CommandsKey.Scroll,
    CommandsKey.Preview,
    CommandsKey.WechatOfficialAccount,
    CommandsKey.Fullscreen,
    // CommandsKey.Save,
    CommandsKey.Copy,
    // CommandsKey.Publish,
    CommandsKey.Markdown,
    CommandsKey.Html,
    CommandsKey.Pdf,
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
    setIsFullScreenClassName("md-editor", "md-editor-fs", true, localEditorState.isFullScreen),
)

const previewClass = computed(() =>
    setIsFullScreenClassName("md-preview", "md-preview-fs", true, localEditorState.isFullScreen),
)

const tocClass = computed(() =>
    setIsFullScreenClassName("md-toc", "md-toc-fs", true, localEditorState.isFullScreen),
)

// 编辑器容器、目录、编辑器、预览容器动态类名
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
} = useToolbar(mdContainerRef, toolbarRef, codemirrorRef, previewRef, ModePost, localManager)

// 目录点击事件
const { tocHeadingClicked } = useToc(codemirrorRef, previewRef, localManager)

// codemirror
const { cmHeight, updateCmHeightNotIsFullScreen, handleScroll } = useCodemirror(
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
const {
    previewData,
    showImageViewer,
    closeImageViewer,
    handleMouseInElement,
    handleHeadingShowCurrent,
} = usePreview(codemirrorRef, localManager)

// 监听编辑器宽度变化
watchEffect(() => {
    document.documentElement.style.setProperty("--md-editor-width", `${localEditorState.width}px`)
})

// 初始化
onMounted(() => {
    updateCmHeightNotIsFullScreen() // 初始化编辑器实例高度
    // console.log('editorCore onMounted', previewRef.value?.$el)
})
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
    background-color: var(--jpz-bg-color-page);
    width: var(--md-editor-width);
    .md-toolbar,
    .md-toolbar-fs {
        position: relative;
    }

    .md-container,
    .md-container-fs {
        display: flex;

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
            border-left: 1px solid var(--jpz-border-color); // 子元素居中
        }
    }
}

// 全屏样式
.md-layout-fs {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 0;
    z-index: 1000;
}

// 媒介查询
@include respond-to("pc") {
    .md-layout {
        border: 1px solid var(--jpz-border-color);
        margin: 4px 0px;

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

    .md-layout-fs {
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

@include respond-to("pad") {
    .md-layout {
        border: 1px solid var(--jpz-border-color);
        margin: 5px 0px;

        .md-toolbar {
            --icon-number-per-line: 10;
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

@include respond-to("phone") {
    .md-layout {
        border: 1px solid var(--jpz-border-color);
        margin: 5px 0px;

        .md-toolbar {
            --icon-number-per-line: 10;
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
