<!--
 * FilePath    : blog-client-nuxt\src\components\views\md\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 公用 Markdown 编辑页面, 包含本地图片清空确认层级处理
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

    <MdCustomizer
        v-model:visible="showCustomizer"
        :local-image-usage="localImageUsage"
        @settings-changed="onMdCustomSettingsChanged"
        @purge-local-images="handlePurgeLocalImages"
        @clear-local-images="handleClearLocalImages"
    />

    <FooterStatistics v-if="optionsStore.isShowFooterStatistics" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { debounce } from "throttle-debounce"
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue"

import FooterStatistics from "@/components/layout/footer-statistics"
import { loadArticleEditorVisibilityState, saveArticleEditorVisibilityState } from "@/components/editor/article-layout"
import { defaultCommandKeys, EditorStateManager } from "@/components/editor"
import { getFirstLevelOneMarkdownHeadingText, markdownRenderCache } from "@/components/editor/utils"
import { ImageCaptionFormat, setImageCaptionFormat } from "@/pkg/marked/extension/renderer"
import { RouteNames } from "@/router"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { loadMdCustomState } from "@/stores/md-custom"
import { useTheme } from "@/theme/useTheme"
import { useOptionsStore } from "@/stores/options"
import { confirmCommon } from "@/utils/confirm"
import {
    formatLocalImageBytes,
    gcUnreferencedLocalImages,
    getLocalImageUsage,
    hydrateLocalImagesForMarkdown,
    purgeAllLocalImages,
    stripLocalImageRefs,
    type LocalImageUsage,
} from "@/utils/mdLocalImage"
import { MessageUtil } from "@/utils/message"

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
const mdCustomizerOverlayZIndex = 10000
const mdCustomizerFeedbackClass = "md-page-customizer-feedback"

const router = useRouter()
const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)
const { activeThemePreset, selectThemePreset, theme, themePresetOptions } = useTheme()
const optionsStore = useOptionsStore()
const storedArticleEditorVisibility = loadArticleEditorVisibilityState()
const hasStoredArticleEditorVisibility = storedArticleEditorVisibility !== null

const stateManager = new EditorStateManager(storedArticleEditorVisibility ?? { tocShow: false })

// lastSyncedDevice 用于跟踪上一次同步布局的设备类型, 避免重复设置编辑器显示状态
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
 * toggleFullscreenRouteClass 为 /md 页面切换全屏布局所需的全局类名
 * 该页面需要绕过站点默认的 body 居中与 #app 最大宽度限制, 才能真正铺满浏览器
 * @param enabled - true 表示添加全局类名, false 表示移除全局类名
 * @returns 无返回值
 */
function toggleFullscreenRouteClass(enabled: boolean): void {
    document.body.classList.toggle("md-page-route", enabled)
    document.documentElement.classList.toggle("md-page-route", enabled)
    document.getElementById("app")?.classList.toggle("md-page-route", enabled)
    document.querySelector("section.app")?.classList.toggle("md-page-route", enabled)
}

/**
 * goHome 返回首页
 * @returns 无返回值
 */
function goHome(): void {
    void router.push({ name: RouteNames.Home })
}

/**
 * syncEditorLayoutByDevice 根据设备类型同步工具栏与预览布局
 * 当设备类型切换时, 会同步工具栏按钮集合
 * 首次进入且不存在本地缓存时, 手机端默认仅展示编辑区, 平板与桌面端默认同时展示编辑区和预览区
 * @param currentDevice - 当前设备类型
 * @returns 无返回值
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
 * applyDraftToEditor 将本地草稿回填到编辑器状态中
 * @returns 无返回值
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
 * persistDraft 将当前内容保存到本地草稿
 * @param content - 当前 Markdown 内容
 * @returns 无返回值
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
 * applyDraftToEditor 执行页面初始化阶段的纯状态准备工作
 * 该步骤需要先于 editorContent 相关 watch 注册, 避免草稿回填被误判为一次新的用户编辑
 */
applyDraftToEditor()

/**
 * applyMdCustomSettings 加载并应用用户自定义的 MD 页面设置
 * @returns 无返回值
 */
function applyMdCustomSettings(): void {
    const custom = loadMdCustomState()

    setImageCaptionFormat(custom.imageCaptionFormat as ImageCaptionFormat)

    if (editorState.editorContent) {
        stateManager.updateState(editorState.editorContent)
    }
}

/**
 * onMdCustomSettingsChanged 当用户自定义设置变更时重新渲染预览
 * @returns 无返回值
 */
function onMdCustomSettingsChanged(): void {
    applyMdCustomSettings()
}

/**
 * persistArticleEditorVisibility 保存文章编辑器当前栏位显示状态
 * @returns 无返回值
 */
function persistArticleEditorVisibility(): void {
    saveArticleEditorVisibilityState({
        tocShow: editorState.tocShow,
        editorShow: editorState.editorShow,
        previewShow: editorState.previewShow,
    })
}

/**
 * hydrateLocalImages 恢复本地图片的 blob URL 注册表并在有图片时触发一次重渲染.
 * 草稿回填是同步的, 首帧渲染时注册表尚未就绪, 本地图片以透明占位呈现;
 * IndexedDB 读取完成后重建注册表并按当前草稿做垃圾回收, 再重渲染替换为真实图片.
 * @returns 无返回值.
 */
async function hydrateLocalImages(): Promise<void> {
    const registered = await hydrateLocalImagesForMarkdown(editorState.editorContent)
    await refreshLocalImageUsage()
    if (registered > 0) {
        // 首帧渲染(占位 src)已被 editor/utils 的 LRU 渲染缓存收录, 相同内容重渲染会命中缓存
        // 跳过替换; 先清缓存再 updateState 强制重跑渲染管线, md-img: 引用才能替换为 blob URL
        markdownRenderCache.clear()
        stateManager.updateState(editorState.editorContent)
    }
}

// 本地图片库用量, 供自定义面板展示 (hydrate / 清理动作 / 打开面板时刷新)
const localImageUsage = ref<LocalImageUsage>({ count: 0, totalBytes: 0 })

/**
 * refreshLocalImageUsage 重新统计本地图片库用量.
 * @returns 无返回值.
 */
async function refreshLocalImageUsage(): Promise<void> {
    localImageUsage.value = await getLocalImageUsage()
}

/**
 * handlePurgeLocalImages 清理当前文档未引用的本地图片 (自定义面板"清理未引用图片"入口).
 * @returns 无返回值.
 */
function handlePurgeLocalImages(): void {
    void (async () => {
        const result = await gcUnreferencedLocalImages(editorState.editorContent)
        await refreshLocalImageUsage()
        if (result.removedCount > 0) {
            MessageUtil.success(`已清理 ${result.removedCount} 张未引用的本地图片 (释放 ${formatLocalImageBytes(result.removedBytes)})`, 5000, {
                customClass: mdCustomizerFeedbackClass,
            })
        } else {
            MessageUtil.info("当前没有可清理的未引用图片", 4000, { customClass: mdCustomizerFeedbackClass })
        }
    })()
}

/**
 * handleClearLocalImages 清空全部本地图片并移除文档中的引用 (自定义面板"清空全部图片"入口).
 * 二次确认后执行: 清库 → 剥离文档引用 → 重渲染 (内容 watch 自动保存草稿).
 * @returns 无返回值.
 */
function handleClearLocalImages(): void {
    void confirmCommon(
        "将清空本浏览器中全部 /md 本地图片, 并移除当前文档中的本地图片引用, 此操作不可恢复。是否继续?",
        () => {
            void (async () => {
                const result = await purgeAllLocalImages()
                const nextContent = stripLocalImageRefs(editorState.editorContent)
                if (nextContent !== editorState.editorContent) {
                    stateManager.updateState(nextContent)
                }
                await refreshLocalImageUsage()
                MessageUtil.success(`已清空 ${result.removedCount} 张本地图片 (释放 ${formatLocalImageBytes(result.removedBytes)})`, 5000, {
                    customClass: mdCustomizerFeedbackClass,
                })
            })()
        },
        () => {
            MessageUtil.info("已取消清空", 3000, { customClass: mdCustomizerFeedbackClass })
        },
        { modalClass: "md-page-local-image-clear-confirm" },
    )
}

onMounted(() => {
    toggleFullscreenRouteClass(true)
    applyMdCustomSettings()
    void hydrateLocalImages()
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

// 打开自定义面板时刷新本地图片用量, 展示最新的存储状态
watch(showCustomizer, (visible) => {
    if (visible) {
        void refreshLocalImageUsage()
    }
})

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

// Element Plus 的 MessageBox 展示时会重设内联 z-index, 必须通过专属遮罩类覆盖.
:global(.md-page-local-image-clear-confirm) {
    z-index: 10001 !important;
}

// Element Plus 的 Message 会覆盖传入 z-index, 使用专属类确保反馈消息在自定义面板之上.
:global(.md-page-customizer-feedback) {
    z-index: 10001 !important;
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
    background: color-mix(in srgb, var(--jpz-bg-color-page) 96%, var(--jpz-bg-color) 4%);
}

@include respond-to("phone") {
    .md-page-panel {
        gap: 12px;
    }
}
</style>
