<!--
 * @FilePath     : \blog-client\src\App.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 入口文件
-->

<template>
    <section ref="appRef" class="app">
        <el-config-provider :locale="zhCn">
            <Head>
                <title>My awesome site</title>
                <meta content="My awesome site description" name="description" />
            </Head>

            <router-view />
        </el-config-provider>
    </section>
</template>
<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { Head } from "@unhead/vue/components"
import { useDark } from "@vueuse/core"
import { useResizeObserver } from "@vueuse/core"
import zhCn from "element-plus/es/locale/lang/zh-cn"
import { onBeforeUnmount, useTemplateRef } from "vue"

import { useUserStore } from "@/stores/user"
import { getDeviceType } from "@/utils/device"

// 获取用户信息
const userStore = useUserStore()

const appRef = useTemplateRef<HTMLElement>("appRef")

// 黑暗模式
useDark({
    selector: "html",
    // attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
})

useHead({
    title: "My awesome site",
    meta: [
        { name: "description", content: "目录，就是目录。" },
        {
            name: "keywords",
            content: "焦棚子,jiaopengzi,power bi,power pivot,power query,power bi report server,数据分析,透视表,excel,目录",
        },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "zh-CN" },
        { property: "og:title", content: "焦棚子的文章目录" },
        { property: "og:author", content: "焦棚子" },
        {
            property: "og:image",
            content: "https://image.jiaopengzi.com/wp-content/uploads/2020/02/logo_1920_2_w280.png",
        },
        { property: "og:site_name", content: "焦棚子" },
        { property: "og:description", content: "目录，就是目录。" },
        { property: "og:url", content: "https://jiaopengzi.com/75.html" },
        { property: "og:release_date", content: "2020-02-27 15:15:29" },
    ],
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

<style lang="scss" scoped></style>
