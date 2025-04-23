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
        <!-- 
            jpz-header-menu-popover 样式在 main.scss
            由于 Element Plus 的 Popover 挂载在 body 上，所以需要在全局样式中定义
        -->
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
    </nav>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import RecursiveMenuItem from "@/components/common/recursive-menu-item" // 引入递归菜单组件
import SwitchGroup from "@/components/common/switch-group"
import { useTheme } from "@/components/hooks/useTheme"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { useOptionsStore } from "@/stores/options"
import { useStatusStore } from "@/stores/status"

import Account from "../account"

// 定义组件名称
defineOptions({ name: "HeaderNav" })

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()
const { device, windowWidth } = storeToRefs(deviceStore)

const optionsStore = useOptionsStore()
const { navObj, navActiveIndex } = storeToRefs(optionsStore)

const statusStore = useStatusStore()

// 主题切换
const { themeSwitch, updateStatus } = useTheme()

// 根据设备类型设置菜单横竖排列
const isHorizontal = computed(() => device.value !== DeviceType.PHONE)

const horizontalMenuStyle = computed(() => {
    let maxWidth = "750px"
    if (device.value === DeviceType.PC) {
        maxWidth = "750px"
    }
    if (device.value === DeviceType.PAD) {
        maxWidth = `${windowWidth.value - 420}px`
    }
    return {
        "max-width": maxWidth,
    }
})

// 计算顶级菜单项
const topLevelMenuItems = computed(() => {
    return Object.values(navObj.value).filter((item) => !item.parentIndex)
})

// 处理菜单项选中事件
const handleSelect = async (index: string) => {
    const href = navObj.value[index].href || "/"
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

// 监听路由变化，更新默认选中菜单项
watch(
    () => route.fullPath,
    (newVal: string) => {
        const index = Object.keys(navObj.value).find((key) => navObj.value[key].href === newVal)
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

// .header-nav {
//     background-color: var(--jpz-bg-color-header);
//     @include respond-to("pc") {
//         // max-width: 720px;
//     }

//     @include respond-to("pad") {
//         // max-width: 720px;
//     }

//     @include respond-to("phone") {
//         // 绝对定位，避免占据整个屏幕
//         position: absolute;
//         top: phone.$height-header;
//         height: 100%;
//         width: 100%;

//         .account {
//             margin: 10px 0;
//             // 居中
//             display: flex;
//             justify-content: center;
//         }

//         .switch {
//             margin-top: 20px;
//             margin-bottom: 8px;
//             padding-bottom: 10px;
//             // 居中
//             display: flex;
//             justify-content: center;
//             border-bottom: var(--jpz-border-color) 1px solid;
//         }

//         // 参考官方文档：https://element-plus.org/zh-CN/component/menu.html#collapse-%E6%8A%98%E5%8F%A0%E9%9D%A2%E6%9D%BF
//         .el-menu--vertical:not(.el-menu--collapse) {
//             width: 240px;
//             height: calc(100vh - phone.$height-header - 170px);
//         }
//     }
// }
</style>
