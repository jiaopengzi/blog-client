<!--
 * @FilePath     : \blog-client\src\App.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 入口文件
-->

<template>
    <Head>
        <title>{{ title }}</title>
        <meta name="description" :content="description" />
        <meta name="keywords" :content="keywords" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="zh-CN" />
        <meta property="og:title" :content="title" />
        <meta property="og:author" content="焦棚子" />
        <!-- <meta property="og:image" content="https://image.jiaopengzi.com/wp-content/uploads/2020/02/logo_1920_2_w280.png" /> -->
        <meta property="og:site_name" :content="title" />
        <meta property="og:description" :content="description" />
        <meta property="og:url" content="https://jiaopengzi.com/" />
        <!-- <meta property="og:release_date" content="2020-02-27 15:15:29" /> -->
    </Head>

    <section ref="appRef" class="app">
        <el-config-provider :locale="zhCn">
            <router-view />
        </el-config-provider>
    </section>
</template>
<script lang="ts" setup>
import { Head } from "@unhead/vue/components"
import { useDark } from "@vueuse/core"
import { useResizeObserver } from "@vueuse/core"
import zhCn from "element-plus/es/locale/lang/zh-cn"
import { storeToRefs } from "pinia"
import { onBeforeMount, onBeforeUnmount, ref, useTemplateRef } from "vue"

import { useOptionsStore } from "@/stores/options"
import { usePermissionRoleStore } from "@/stores/permissionRole"
import { useUserStore } from "@/stores/user"
import { getDeviceType } from "@/utils/device"

// 网站配置选项
const optionsStore = useOptionsStore()

// 权限角色
const permissionRole = usePermissionRoleStore()

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

const title = ref("home")
const description = ref("")
const keywords = ref("")

// 监听窗口变化
const { stop } = useResizeObserver(appRef, (entries) => {
    const deviceType = getDeviceType()
    userStore.setDevice(deviceType)
})

onBeforeMount(async () => {
    await permissionRole.update(true) // 强制刷新
    await optionsStore.update(true) // 强制刷新
    const { app_options: headData } = storeToRefs(optionsStore)
    if (headData.value.custom_home_title.value && headData.value.custom_home_subtitle.value) {
        title.value = headData.value.custom_home_title.value + headData.value.separator.value + headData.value.custom_home_subtitle.value
    }
    description.value = headData.value.seo_description.value
    keywords.value = headData.value.seo_keywords.value
})

onBeforeUnmount(() => {
    stop()
})
</script>

<style lang="scss" scoped></style>
