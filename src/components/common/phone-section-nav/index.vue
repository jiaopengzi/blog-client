<!--
 * FilePath    : bf\c:\Desktop\blog-client\src\components\common\phone-section-nav\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 由于原生的 Tabs 组件在 phone 端导航效果表现不佳, 因此自定义了一个适用于手机端的分区导航组件;
                 该组件支持水平滚动, 适合在手机屏幕较小的情况下使用.
                 用户可以通过点击不同的导航项来切换不同的内容区域, 提供更好的用户体验.
-->

<template>
    <div class="phone-section-nav" :aria-label="ariaLabel">
        <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            class="phone-section-nav__item"
            :class="{ 'is-active': activeValue === tab.value }"
            @click="emit('change', tab.value)"
        >
            <el-icon v-if="tab.icon" class="phone-section-nav__icon">
                <component :is="tab.icon" />
            </el-icon>
            <span>{{ tab.label }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import type { PhoneSectionNavItem } from "./types"

defineOptions({ name: "CommonPhoneSectionNav" })

const {
    tabs,
    activeValue,
    ariaLabel = "分区导航",
} = defineProps<{
    tabs: PhoneSectionNavItem[]
    activeValue: string
    ariaLabel?: string
}>()

// change 事件在切换导航项时抛出选中的 value.
const emit = defineEmits<{
    (event: "change", value: string): void
}>()
</script>

<style scoped lang="scss">
.phone-section-nav {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow-x: auto;
    padding: 0 12px 6px;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }

    &__item {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 40px;
        padding: 0 14px;
        border: 1px solid var(--jpz-border-color);
        border-radius: 999px;
        background: var(--jpz-bg-color-page);
        color: var(--jpz-text-color-secondary);
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s ease;

        &.is-active {
            border-color: var(--jpz-color-primary);
            background: color-mix(in srgb, var(--jpz-color-primary) 18%, var(--jpz-bg-color));
            color: var(--jpz-color-primary);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        }
    }

    &__icon {
        font-size: 16px;
    }
}
</style>
