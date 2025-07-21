<!--
 * FilePath    : blog-client\src\views\page\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义页面
-->

<template>
    <div class="page">前台测试页面</div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"

import { RouteNames } from "@/router"

defineOptions({ name: RouteNames.Page })

const router = useRouter() // 路由
const countdown = ref(5) // 倒计时
let intervalId: number | undefined // 定时器id

onMounted(() => {})

onUnmounted(() => {})
</script>
