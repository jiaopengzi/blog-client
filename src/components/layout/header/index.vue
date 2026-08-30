<!--
 * FilePath    : blog-client-nuxt\src\components\layout\header\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 头部
-->

<template>
    <transition name="header-bar">
        <header class="header-container" v-show="headerVisible">
            <!-- pc pad 结构共用 -->
            <div class="header-main-common">
                <Logo />
                <HeaderNav />
                <Search v-if="isShowSearch" @handle-search="handleSearch" />
                <!-- 占位 -->
                <div v-if="!isShowSearch" class="layout-search-placeholder"></div>
                <ThemePresetSelector :model-value="activeThemePreset" :presets="themePresetOptions" @update:model-value="selectThemePreset" />
                <Account />
            </div>
            <div class="header-main-phone">
                <button type="button" class="btn-menu phone-item" @click="phoneToggleNav">
                    <j-icon :name="IconKeys.Menu" custom-class="menu-icon" />
                </button>
                <Logo class="phone-item" />
                <Search v-if="isShowSearch" class="phone-item" @handle-search="handleSearch" />
                <!-- 占位 -->
                <div v-if="!isShowSearch" class="phone-item layout-search-placeholder"></div>
            </div>
        </header>
    </transition>

    <!-- 手机端的侧边栏, 需要在 header 外部, 让 header 不会被遮盖 -->
    <div v-if="phoneNavVisible" class="phone-nav-backdrop" @click="phoneToggleNav"></div>
    <div v-if="phoneNavVisible" class="phone-side-nav" :style="{ transform: phoneNavVisible ? 'translateX(0)' : 'translateX(-100%)' }">
        <HeaderNav />
    </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from "vue"

import { IconKeys } from "@/components/common/icons"
import ThemePresetSelector from "@/theme/preset-selector"
import type { ScrollData } from "@/components/hooks/useScroll"
import { useScrollActions } from "@/components/hooks/useScroll"
import { useTheme } from "@/theme/useTheme"
import HeaderNav from "@/components/layout/header-nav/index.vue" // 显式 .vue: Nuxt dev SSR (vite-node) 下目录 index.ts 的 re-export 可能解析为 undefined (计划坑位 8)

import Account from "../account"
import Logo from "../logo"
import Search from "../search"

defineOptions({ name: "HeaderBar" })

const { isShowSearch = true } = defineProps<{
    isShowSearch?: boolean
}>()

const emit = defineEmits<{
    (event: "handle-search", val: string): void
}>()

const { activeThemePreset, selectThemePreset, themePresetOptions } = useTheme()

const headerVisible = ref(true)

const phoneNavVisible = ref(false)

const phoneToggleNav = () => {
    phoneNavVisible.value = !phoneNavVisible.value
}

const handleSearch = (val: string) => {
    emit("handle-search", val)
}

// ======================================== 滚动条事件 ========================================

const scrollUpAction = () => {
    if (scrollData.value.speed > 100 || scrollData.value.position < 200) {
        headerVisible.value = true
    }
}

const scrollDownAction = () => {
    if (scrollData.value.speed > 100 && scrollData.value.position > 400) {
        headerVisible.value = false
    }
}

const scrollData: Ref<ScrollData> = useScrollActions(scrollUpAction, scrollDownAction)
// ======================================== 滚动条事件 ========================================
</script>

<style scoped lang="scss">
// header-bar 动画
.header-bar-enter-active {
    transition: all 0.6s ease-out;
}

.header-bar-enter-from,
.header-bar-leave-to {
    transform: translateY(-100%);
    transition: all 0.6s ease-out;
    opacity: 0;
}

// 公共样式
.header-container {
    position: fixed;
    top: 0;
    left: -1;
    background-color: var(--jpz-bg-color);
}

.header-main-common {
    display: grid;
    grid-template-columns: auto 1fr auto auto auto;
    align-items: center;
    gap: 20px;
}

.layout-search-placeholder {
    width: 40px;
    height: 40px;
}

@include respond-to("pc") {
    .header-container {
        width: pc.$width-header;
        height: pc.$height-header;
    }
    .header-main-common {
        width: pc.$width-page-main;
        height: pc.$height-header;
        margin: 0 auto;
    }

    // 隐藏 phone 结构
    .header-main-phone {
        display: none;
    }
}

@include respond-to("pad") {
    .header-container {
        width: pad.$width-header;
        height: pad.$height-header;
    }
    .header-main-common {
        width: pad.$width-page;
        height: pad.$height-header;
    }

    // 隐藏 phone 结构
    .header-main-phone {
        display: none;
    }
}

@include respond-to("phone") {
    .header-container {
        width: 100%;
        height: phone.$height-header;
    }

    .header-main-phone {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100vw;
        height: phone.$height-header;
        .phone-item {
            margin: 5%;
        }
    }

    // 隐藏 pc pad 结构共用
    .header-main-common {
        display: none;
    }

    // 透明遮罩
    .phone-nav-backdrop {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 997;
        background-color: var(--jpz-border-color);
        opacity: 0.5;
    }

    // 侧边导航栏
    .phone-side-nav {
        background-color: var(--jpz-bg-color);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 998;
        transition: transform 300ms ease-in-out;
        box-shadow: 1px 0 5px #00000033;
        height: 100vh;
        width: 61.8vw;
    }

    .btn-menu {
        background-color: transparent;
        border: none;
        outline: none;
    }

    .menu-icon {
        font-size: 20px;
        padding: 6px;
        border-radius: 8px;
        fill: var(--el-text-color-regular);
        cursor: pointer;
        transition: color 0.6s;
        &:hover {
            fill: var(--el-text-color-primary);
            background-color: var(--jpz-bg-color-page);
        }
    }
}
</style>
