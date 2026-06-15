<!--
 * FilePath    : blog-client\src\views\md\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 公用 Markdown 编辑页面
-->

<template>
    <section class="md-page-shell">
        <div class="md-page-panel">
            <MdPageHeader
                :active-theme-preset="activeThemePreset"
                :theme-preset-options="themePresetOptions"
                :save-status="saveStatus"
                @select-theme-preset="selectThemePreset"
                @open-customizer="showCustomizer = true"
                @go-home="goHome"
            />

            <MdPageEditor :state-manager="stateManager" :placeholder-text="placeholderText" :theme="theme" />
        </div>
    </section>

    <MdCustomizer v-model:visible="showCustomizer" @settings-changed="onMdCustomSettingsChanged" />

    <FooterStatistics v-if="optionsStore.isShowFooterStatistics" />
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { storeToRefs } from "pinia"
import { debounce } from "throttle-debounce"
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"

import FooterStatistics from "@/components/layout/footer-statistics"
import { loadArticleEditorVisibilityState, saveArticleEditorVisibilityState } from "@/components/editor/article-layout"
import { defaultCommandKeys, EditorStateManager } from "@/components/editor"
import { getFirstLevelOneMarkdownHeadingText } from "@/components/editor/utils"
import { ImageCaptionFormat, setImageCaptionFormat } from "@/pkg/marked/extension/renderer"
import { RouteNames } from "@/router"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { loadMdCustomState } from "@/stores/md-custom"
import { useTheme } from "@/theme/useTheme"
import { useOptionsStore } from "@/stores/options"

import { loadPublicMdDraft, savePublicMdDraft } from "./localDraft"
import MdCustomizer from "./component/md-customizer"
import MdPageEditor from "./component/page-editor"
import MdPageHeader from "./component/page-header"

defineOptions({ name: "PublicMarkdownPage" })

type SaveStatus = {
    text: string
    type: "idle" | "saved" | "error"
}

const placeholderText = "开始输入 Markdown..."

const showCustomizer = ref(false)

const router = useRouter()
const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)
const { activeThemePreset, selectThemePreset, theme, themePresetOptions } = useTheme()
const optionsStore = useOptionsStore()
const storedArticleEditorVisibility = loadArticleEditorVisibilityState()
const hasStoredArticleEditorVisibility = storedArticleEditorVisibility !== null

const stateManager = new EditorStateManager(storedArticleEditorVisibility ?? { tocShow: false })

// lastSyncedDevice 用于跟踪上一次同步布局的设备类型, 避免重复设置编辑器显示状态。
let lastSyncedDevice: DeviceType | null = null

const editorState = stateManager.getState()
const headTitle = computed(() => {
    const firstLevelOneHeading = getFirstLevelOneMarkdownHeadingText(editorState.editorContent)

    return firstLevelOneHeading || "Markdown 编辑器"
})

const saveStatus = reactive<SaveStatus>({
    text: "本地草稿未修改",
    type: "idle",
})

useHead({
    title: headTitle,
})

/**
 * toggleFullscreenRouteClass 为 /md 页面切换全屏布局所需的全局类名。
 * 该页面需要绕过站点默认的 body 居中与 #app 最大宽度限制, 才能真正铺满浏览器。
 * @param enabled - true 表示添加全局类名, false 表示移除全局类名。
 * @returns 无返回值。
 */
function toggleFullscreenRouteClass(enabled: boolean): void {
    document.body.classList.toggle("md-page-route", enabled)
    document.documentElement.classList.toggle("md-page-route", enabled)
    document.getElementById("app")?.classList.toggle("md-page-route", enabled)
    document.querySelector("section.app")?.classList.toggle("md-page-route", enabled)
}

/**
 * goHome 返回首页。
 * @returns 无返回值。
 */
function goHome(): void {
    void router.push({ name: RouteNames.Home })
}

/**
 * syncEditorLayoutByDevice 根据设备类型同步工具栏与预览布局。
 * 当设备类型切换时, 会同步工具栏按钮集合。
 * 首次进入且不存在本地缓存时, 手机端默认仅展示编辑区, 平板与桌面端默认同时展示编辑区和预览区。
 * @param currentDevice - 当前设备类型。
 * @returns 无返回值。
 */
function syncEditorLayoutByDevice(currentDevice: DeviceType): void {
    if (currentDevice === DeviceType.PC) {
        stateManager.setCommandKeys(defaultCommandKeys.publicMdPc)
    } else if (currentDevice === DeviceType.PAD) {
        stateManager.setCommandKeys(defaultCommandKeys.publicMdPad)
    } else {
        stateManager.setCommandKeys(defaultCommandKeys.publicMdPhone)
    }

    if (lastSyncedDevice === null) {
        if (!hasStoredArticleEditorVisibility) {
            stateManager.setEditorShow(true)
            stateManager.setPreviewShow(currentDevice !== DeviceType.PHONE)
        }
        lastSyncedDevice = currentDevice
        return
    }

    if (lastSyncedDevice !== currentDevice) {
        stateManager.setEditorShow(true)
        stateManager.setPreviewShow(currentDevice !== DeviceType.PHONE)
        lastSyncedDevice = currentDevice
    }
}

/**
 * applyDraftToEditor 将本地草稿回填到编辑器状态中。
 * @returns 无返回值。
 */
function applyDraftToEditor(): void {
    const draft = loadPublicMdDraft()
    if (!draft || !draft.content) {
        return
    }

    stateManager.setInitDocIsEmpty(false)
    stateManager.updateState(draft.content)
    saveStatus.text = `本地草稿, 最近保存于 ${new Date(draft.updatedAt).toLocaleString("zh-CN", { hour12: false })}`
    saveStatus.type = "saved"
}

/**
 * persistDraft 将当前内容保存到本地草稿。
 * @param content - 当前 Markdown 内容。
 * @returns 无返回值。
 */
const persistDraft = debounce(400, (content: string): void => {
    try {
        const draft = savePublicMdDraft(content)
        saveStatus.text = `本地草稿, 最近保存于 ${new Date(draft.updatedAt).toLocaleString("zh-CN", { hour12: false })}`
        saveStatus.type = "saved"
    } catch (error) {
        console.error("保存 Markdown 草稿失败", error)
        saveStatus.text = "本地保存失败, 请检查浏览器存储空间"
        saveStatus.type = "error"
    }
})

/**
 * applyDraftToEditor 执行页面初始化阶段的纯状态准备工作。
 * 该步骤需要先于 editorContent 相关 watch 注册, 避免草稿回填被误判为一次新的用户编辑。
 * @returns 无返回值。
 */
applyDraftToEditor()

/**
 * applyMdCustomSettings 加载并应用用户自定义的 MD 页面设置。
 * @returns 无返回值。
 */
function applyMdCustomSettings(): void {
    const custom = loadMdCustomState()

    setImageCaptionFormat(custom.imageCaptionFormat as ImageCaptionFormat)

    if (editorState.editorContent) {
        stateManager.updateState(editorState.editorContent)
    }
}

/**
 * onMdCustomSettingsChanged 当用户自定义设置变更时重新渲染预览。
 * @returns 无返回值。
 */
function onMdCustomSettingsChanged(): void {
    applyMdCustomSettings()
}

/**
 * persistArticleEditorVisibility 保存文章编辑器当前栏位显示状态。
 * @returns 无返回值。
 */
function persistArticleEditorVisibility(): void {
    saveArticleEditorVisibilityState({
        tocShow: editorState.tocShow,
        editorShow: editorState.editorShow,
        previewShow: editorState.previewShow,
    })
}

onMounted(() => {
    toggleFullscreenRouteClass(true)
    applyMdCustomSettings()
})

watch(
    () => device.value,
    (currentDevice) => {
        syncEditorLayoutByDevice(currentDevice)
    },
    { immediate: true },
)

watch(
    () => editorState.editorContent,
    (content) => {
        saveStatus.text = content ? "正在自动保存到本地草稿..." : "本地草稿未修改"
        saveStatus.type = "idle"
        persistDraft(content)
    },
)

watch(
    () => [editorState.tocShow, editorState.editorShow, editorState.previewShow] as const,
    () => {
        persistArticleEditorVisibility()
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    persistDraft.cancel()
    toggleFullscreenRouteClass(false)
})
</script>

<style scoped lang="scss">
:global(html.md-page-route),
:global(body.md-page-route) {
    width: 100%;
    min-height: 100dvh;
    overflow: hidden;
}

:global(body.md-page-route) {
    display: block;
}

:global(#app.md-page-route),
:global(section.app.md-page-route) {
    width: 100%;
    max-width: none;
    min-height: 100dvh;
}

.md-page-shell {
    box-sizing: border-box;
    width: 100%;
    height: 100dvh;
    padding-inline: clamp(4px, 1vw, 8px);
    overflow: hidden;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--jpz-bg-color-page) 96%, var(--jpz-bg-color) 4%) 0%,
        color-mix(in srgb, var(--jpz-bg-color-page) 92%, var(--jpz-bg-color) 8%) 100%
    );
}

.md-page-panel {
    height: 100%;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 14px;
    overflow: hidden;
    // border-inline: 1px solid color-mix(in srgb, var(--jpz-border-color) 62%, transparent);
    background: color-mix(in srgb, var(--jpz-bg-color-page) 96%, var(--jpz-bg-color) 4%);
}

@include respond-to("phone") {
    .md-page-panel {
        gap: 12px;
    }
}
</style>
