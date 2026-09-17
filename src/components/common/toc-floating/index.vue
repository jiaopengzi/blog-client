<!--
 * FilePath    : blog-client\src\components\common\toc-floating\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 右侧浮动目录
-->

<!--
 沉浸层 z-index 1000 遮蔽侧栏目录, 以 1001 级浮层提供折叠/展开导航;
 去除与 Toc 内部重复的标题行;
 详情页目录同样由此右侧浮动承载, 不再放侧栏
-->

<template>
    <div class="toc-floating" :class="{ 'toc-floating--immersive': immersive }">
        <!-- 展开态: 浮动目录面板 (标题由 Toc 内部的 h2.toc-title 承担, 面板不再重复输出"目录", 260917-01-feedback#2) -->
        <div v-if="!isCollapsed" class="toc-floating-panel">
            <button class="toc-floating-close" type="button" aria-label="收起目录" @click="toggleCollapsed">
                <j-icon name="close" custom-class="toc-floating-close-icon" />
            </button>
            <!-- 滚动容器包住整个 Toc (标题随内容同滚): active-marker 绝对定位于 nav 内, 对齐不受滚动影响 -->
            <div class="toc-floating-body">
                <Toc :headings="tocHtml" :heading-show-current-index="tocHeadingShowCurrentIndex" @heading-clicked="tocHeadingClicked" />
            </div>
        </div>

        <!-- 折叠态: 悬浮按钮展示当前章节, 点击展开 -->
        <button v-else class="toc-floating-trigger" type="button" aria-label="展开目录" @click="toggleCollapsed">
            <j-icon name="toc" custom-class="toc-floating-trigger-icon" />
            <span class="toc-floating-current" :title="currentHeadingText">{{ currentHeadingText }}</span>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

import Toc from "@/components/editor/components/toc"
import { useTocNavigation } from "@/components/hooks/useTocNavigation"
import { LocalStorageKey } from "@/stores/local"
import { useStatusStore } from "@/stores/status"

defineOptions({ name: "TocFloating" })

// immersive: 是否沉浸阅读模式 — 决定落位 (普通详情避开 fixed header; 沉浸层已覆盖 header 可贴近视口顶)
const { immersive = false } = defineProps<{ immersive?: boolean }>()

const statusStore = useStatusStore()
const { tocHtml, tocHeadingShowCurrentIndex } = storeToRefs(statusStore)

// 目录点击导航: 与侧栏目录共用 (锚点写入 store + URL hash 更新 + 平滑滚动)
const { tocHeadingClicked } = useTocNavigation()

// 折叠态为默认 (沉浸阅读以专注为目的, 目录按需展开); 偏好经 localStorage 记忆,
// 组件随沉浸模式进出卸载/重挂载, 状态经存储延续 (仅客户端挂载, 无 SSR 差异)
const isCollapsed = ref(readCollapsedPreference())

/**
 * readCollapsedPreference 读取浮动目录折叠偏好.
 * @returns true 表示折叠 (默认), false 表示展开; 存储不可用或未记录时回退折叠态.
 */
function readCollapsedPreference(): boolean {
    if (typeof localStorage === "undefined") return true
    return localStorage.getItem(LocalStorageKey.TocFloatingCollapsed) !== "false"
}

/**
 * toggleCollapsed 切换折叠/展开并持久化偏好.
 * @returns 无返回值.
 */
function toggleCollapsed(): void {
    isCollapsed.value = !isCollapsed.value
    try {
        localStorage.setItem(LocalStorageKey.TocFloatingCollapsed, String(isCollapsed.value))
    } catch {
        // 隐私模式等场景写入失败仅影响跨会话记忆, 不影响本次交互
    }
}

// 当前章节名: 折叠态按钮展示, 索引越界或无数据时回退"目录"
const currentHeadingText = computed(() => {
    const heading = tocHtml.value[tocHeadingShowCurrentIndex.value]
    return heading?.text || "目录"
})
</script>

<style scoped lang="scss">
.toc-floating {
    position: fixed;
    // 普通详情模式: 避开 fixed header(88px), 与侧栏卡片吸顶同基准 (260917-01-feedback#3);
    // 沉浸层 1000 之上 (web__fullscreen 遮蔽侧栏), 与 immersive-backtop 同级区间, 低于 header(999) 被沉浸层覆盖、低于 el-overlay(2000) 不挡弹窗
    top: calc(#{pc.$height-header} + 16px);
    right: 24px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    // 沉浸模式: header 被沉浸层覆盖, 贴近视口顶部 (与 immersive-backtop 同区间)
    &.toc-floating--immersive {
        top: 24px;
    }
}

// 折叠态悬浮按钮
.toc-floating-trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 280px;
    padding: 6px 12px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 5px;
    background-color: var(--jpz-bg-color);
    color: var(--jpz-color-primary);
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    box-shadow: var(--jpz-box-shadow-lighter);

    &:hover {
        color: var(--jpz-color-secondary);
    }

    .toc-floating-trigger-icon {
        flex-shrink: 0;
    }
}

.toc-floating-current {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

// 展开态浮动面板
.toc-floating-panel {
    position: relative;
    width: 280px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 5px;
    background-color: var(--jpz-bg-color);
    box-shadow: var(--jpz-box-shadow-lighter);
}

// 收起按钮悬浮于 Toc 自带标题行的右侧, 不再单列标题行
.toc-floating-close {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 24px;
    fill: var(--jpz-color-primary);

    &:hover {
        color: var(--jpz-color-secondary);
    }
}

// 整个 Toc 作为滚动内容, 高亮 marker 随内容同滚保持对齐;
// 右上角收起按钮占位, 避免遮住首个目录条目
.toc-floating-body {
    max-height: calc(100vh - 120px);
    padding-right: 24px;
    overflow-y: auto;
}
</style>
