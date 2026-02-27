<!--
 * FilePath    : blog-client\src\components\layout\logo\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 头部 logo
-->

<template>
    <div class="logo-container">
        <router-link :to="{ name: RouteNames.Home }" @click="clickLogo">
            <!-- 使用绝对路径来解析公共资源，以便在嵌套路由中正确解析 -->
            <img class="logo" :src="logo || '/demo-logo.svg'" alt="logo" />
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"

import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options"

defineOptions({ name: "HeaderLogo" })

const route = useRoute()

const optionsStore = useOptionsStore()
const logo = optionsStore.getLogo

const clickLogo = () => {
    const { name } = route
    // 处于首页的情况下点击 Logo 进入 / 路径强制刷新
    if (name === RouteNames.Home) {
        window.location.href = "/"
    }
}
</script>

<style scoped lang="scss">
.logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;
    @include respond-to("pad") {
        margin-left: 10px;
    }
}

.logo {
    width: auto;
    @include respond-to("pc") {
        height: pc.$height-header-logo;
    }

    @include respond-to("pad") {
        height: pad.$height-header-logo;
    }

    @include respond-to("phone") {
        height: phone.$height-header-logo;
    }
}
</style>
