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
                :toolbar-btns="toolbarBtns"
                @toolbar-btn-clicked="toolbarBtnClicked"
                @pay-select="insertPay"
                @emoji-picker-selected="emojiPickerSelected"
                @table-row-col="insertTableRowCol"
                @alert-select="insertAlert"
                @toolbar-height="updateMdContainerStyle"
            />
        </div>

        <!-- 编辑器容器 -->
        <div ref="mdContainerRef" :class="state.mode === 'post' ? 'md-container' : 'md-container-comment'">
            <!-- 导航栏 -->
            <div class="md-toc md-container-item" v-show="state.tocShow">
                <EditorToc :headings="state.tocHtml" :heading-show-current-index="state.headingShowCurrentIndex" @heading-clicked="tocHeadingClicked" />
            </div>

            <!-- 编辑器 -->
            <div class="md-editor md-container-item" v-show="state.editorShow">
                <EditorCodemirror
                    ref="codemirrorRef"
                    :doc="state.editorContent"
                    :height="cmHeight"
                    :vim-mode="state.vimMode"
                    :mentions="state.mentions"
                    :is-user-scroll-cm-editor="state.isUserScrollCmEditor"
                    :heading-show-current-index="state.headingShowCurrentIndex"
                    :toc-markdown="state.tocMarkdown"
                    :cm-command="state.cmCommand"
                    :is-watch-mouse="true"
                    :init-doc-is-empty="state.initDocIsEmpty"
                    :placeholder-text="placeholderText"
                    :mdlint-use-worker="mdlintUseWorker"
                    :mdlint-rules="rules"
                    :theme="theme"
                    @handle-scroll="handleScroll"
                    @is-mouse-in-element="handleMouseInCmEditor"
                    @update-editor-doc="updateEditorDoc"
                    @update-is-user-scroll="handleUpdateIsUserScrollCmEditor"
                />
            </div>

            <!-- 预览 -->
            <div class="md-preview md-container-item" v-show="state.previewShow">
                <HtmlPreview
                    :html="state.html"
                    :img-urls="state.imgUrls"
                    :is-show-el-image-viewer="state.isShowElImageViewer"
                    :is-show-preview-wechat="state.isShowPreviewWechat"
                    :is-user-scroll-preview="state.isUserScrollPreview"
                    :height="cmHeight"
                    :heading-show-current-index="state.headingShowCurrentIndex"
                    :is-watch-mouse="true"
                    scroll-method="scrollTo"
                    :view-command="state.viewCommand"
                    :post-id="localPostId"
                    :is-admin-video="isAdminVideo"
                    :is-paid="localIsPaid"
                    :pay-strategy="localPayStrategy"
                    :price="localPrice"
                    :video-toc="videoToc"
                    @show-image-viewer="showImageViewer"
                    @close-image-viewer="closeImageViewer"
                    @is-mouse-in-element="handleMouseInPreview"
                    @heading-show-current="handleHeadingShowCurrent"
                    @update-is-user-scroll="handleUpdateIsUserScrollPreview"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "vue3-emoji-picker/css"

import { type Extension } from "@codemirror/state"
import { computed, useTemplateRef, watch } from "vue"

import { PayStrategy, type PostVideoTocTree } from "@/api/post/common"
import { getTheme, type MarkdownRulesConfig, Theme, ThemeMode } from "@/pkg/codemirror"

import EditorCodemirror, { type CodemirrorRef } from "./components/codemirror"
import HtmlPreview from "./components/preview/index.vue"
import EditorToc from "./components/toc"
import Toolbar from "./components/toolbar"
import { useCodemirror, usePreview, useToolbar } from "./hooks"
import { EditorStateManager } from "./state"

// 文章编辑器命名
defineOptions({ name: "JEditor" })

const {
    stateManager,
    postId = "",
    isAdminVideo = false,
    isPaid = false,
    payStrategy = PayStrategy.All,
    price = "",
    videoToc = [],
    placeholderText = "",
    mdlintUseWorker = true,
    mdlintRules: rules = {
        rule002: false, // 默认不启用规则 002
        rule003: false, // 默认不启用规则 003
    },
    theme = getTheme(Theme.MD, ThemeMode.Light),
} = defineProps<{
    stateManager: EditorStateManager
    postId?: string // 文章ID
    isAdminVideo?: boolean // 是否使用管理员视频接口
    isPaid?: boolean // 是否付费阅读
    payStrategy?: PayStrategy // 付费策略
    price?: string // 价格(单位：分)
    videoToc?: PostVideoTocTree[] // 付费视频目录
    placeholderText?: string // 占位符文本
    mdlintUseWorker?: boolean // 是否使用 web worker 进行 lint 检查
    mdlintRules?: MarkdownRulesConfig // Markdown 规则配置
    theme?: Extension // 主题
}>()

const emit = defineEmits<{
    (event: "updateEditorStatus", val: boolean): void
}>()

const state = stateManager.getState()

const localPostId = computed(() => postId)
const localIsPaid = computed(() => isPaid)
const localPayStrategy = computed(() => payStrategy)
const localPrice = computed(() => price)

// ref
const mdLayoutRef = useTemplateRef<HTMLElement | null>("mdLayoutRef") //编辑器布局
const mdContainerRef = useTemplateRef<HTMLElement | null>("mdContainerRef") //编辑器容器
const codemirrorRef = useTemplateRef<CodemirrorRef | null>("codemirrorRef") //编辑器

// 工具栏点击事件
const { toolbarBtns, toolbarBtnClicked, updateMdContainerStyle, insertPay, emojiPickerSelected, insertTableRowCol, insertAlert } = useToolbar(
    mdLayoutRef,
    mdContainerRef,
    stateManager,
)

/**
 * @description: 目录导航点击事件
 * @param index 点击的目录索引
 */
const tocHeadingClicked = (index: number) => {
    // 将用户手动滚动的状态设置为 false
    stateManager.setIsUserScrollPreview(false)
    stateManager.setIsUserScrollCmEditor(false)
    stateManager.setHeadingShowCurrentIndex(index) // 设置当前目录索引
}

// codemirror
const { cmHeight, handleScroll, handleUpdateIsUserScrollCmEditor, handleMouseInCmEditor } = useCodemirror(mdContainerRef, codemirrorRef, stateManager)

const updateEditorDoc = (editorDoc: string) => {
    stateManager.updateState(editorDoc) // 更新 store 中的 editor
    emit("updateEditorStatus", true) // 更新编辑器状态
}

/**
 * 将外部修复后的完整内容回写到编辑器与预览状态.
 * @param editorDoc 修复后的 Markdown 内容.
 * @returns void.
 */
const replaceContent = (editorDoc: string) => {
    codemirrorRef.value?.replaceContent(editorDoc)
    stateManager.updateState(editorDoc)
    emit("updateEditorStatus", true)
}

// preview
const { showImageViewer, closeImageViewer, handleMouseInPreview, handleHeadingShowCurrent, handleUpdateIsUserScrollPreview } = usePreview(stateManager)

// 监听编辑器宽度变化
watch(
    () => state.width,
    (newWidth) => {
        document.documentElement.style.setProperty("--md-editor-width", `${newWidth}px`)
    },
)

// 暴露给父组件的属性
defineExpose({
    codemirror: codemirrorRef,
    replaceContent,
})
</script>

<style scoped lang="scss">
// 全屏样式
.web__fullscreen {
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

    .md-container,
    .md-container-comment {
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
            background-color: var(--jpz-bg-color);
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

        .md-container-comment {
            height: pc.$editor-md-container-height-comment;

            .md-editor {
                // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
                --md-editor-height: #{pc.$editor-md-container-height-comment};
            }

            .md-preview {
                height: pc.$editor-md-container-height-comment;
            }
        }
    }

    .web__fullscreen {
        .md-toolbar {
            --icon-number-per-line: 30;
        }

        .md-container,
        .md-container-comment {
            height: var(--md-editor-container-height-fullscreen);

            .md-toc,
            .md-editor,
            .md-preview {
                height: var(--md-editor-container-height-fullscreen);
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
            height: pad.$editor-md-container-height;

            .md-editor {
                // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
                --md-editor-height: #{pad.$editor-md-container-height};
            }

            .md-preview {
                height: pad.$editor-md-container-height;
            }
        }

        .md-container-comment {
            height: pad.$editor-md-container-height-comment;

            .md-editor {
                // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
                --md-editor-height: #{pad.$editor-md-container-height-comment};
            }

            .md-preview {
                height: pad.$editor-md-container-height-comment;
            }
        }
    }

    .web__fullscreen {
        .md-toolbar {
            --icon-number-per-line: 20;
        }

        .md-container,
        .md-container-comment {
            height: var(--md-editor-container-height-fullscreen);

            .md-toc,
            .md-editor,
            .md-preview {
                height: var(--md-editor-container-height-fullscreen);
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

        .md-container-comment {
            height: phone.$editor-md-container-height-comment;

            .md-editor {
                // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
                --md-editor-height: #{phone.$editor-md-container-height-comment};
            }

            .md-preview {
                height: phone.$editor-md-container-height-comment;
            }
        }
    }

    .web__fullscreen {
        .md-toolbar {
            --icon-number-per-line: 15;
        }

        .md-container,
        .md-container-comment {
            height: var(--md-editor-container-height-fullscreen);

            .md-toc,
            .md-editor,
            .md-preview {
                height: var(--md-editor-container-height-fullscreen);
            }
        }
    }
}
</style>
