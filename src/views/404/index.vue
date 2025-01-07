<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-03-13 15:55:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-04 21:40:42
 * @FilePath     : \blog-client\src\views\404\index.vue
 * @Description  : 404 页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
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
import { onMounted, onUnmounted,ref } from "vue"
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
