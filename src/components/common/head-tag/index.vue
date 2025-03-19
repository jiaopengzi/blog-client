<!--
 * FilePath    : blog-client\src\components\common\head-tag\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 生成网站头部信息
-->

<template>
    <Head>
        <title>{{ headData.title }}</title>
        <meta v-if="headData.description" name="description" :content="headData.description" />
        <meta v-if="headData.keywords" name="keywords" :content="headData.keywords" />
        <meta v-if="headData.type" property="og:type" :content="headData.type" />
        <meta v-if="headData.locale" property="og:locale" :content="headData.locale" />
        <meta v-if="headData.title" property="og:title" :content="headData.title" />
        <meta v-if="headData.author" property="og:author" :content="headData.author" />
        <meta v-if="headData.image" property="og:image" :content="headData.image" />
        <meta v-if="headData.siteName" property="og:site_name" :content="headData.siteName" />
        <meta v-if="headData.description" property="og:description" :content="headData.description" />
        <meta v-if="headData.url" property="og:url" :content="headData.url" />
        <meta v-if="headData.releaseDate" property="og:release_date" :content="headData.releaseDate" />
    </Head>
</template>
<script lang="ts" setup>
import { Head } from "@unhead/vue/components"

import { type HeadProps } from "./types"
defineOptions({ name: "HeadTag" })

// 定义 props
const {
    headData = {
        title: "home",
        type: "article",
        locale: "zh-CN",
        author: "焦棚子",
        url: "https://jiaopengzi.com/",
    },
} = defineProps<{
    headData: HeadProps
}>()
</script>
