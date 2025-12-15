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
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue"

import HeadTag from "@/components/common/head-tag"
import { useDeviceStore } from "@/stores/device"
import { useOptionsStore } from "@/stores/options"

// 网站配置选项
const optionsStore = useOptionsStore()
const { head, custom_style_css } = storeToRefs(optionsStore)

// 设备类型
const deviceStore = useDeviceStore()

const appRef = useTemplateRef<HTMLElement>("appRef")

// 黑暗模式
useDark({
    selector: "html",
    // attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
})

// 设置自定义样式
const setCustomStyle = (cssContent: string) => {
    // 移除旧的自定义样式
    const id = "custom-style-css"
    const oldStyle = document.getElementById(id)
    if (oldStyle) {
        oldStyle.remove()
    }

    // 如果为空则不添加
    if (!cssContent) return

    // 添加新的自定义样式
    const style = document.createElement("style")
    style.id = id
    style.textContent = cssContent
    document.head.appendChild(style)
}

// 监听自定义样式变化
watch(
    custom_style_css,
    (newVal) => {
        setCustomStyle(newVal)
    },
    {
        immediate: true,
    },
)

// 监听窗口变化
const { stop } = useResizeObserver(appRef, () => {
    deviceStore.updateDevice()
    deviceStore.updateWindowWidth()
})

// 挂载成功后移除首屏加载动画
onMounted(() => {
    nextTick(() => {
        const loaderContainer = document.querySelector(".first-screen-loader-container")
        if (loaderContainer) {
            loaderContainer.remove()
        }
    })
})

// 停止监听窗口变化
onBeforeUnmount(() => {
    stop()
})
</script>
