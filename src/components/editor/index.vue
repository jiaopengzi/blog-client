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
                :toolbar-btns="mergedToolbarBtns"
                :vim-mode="state.vimMode"
                @toolbar-btn-clicked="toolbarBtnClicked"
                @external-toolbar-btn-clicked="handleExternalToolbarBtnClicked"
                @heading-select="toolbarBtnClicked"
                @pay-select="insertPay"
                @emoji-picker-selected="emojiPickerSelected"
                @table-row-col="insertTableRowCol"
                @alert-select="insertAlert"
                @tool-select="toolbarBtnClicked"
                @tool-settings="openSettingsDialog"
                @vim-mode-change="setVimMode"
                @vim-settings="openSettingsDialog"
                @toolbar-height="updateMdContainerStyle"
            />
        </div>

        <!-- 编辑器容器 -->
        <div
            ref="mdContainerRef"
            :class="[state.mode === 'post' ? 'md-container' : 'md-container-comment', { 'is-resize-disabled': !isPaneResizeEnabled }]"
            :style="mdContainerStyle"
        >
            <!-- 导航栏 -->
            <div class="md-toc md-container-item" v-show="state.tocShow">
                <EditorToc :headings="visibleTocHeadings" :heading-show-current-index="visibleHeadingShowCurrentIndex" @heading-clicked="tocHeadingClicked" />
            </div>

            <!-- 分隔条 -->
            <EditorResizeHandle
                v-if="state.tocShow && (state.editorShow || state.previewShow) && isPaneResizeEnabled"
                :is-dragging="activeResize !== null"
                :label="state.editorShow ? '调整目录与编辑区宽度' : '调整目录与预览区宽度'"
                @resize-start="startPaneResize($event, 'toc', state.editorShow ? 'editor' : 'preview')"
                @restore-default="restoreDefaultPaneRatios"
            />

            <!-- 编辑器 -->
            <div class="md-editor md-container-item" v-show="state.editorShow">
                <EditorCodemirror
                    ref="codemirrorRef"
                    :doc="state.editorContent"
                    :height="cmHeight"
                    :vim-mode="state.vimMode"
                    :vim-mappings="state.vimMappings"
                    :vim-ime-port="state.vimImePort"
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
                    :image-upload-handler="imageUploadHandler"
                    @handle-scroll="handleScroll"
                    @is-mouse-in-element="handleMouseInCmEditor"
                    @update-editor-doc="updateEditorDoc"
                    @update-is-user-scroll="handleUpdateIsUserScrollCmEditor"
                />
            </div>

            <!-- 分隔条 -->
            <EditorResizeHandle
                v-if="state.editorShow && state.previewShow && isPaneResizeEnabled"
                :is-dragging="activeResize !== null"
                label="调整编辑区与预览区宽度"
                @resize-start="startPaneResize($event, 'editor', 'preview')"
                @restore-default="restoreDefaultPaneRatios"
            />

            <!-- 预览 -->
            <div class="md-preview md-container-item" v-show="state.previewShow">
                <HtmlPreview
                    ref="htmlPreviewRef"
                    :html="state.html"
                    :img-urls="state.imgUrls"
                    :preview-root-class-name="previewRootClassName"
                    :is-enable-copy-cache="isEnableCopyCache"
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

        <SettingsDialog
            v-model="settingsDialogVisible"
            :command="settingsDialogCommand"
            @close="settingsDialogCommand = null"
            @vim-save="handleVimSettingsSave"
        />
    </div>
</template>

<script lang="ts" setup>
import "vue3-emoji-picker/css"

import { type Extension } from "@codemirror/state"
import { storeToRefs } from "pinia"
import { debounce } from "throttle-debounce"
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from "vue"

import { PayStrategy, type PostVideoTocTree } from "@/api/post/common"
import type { MarkdownRulesConfig } from "@/pkg/codemirror/extension/mdlint/types"
import { getTheme, Theme, ThemeMode } from "@/pkg/codemirror/extension/theme"
import type { ImageUploadHandler } from "@/pkg/codemirror/options"
import { loadVimDefaults, type VimDefaults } from "@/stores/editor-defaults"
import { DeviceType, useDeviceStore } from "@/stores/device"

import { CommandsKey } from "./command"

import EditorCodemirror, { type CodemirrorRef } from "./components/codemirror"
import HtmlPreview from "./components/preview/index.vue"
import type { HtmlPreviewRef } from "./components/preview/types"
import EditorResizeHandle from "./components/resize-handle"
import SettingsDialog from "./components/settings"
import EditorToc from "./components/toc"
import Toolbar from "./components/toolbar"
import { mergeEditorToolbarButtons, type EditorExternalToolbarButton, type EditorToolbarButton } from "./components/toolbar"
import { useCodemirror, usePreview, useToolbar } from "./hooks"
import {
    buildEditorGridTemplate,
    clearEditorPaneRatios,
    DEFAULT_EDITOR_PANE_HANDLE_WIDTH,
    DEFAULT_EDITOR_PANE_RATIOS,
    type EditorPaneName,
    type EditorPaneRatios,
    loadEditorPaneRatios,
    resizeEditorPaneRatios,
    saveEditorPaneRatios,
} from "./layout"
import { EditorStateManager } from "./state"
import { getSafeHeadingCurrentIndex } from "./utils"

// 文章编辑器命名
defineOptions({ name: "JEditor" })

const {
    stateManager,
    postId = "",
    previewRootClassName = "",
    isEnableCopyCache = false,
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
    imageUploadHandler = void 0,
    externalToolbarButtons = [],
} = defineProps<{
    stateManager: EditorStateManager
    postId?: string // 文章ID
    previewRootClassName?: string // 预览根节点附加类名
    isEnableCopyCache?: boolean // 是否启用复制缓存预生成
    isAdminVideo?: boolean // 是否使用管理员视频接口
    isPaid?: boolean // 是否付费阅读
    payStrategy?: PayStrategy // 付费策略
    price?: string // 价格(单位：分)
    videoToc?: PostVideoTocTree[] // 付费视频目录
    placeholderText?: string // 占位符文本
    mdlintUseWorker?: boolean // 是否使用 web worker 进行 lint 检查
    mdlintRules?: MarkdownRulesConfig // Markdown 规则配置
    theme?: Extension // 主题
    imageUploadHandler?: ImageUploadHandler // 图片上传处理器
    externalToolbarButtons?: EditorExternalToolbarButton[] // 业务侧附加工具栏按钮
}>()

const emit = defineEmits<{
    (event: "updateEditorStatus", val: boolean): void
    (event: "external-toolbar-btn-clicked", name: string): void
}>()

const state = stateManager.getState()
const visibleTocHeadings = ref([...state.tocHtml])
const visibleHeadingShowCurrentIndex = ref(state.headingShowCurrentIndex)
const isTocRefreshPaused = ref(false)
const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)
const paneRatios = ref<EditorPaneRatios>(loadEditorPaneRatios() ?? { ...DEFAULT_EDITOR_PANE_RATIOS })
const activeResize = ref<{
    startX: number
    leftPane: EditorPaneName
    rightPane: EditorPaneName
    initialRatios: EditorPaneRatios
} | null>(null)

const localPostId = computed(() => postId)
const localIsPaid = computed(() => isPaid)
const localPayStrategy = computed(() => payStrategy)
const localPrice = computed(() => price)

const settingsDialogVisible = ref(false)
const settingsDialogCommand = ref<CommandsKey | null>(null)
const isPaneResizeEnabled = computed(() => device.value !== DeviceType.PHONE)
const mergedToolbarBtns = computed<EditorToolbarButton[]>(() => {
    return mergeEditorToolbarButtons(toolbarBtns.value, externalToolbarButtons)
})
const visiblePanes = computed<EditorPaneName[]>(() => {
    const panes: EditorPaneName[] = []

    if (state.tocShow) {
        panes.push("toc")
    }
    if (state.editorShow) {
        panes.push("editor")
    }
    if (state.previewShow) {
        panes.push("preview")
    }

    return panes
})
const mdContainerStyle = computed(() => {
    return {
        gridTemplateColumns: buildEditorGridTemplate(visiblePanes.value, paneRatios.value, isPaneResizeEnabled.value ? DEFAULT_EDITOR_PANE_HANDLE_WIDTH : 0),
    }
})

/**
 * persistPaneRatios 将当前三栏比例写入 localStorage。
 * @returns 无返回值。
 */
const persistPaneRatios = (): void => {
    saveEditorPaneRatios(paneRatios.value)
}

/**
 * restoreDefaultPaneRatios 一键恢复默认三栏宽度。
 * 恢复后直接清除本地缓存, 让后续进入编辑器时继续使用默认布局。
 * @returns 无返回值。
 */
const restoreDefaultPaneRatios = (): void => {
    paneRatios.value = { ...DEFAULT_EDITOR_PANE_RATIOS }
    clearEditorPaneRatios()
}

/**
 * syncPaneResizeInteraction 同步拖拽过程中的全局鼠标样式。
 * @param isDragging - 当前是否处于拖拽中。
 * @returns 无返回值。
 */
const syncPaneResizeInteraction = (isDragging: boolean): void => {
    document.body.style.cursor = isDragging ? "col-resize" : ""
    document.body.style.userSelect = isDragging ? "none" : ""
}

/**
 * handlePaneResize 根据拖拽位移更新三栏布局比例。
 * @param event - 当前 pointermove 事件。
 * @returns 无返回值。
 */
const handlePaneResize = (event: PointerEvent): void => {
    if (!activeResize.value || !mdContainerRef.value) {
        return
    }

    const { leftPane, rightPane, startX, initialRatios } = activeResize.value
    paneRatios.value = resizeEditorPaneRatios({
        ratios: initialRatios,
        visiblePanes: visiblePanes.value,
        leftPane,
        rightPane,
        containerWidth: mdContainerRef.value.clientWidth,
        deltaPx: event.clientX - startX,
        handleWidthPx: DEFAULT_EDITOR_PANE_HANDLE_WIDTH,
    })
}

/**
 * stopPaneResize 结束拖拽并持久化最新比例。
 * @returns 无返回值。
 */
const stopPaneResize = (): void => {
    if (!activeResize.value) {
        return
    }

    activeResize.value = null
    persistPaneRatios()
    syncPaneResizeInteraction(false)
    window.removeEventListener("pointermove", handlePaneResize)
    window.removeEventListener("pointerup", stopPaneResize)
    window.removeEventListener("pointercancel", stopPaneResize)
}

/**
 * startPaneResize 开始拖拽指定分隔条。
 * @param event - 当前 pointerdown 事件。
 * @param leftPane - 分隔条左侧栏位。
 * @param rightPane - 分隔条右侧栏位。
 * @returns 无返回值。
 */
const startPaneResize = (event: PointerEvent, leftPane: EditorPaneName, rightPane: EditorPaneName): void => {
    if (event.button !== 0 || !isPaneResizeEnabled.value) {
        return
    }

    activeResize.value = {
        startX: event.clientX,
        leftPane,
        rightPane,
        initialRatios: { ...paneRatios.value },
    }
    syncPaneResizeInteraction(true)
    window.addEventListener("pointermove", handlePaneResize)
    window.addEventListener("pointerup", stopPaneResize)
    window.addEventListener("pointercancel", stopPaneResize)
    event.preventDefault()
}

/**
 * syncVisibleTocState 同步目录的可视快照。
 * 将编辑器内部的实时目录状态回写到 TOC 展示层, 用于停止输入后恢复最新目录。
 * @returns 无返回值。
 */
const syncVisibleTocState = (): void => {
    visibleTocHeadings.value = [...state.tocHtml]
    visibleHeadingShowCurrentIndex.value = getSafeHeadingCurrentIndex(state.headingShowCurrentIndex, visibleTocHeadings.value.length)
}

/**
 * shouldSyncTocImmediately 判断当前编辑是否需要立刻同步 TOC 展示层.
 * 删除标题或当前高亮索引失效时, 不能继续冻结旧目录, 否则 active-marker 会残留在旧位置。
 * @returns true 表示本次需要立即同步, false 表示可继续沿用 debounce 冻结策略.
 */
const shouldSyncTocImmediately = (): boolean => {
    return state.tocHtml.length < visibleTocHeadings.value.length || state.headingShowCurrentIndex < 0
}

/**
 * resumeTocRefresh 在用户停止输入后恢复 TOC 展示刷新。
 * 通过 debounce 合并连续输入, 避免 active-marker 在编辑期间频繁跳动。
 * @returns 无返回值。
 */
const resumeTocRefresh = debounce(300, (): void => {
    isTocRefreshPaused.value = false
    syncVisibleTocState()
})

/**
 * pauseTocRefreshDuringEditing 在编辑期间暂停 TOC 的可视刷新。
 * 仅冻结目录展示层, 不影响内部 Markdown 解析和预览同步逻辑。
 * @returns 无返回值。
 */
const pauseTocRefreshDuringEditing = (): void => {
    isTocRefreshPaused.value = true
    resumeTocRefresh()
}

const openSettingsDialog = (name: CommandsKey) => {
    settingsDialogCommand.value = name
    settingsDialogVisible.value = true
}

/**
 * handleExternalToolbarBtnClicked 将业务侧附加按钮点击事件继续抛给父组件。
 * @param name - 当前点击的外部按钮标识。
 * @returns 无返回值。
 */
const handleExternalToolbarBtnClicked = (name: string): void => {
    emit("external-toolbar-btn-clicked", name)
}

/**
 * handleVimSettingsSave 在 Vim 设置保存后同步当前编辑器状态.
 * @param data - 最新 Vim 配置.
 * @returns 无返回值.
 */
const handleVimSettingsSave = (data: VimDefaults): void => {
    stateManager.setVimMode(data.enabled)
    stateManager.setVimMappings(data.mappings)
    stateManager.setVimImePort(data.imePort)
}

const persistedVimDefaults = loadVimDefaults()
if (persistedVimDefaults) {
    stateManager.setVimMode(persistedVimDefaults.enabled)
    stateManager.setVimMappings(persistedVimDefaults.mappings)
    stateManager.setVimImePort(persistedVimDefaults.imePort)
}

// ref
const mdLayoutRef = useTemplateRef<HTMLElement | null>("mdLayoutRef") // 编辑器布局
const mdContainerRef = useTemplateRef<HTMLElement | null>("mdContainerRef") // 编辑器容器
const codemirrorRef = useTemplateRef<CodemirrorRef | null>("codemirrorRef") // 编辑器
const htmlPreviewRef = useTemplateRef<HtmlPreviewRef | null>("htmlPreviewRef") // 预览

// 工具栏点击事件
const { toolbarBtns, toolbarBtnClicked, updateMdContainerStyle, insertPay, emojiPickerSelected, insertTableRowCol, insertAlert, setVimMode } = useToolbar(
    mdLayoutRef,
    mdContainerRef,
    stateManager,
    isEnableCopyCache,
    () => ({
        hasPreparedCopyCache: htmlPreviewRef.value?.hasPreparedCopyCache ?? false,
        copyPreparationInFlight: htmlPreviewRef.value?.copyPreparationInFlight ?? false,
    }),
)

/**
 * @description: 目录导航点击事件
 * @param index 点击的目录索引
 */
const tocHeadingClicked = (index: number) => {
    // 将用户手动滚动的状态设置为 false
    stateManager.setIsUserScrollPreview(false)
    stateManager.setIsUserScrollCmEditor(false)
    visibleHeadingShowCurrentIndex.value = index
    stateManager.setHeadingShowCurrentIndex(index) // 设置当前目录索引
}

// codemirror
const { cmHeight, handleScroll, handleUpdateIsUserScrollCmEditor, handleMouseInCmEditor } = useCodemirror(mdContainerRef, codemirrorRef, stateManager)

/**
 * updateEditorDoc 处理编辑器内容变更。
 * 在更新内部状态后暂时冻结 TOC 展示, 待用户停止输入后再统一同步目录。
 * @param editorDoc - 编辑器最新 Markdown 内容。
 * @returns 无返回值。
 */
const updateEditorDoc = (editorDoc: string) => {
    stateManager.updateState(editorDoc) // 更新 store 中的 editor

    if (shouldSyncTocImmediately()) {
        isTocRefreshPaused.value = false
        syncVisibleTocState()
    } else {
        pauseTocRefreshDuringEditing()
    }

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
    isTocRefreshPaused.value = false
    syncVisibleTocState()
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

watch(
    () => state.tocHtml,
    () => {
        if (isTocRefreshPaused.value && !shouldSyncTocImmediately()) {
            return
        }

        syncVisibleTocState()
    },
)

watch(
    () => state.headingShowCurrentIndex,
    (newIndex) => {
        if (isTocRefreshPaused.value && newIndex >= 0) {
            return
        }

        visibleHeadingShowCurrentIndex.value = getSafeHeadingCurrentIndex(newIndex, visibleTocHeadings.value.length)
    },
)

onBeforeUnmount(() => {
    stopPaneResize()
    resumeTocRefresh.cancel()
})

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
        display: grid;

        .md-container-item {
            border-radius: 3px;
            min-width: 0;
            min-height: 0;
        }

        .md-toc {
            overflow: auto;
        }

        .md-editor {
            overflow: hidden;
        }

        .md-preview {
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--jpz-bg-color);
        }

        &.is-resize-disabled {
            .md-preview {
                border-left: 1px solid var(--jpz-border-color);
            }
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
