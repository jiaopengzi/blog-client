<!--
 * FilePath    : blog-client-nuxt\src\components\layout\header-nav\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 头部导航菜单
-->

<template>
    <nav class="header-nav">
        <Account class="header-nav-item account" v-if="!isHorizontal" />
        <div class="switch" v-if="!isHorizontal">
            <ThemePresetSelector :model-value="activeThemePreset" :presets="themePresetOptions" @update:model-value="selectThemePreset" />
        </div>
        <!--
            jpz-header-menu-popover 样式在 main.scss
            由于 Element Plus 的 Popover 挂载在 body 上, 所以需要在全局样式中定义
        -->
        <!-- ClientOnly: 菜单整体客户端渲染——(1) 避免 el-sub-menu 内置 tooltip popper 的 SSR 双端不一致;
             (2) el-menu ellipsis 折叠 (三个点) 依赖客户端挂载时对完整菜单项的宽度测量,
             若仅菜单项后置注入会丢失测量时机导致不折叠 -->
        <ClientOnly>
            <el-menu
                :mode="isHorizontal ? 'horizontal' : 'vertical'"
                @select="handleSelect"
                :default-active="navActiveIndex"
                ellipsis
                :style="horizontalMenuStyle"
                popper-class="jpz-header-menu-popover"
            >
                <recursive-menu-item v-for="(item, key) in topLevelMenuItems" :key="key" :menu-item-map="navObj" :menu-item="item" />
            </el-menu>
        </ClientOnly>
    </nav>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed, watch } from "vue"

import RecursiveMenuItem from "@/components/common/recursive-menu-item"
import ThemePresetSelector from "@/theme/preset-selector"
import { useTheme } from "@/theme/useTheme"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { useOptionsStore } from "@/stores/options"
import { useStatusStore } from "@/stores/status"

import Account from "../account"

defineOptions({ name: "HeaderNav" })

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()
const { device, windowWidth } = storeToRefs(deviceStore)

const optionsStore = useOptionsStore()
const { navObj, navActiveIndex } = storeToRefs(optionsStore)

const statusStore = useStatusStore()

const { activeThemePreset, selectThemePreset, themePresetOptions } = useTheme()

// 根据设备类型设置菜单横竖排列
const isHorizontal = computed(() => device.value !== DeviceType.PHONE)

const horizontalMenuStyle = computed(() => {
    let maxWidth = "750px"
    if (device.value === DeviceType.PAD) {
        maxWidth = `${windowWidth.value - 420}px`
    }
    if (device.value === DeviceType.PHONE) {
        maxWidth = `232px`
    }
    return {
        "max-width": maxWidth,
    }
})

const topLevelMenuItems = computed(() => {
    return Object.values(navObj.value).filter((item) => !item.parentIndex)
})

const handleSelect = async (index: string) => {
    const href = navObj.value[index]!.href || "/"
    // 判断 href 是否为外部链接
    if (href && href.startsWith("http")) {
        window.open(href, "_blank")
        return
    }

    // 读取路由信息路由跳转
    statusStore.setHome()

    const location = router.resolve(href)
    const path = location.path
    const query = location.query
    await router.push({ path, query })
}

// 监听路由变化, 更新默认选中菜单项
watch(
    () => route.fullPath,
    (newVal: string) => {
        const index = Object.keys(navObj.value).find((key) => navObj.value[key]!.href === newVal)
        if (index) {
            navActiveIndex.value = index
        } else {
            navActiveIndex.value = ""
        }
    },
    { immediate: true },
)
</script>

<style scoped lang="scss">
@use "./style.module.scss";
</style>
