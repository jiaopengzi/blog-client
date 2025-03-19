<!--
 * @FilePath     : \blog-client\src\App.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 入口文件
-->

<template>
    <head-tag :head-data="head" />
    <section ref="appRef" class="app">
        <el-config-provider :locale="zhCn">
            <router-view />
        </el-config-provider>
    </section>
</template>
<script lang="ts" setup>
import { useDark } from "@vueuse/core"
import { useResizeObserver } from "@vueuse/core"
import zhCn from "element-plus/es/locale/lang/zh-cn"
import { storeToRefs } from "pinia"
import { onBeforeUnmount, useTemplateRef } from "vue"

import HeadTag from "@/components/common/head-tag"
import { useOptionsStore } from "@/stores/options"
import { useUserStore } from "@/stores/user"
import { getDeviceType } from "@/utils/device"

// 网站配置选项
const optionsStore = useOptionsStore()
const { head } = storeToRefs(optionsStore)

// 用户信息
const userStore = useUserStore()

const appRef = useTemplateRef<HTMLElement>("appRef")

// 黑暗模式
useDark({
    selector: "html",
    // attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
})

// 监听窗口变化
const { stop } = useResizeObserver(appRef, (entries) => {
    const deviceType = getDeviceType()
    userStore.setDevice(deviceType)
})

onBeforeUnmount(() => {
    stop()
})
</script>
