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
            <header class="md-page-header">
                <div class="md-page-title-block">
                    <p class="md-page-eyebrow">公共编辑空间</p>
                    <h1 class="md-page-title">Markdown 编辑器</h1>
                </div>

                <div class="md-page-actions">
                    <div class="md-page-controls">
                        <ThemePresetSelector :model-value="activeThemePreset" :presets="themePresetOptions" @update:model-value="selectThemePreset" />

                        <button type="button" class="md-page-home-btn" aria-label="返回首页" title="返回首页" @click="goHome">
                            <span class="md-page-home-btn__icon">
                                <j-icon :name="IconKeys.Home" custom-class="md-page-home-btn__icon-svg" />
                            </span>
                        </button>
                    </div>

                    <div class="md-page-save-status" :data-status="saveStatus.type">
                        <span class="md-page-save-dot"></span>
                        <span>{{ saveStatus.text }}</span>
                    </div>
                </div>
            </header>

            <div class="md-page-editor-wrap">
                <JEditor
                    :state-manager="stateManager"
                    :is-enable-copy-cache="false"
                    :placeholder-text="placeholderText"
                    :theme="theme"
                    :image-upload-handler="null"
                />
            </div>
        </div>
    </section>

    <FooterStatistics v-if="optionsStore.isShowFooterStatistics" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { debounce } from "throttle-debounce"
import { onBeforeUnmount, onMounted, reactive, watch } from "vue"
import { useRouter } from "vue-router"

import { IconKeys } from "@/components/common/icons"
import JEditor, { defaultCommandKeys, EditorStateManager } from "@/components/editor"
import { RouteNames } from "@/router"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { loadPublicMdDraft, savePublicMdDraft } from "@/stores/md-draft"
import { useTheme } from "@/theme/useTheme"
import ThemePresetSelector from "@/theme/preset-selector"
import { useOptionsStore } from "@/stores/options"

defineOptions({ name: "PublicMarkdownPage" })

type SaveStatus = {
    text: string
    type: "idle" | "saved" | "error"
}

const placeholderText = "开始输入 Markdown..."

const router = useRouter()
const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)
const { activeThemePreset, selectThemePreset, theme, themePresetOptions } = useTheme()
const optionsStore = useOptionsStore()

const stateManager = new EditorStateManager({
    tocShow: true,
})

const editorState = stateManager.getState()

const saveStatus = reactive<SaveStatus>({
    text: "本地草稿未修改",
    type: "idle",
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

applyDraftToEditor()

onMounted(() => {
    toggleFullscreenRouteClass(true)
})

watch(
    () => device.value,
    (currentDevice) => {
        if (currentDevice === DeviceType.PC) {
            stateManager.setCommandKeys(defaultCommandKeys.publicMdPc)
            return
        }

        if (currentDevice === DeviceType.PAD) {
            stateManager.setCommandKeys(defaultCommandKeys.publicMdPad)
            return
        }

        stateManager.setCommandKeys(defaultCommandKeys.publicMdPhone)
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

.md-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 20px 0;
}

.md-page-title-block {
    max-width: 760px;
}

.md-page-eyebrow {
    margin: 0 0 7px;
    color: var(--jpz-color-primary);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}

.md-page-title {
    margin: 0;
    color: var(--jpz-text-color-primary);
    font-size: clamp(28px, 3.3vw, 38px);
    line-height: 1.08;
    font-family: Georgia, "Times New Roman", serif;
}

.md-page-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    min-width: 132px;
    padding-top: 2px;
}

.md-page-controls {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.md-page-save-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid color-mix(in srgb, var(--jpz-border-color) 88%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--jpz-bg-color) 92%, transparent);
    color: var(--jpz-text-color-regular);
    font-size: 12px;
}

.md-page-save-status[data-status="saved"] {
    color: var(--jpz-color-success);
}

.md-page-save-status[data-status="error"] {
    color: var(--jpz-color-danger);
}

.md-page-save-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 0 5px color-mix(in srgb, currentColor 14%, transparent);
}

.md-page-home-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    padding: 0;
    border: 1px solid var(--jpz-border-color);
    border-radius: 999px;
    background: color-mix(in srgb, var(--jpz-bg-color) 88%, var(--jpz-color-primary) 12%);
    color: var(--jpz-text-color-primary);
    cursor: pointer;
    transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease,
        box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        border-color: var(--jpz-color-primary);
        background: color-mix(in srgb, var(--jpz-bg-color) 72%, var(--jpz-color-primary) 28%);
        box-shadow: 0 12px 24px color-mix(in srgb, var(--jpz-box-shadow) 18%, transparent);
    }
}

.md-page-home-btn__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.md-page-home-btn__icon-svg {
    width: 16px;
    height: 16px;
    fill: var(--jpz-color-primary);
}

.md-page-editor-wrap {
    position: relative;
    min-height: 0;
    overflow: hidden;
}

.md-page-editor-wrap :deep(.md-layout) {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    height: 100%;
    min-height: 0;
    background: transparent;
}

.md-page-editor-wrap :deep(.md-toolbar) {
    flex: 0 0 auto;
    margin-bottom: 10px;
}

.md-page-editor-wrap :deep(.md-container),
.md-page-editor-wrap :deep(.md-container-comment) {
    min-height: 0;
    height: 100% !important;
}

.md-page-editor-wrap :deep(.md-toc),
.md-page-editor-wrap :deep(.md-editor),
.md-page-editor-wrap :deep(.md-preview) {
    height: 100% !important;
}

.md-page-editor-wrap :deep(.md-editor) {
    --md-editor-height: 100%;
}

.md-page-editor-wrap :deep(#jpz-codemirror),
.md-page-editor-wrap :deep(#preview),
.md-page-editor-wrap :deep(#preview-copy),
.md-page-editor-wrap :deep(.cm-editor),
.md-page-editor-wrap :deep(.cm-scroller) {
    height: 100% !important;
}

@include respond-to("phone") {
    .md-page-panel {
        gap: 12px;
    }

    .md-page-header {
        flex-direction: column;
        gap: 12px;
        padding: 14px 14px 0;
    }

    .md-page-actions {
        align-items: stretch;
        min-width: 100%;
        padding-top: 0;
    }

    .md-page-controls {
        justify-content: space-between;
    }

    .md-page-home-btn {
        width: 36px;
        height: 36px;
    }
}
</style>
