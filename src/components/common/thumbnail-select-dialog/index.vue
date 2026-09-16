<!--
 * FilePath    : blog-client\src\components\common\thumbnail-select-dialog\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 从候选缩略图中选择并预览大图的通用弹窗
-->

<template>
    <el-dialog v-model="isVisible" width="880px" top="8vh" class="thumbnail-select-dialog">
        <template #header>
            <h4 class="thumbnail-select-dialog__title">从文章中选择</h4>
        </template>

        <div v-if="options.length" class="thumbnail-select-dialog__grid">
            <div
                v-for="item in options"
                :key="`${item.index}-${item.url}`"
                class="thumbnail-select-dialog__item"
                :class="{ 'is-active': selectedUrl === item.url }"
            >
                <div class="thumbnail-select-dialog__select-target" @click="handleSelect(item.url)" @dblclick="handleDirectInsert(item.url)">
                    <el-image :src="item.url" fit="cover" class="thumbnail-select-dialog__image">
                        <template #error>
                            <div class="thumbnail-select-dialog__fallback">图片加载失败</div>
                        </template>
                    </el-image>
                </div>

                <div class="thumbnail-select-dialog__meta">
                    <span class="thumbnail-select-dialog__index">第 {{ item.index }} 张</span>
                    <span class="thumbnail-select-dialog__url">{{ item.url }}</span>
                </div>

                <div class="thumbnail-select-dialog__actions">
                    <el-button class="thumbnail-select-dialog__preview-btn" size="small" @click="handlePreview(item.url)">预览大图</el-button>
                </div>
            </div>
        </div>

        <el-empty v-else description="当前文章中还没有可选图片" />

        <template #footer>
            <el-button @click="isVisible = false">取消</el-button>
            <el-button type="primary" :disabled="!selectedUrl" @click="handleConfirm">确定</el-button>
        </template>
    </el-dialog>

    <el-image-viewer v-if="isShowImageViewer" :url-list="previewUrls" @close="closeImageViewer" />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"

import type { ThumbnailSelectOption } from "./types"

defineOptions({ name: "ThumbnailSelectDialog" })

const {
    visible = false,
    options = [],
    currentUrl = "",
} = defineProps<{
    visible?: boolean
    options?: ThumbnailSelectOption[]
    currentUrl?: string
}>()

const emit = defineEmits<{
    (event: "update:visible", value: boolean): void
    (event: "select", value: string): void
}>()

const isVisible = computed({
    get: () => visible,
    set: (value: boolean) => emit("update:visible", value),
})

const selectedUrl = ref("")
const isShowImageViewer = ref(false)
const previewUrls = ref<string[]>([])

/**
 * 根据当前缩略图和候选项同步弹窗默认选中值.
 * @returns void.
 */
const syncSelectedUrl = () => {
    const matchedUrl = options.find((item) => item.url === currentUrl)?.url
    selectedUrl.value = matchedUrl || options[0]?.url || ""
}

watch(
    () => visible,
    (value) => {
        if (value) {
            syncSelectedUrl()
        }
    },
    { immediate: true },
)

watch(
    () => options,
    () => {
        if (isVisible.value) {
            syncSelectedUrl()
        }
    },
    { deep: true },
)

/**
 * 记录用户当前点选的候选缩略图.
 * @param url 用户点选的图片 URL.
 * @returns void.
 */
const handleSelect = (url: string) => {
    selectedUrl.value = url
}

/**
 * 双击图片后直接确认插入, 降低选择成本.
 * @param url 用户双击的图片 URL.
 * @returns void.
 */
const handleDirectInsert = (url: string) => {
    selectedUrl.value = url
    emit("select", url)
    isVisible.value = false
}

/**
 * 打开当前候选图的大图预览.
 * @param url 需要预览的图片 URL.
 * @returns void.
 */
const handlePreview = (url: string) => {
    previewUrls.value = [url]
    isShowImageViewer.value = true
}

/**
 * 关闭大图预览.
 * @returns void.
 */
const closeImageViewer = () => {
    isShowImageViewer.value = false
    previewUrls.value = []
}

/**
 * 确认当前图片选择并回传给父组件更新缩略图.
 * @returns void.
 */
const handleConfirm = () => {
    if (!selectedUrl.value) {
        return
    }

    emit("select", selectedUrl.value)
    isVisible.value = false
}
</script>

<style scoped lang="scss">
.thumbnail-select-dialog__title {
    font-size: 18px;
    font-weight: 700;
    color: var(--jpz-text-color-primary);
}

.thumbnail-select-dialog__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 4px;
}

.thumbnail-select-dialog__item {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 12px;
    background: var(--jpz-bg-color-page);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;
}

.thumbnail-select-dialog__item:hover,
.thumbnail-select-dialog__item.is-active {
    border-color: var(--jpz-color-primary);
    box-shadow: 0 10px 24px color-mix(in srgb, var(--jpz-color-primary) 14%, transparent);
    transform: translateY(-1px);
}

.thumbnail-select-dialog__select-target {
    cursor: pointer;
}

.thumbnail-select-dialog__image,
.thumbnail-select-dialog__fallback {
    width: 100%;
    height: 148px;
    border-radius: 10px;
    overflow: hidden;
}

.thumbnail-select-dialog__fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--jpz-text-color-secondary);
    background: var(--jpz-fill-color-light);
    font-size: 13px;
}

.thumbnail-select-dialog__meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
}

.thumbnail-select-dialog__index {
    color: var(--jpz-text-color-primary);
    font-size: 14px;
    font-weight: 600;
}

.thumbnail-select-dialog__url {
    color: var(--jpz-text-color-secondary);
    font-size: 12px;
    line-height: 18px;
    word-break: break-all;
}

.thumbnail-select-dialog__actions {
    display: flex;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .thumbnail-select-dialog__grid {
        grid-template-columns: 1fr;
    }
}
</style>
