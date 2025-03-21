<!--
 * FilePath    : blog-client\src\components\layout\header-nav\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 头部导航菜单
-->

<template>
    <nav class="header-nav">
        <Account class="header-nav-item account" v-if="!isHorizontal" />
        <div class="switch" v-if="!isHorizontal">
            <SwitchGroup :switch-items="themeSwitch" @update-status="updateStatus" />
        </div>
        <el-scrollbar class="header-nav-item menu">
            <el-menu
                :mode="isHorizontal ? 'horizontal' : 'vertical'"
                @select="handleSelect"
                :default-active="defaultActive"
                ellipsis
                :style="horizontalMenuStyle"
            >
                <recursive-menu-item v-for="(item, key) in topLevelMenuItems" :key="key" :menu-item-map="menuItemMap" :menu-item="item" />
            </el-menu>
        </el-scrollbar>
    </nav>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed, reactive, ref } from "vue"

import RecursiveMenuItem from "@/components/common/recursive-menu-item" // 引入递归菜单组件
import SwitchGroup from "@/components/common/switch-group"
import { useTheme } from "@/components/hooks/useTheme"
import { DeviceType, useDeviceStore } from "@/stores/device"

import Account from "../account"
import { adminMenuItemMapWithIndex } from "./utils"

// 定义组件名称
defineOptions({ name: "HeaderNav" })

const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)
const defaultActive = ref("")

// 主题切换
const { themeSwitch, updateStatus } = useTheme()

// 根据设备类型设置菜单横竖排列
const isHorizontal = computed(() => device.value !== DeviceType.PHONE)

const horizontalMenuStyle = computed(() => {
    let maxWidth = "720px"
    if (device.value === DeviceType.PC) {
        maxWidth = "720px"
    }
    if (device.value === DeviceType.PAD) {
        maxWidth = "460px"
    }
    return {
        "max-width": maxWidth,
    }
})

// 生成菜单项索引
const menuItemMap = reactive(adminMenuItemMapWithIndex)

// 计算顶级菜单项
const topLevelMenuItems = computed(() => Object.values(menuItemMap).filter((item) => !item.parentIndex))

// 处理菜单项选中事件
const handleSelect = (index: string, keyPath: string[]) => {}
</script>

<style scoped lang="scss">
.header-nav {
    background-color: var(--jpz-bg-color-header);
    @include respond-to("pc") {
        max-width: 720px;
    }

    @include respond-to("pad") {
        max-width: 720px;
    }

    @include respond-to("phone") {
        // 绝对定位，避免占据整个屏幕
        position: absolute;
        top: phone.$height-header;
        height: 100%;
        width: 100%;

        .account {
            margin: 10px 0;
            // 居中
            display: flex;
            justify-content: center;
        }

        .switch {
            margin-top: 20px;
            margin-bottom: 8px;
            padding-bottom: 10px;
            // 居中
            display: flex;
            justify-content: center;
            border-bottom: var(--jpz-border-color) 1px solid;
        }

        // 参考官方文档：https://element-plus.org/zh-CN/component/menu.html#collapse-%E6%8A%98%E5%8F%A0%E9%9D%A2%E6%9D%BF
        .el-menu--vertical:not(.el-menu--collapse) {
            width: 240px;
            height: calc(100vh - phone.$height-header - 170px);
        }
    }
}

:deep(.icon-menu) {
    font-size: 1.2em;
}

// 共用样式
%common-menu-style {
    --el-menu-text-color: var(--jpz-text-color-primary);
    --el-menu-active-color: var(--jpz-color-secondary);
    fill: var(--jpz-color-primary);

    .el-menu-item.is-active {
        fill: var(--el-menu-active-color);
    }
}

// 横向菜单样式
.el-menu--horizontal {
    width: 100%;
    border: none;

    :deep(.el-sub-menu.is-active) {
        fill: var(--el-menu-active-color);
    }

    @extend %common-menu-style;
}

// 纵向菜单样式
.el-menu--vertical {
    overflow-x: hidden;
    border-right: none;

    :deep(.el-sub-menu.is-active) {
        .el-sub-menu__title {
            fill: var(--jpz-color-secondary);
            color: var(--jpz-color-secondary);
        }
    }

    @extend %common-menu-style;
}
</style>
