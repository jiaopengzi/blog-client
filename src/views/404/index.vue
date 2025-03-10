<!--
 * @FilePath     : \blog-client\src\views\404\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 404 页面
-->

<template>
    <div class="page">
        <LayoutHeader />
        <div class="pc">
            <HomePC :countdown="countdown" />
        </div>
        <div class="phone">
            <HomePhone :countdown="countdown" />
        </div>
        <LayoutFooter />
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"

import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"

import HomePC from "./pc.vue"
import HomePhone from "./phone.vue"

defineOptions({ name: "NotFound404" })

const router = useRouter() // 路由
const countdown = ref(5) // 倒计时
let intervalId: number | undefined // 定时器id

onMounted(() => {
    // 倒计时
    intervalId = window.setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--
        } else {
            clearInterval(intervalId)
            router.push("/")
        }
    }, 1000)
})

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>
