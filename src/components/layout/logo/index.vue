<!--
 * FilePath    : blog-client-nuxt\src\components\layout\logo\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 头部 logo (bug01 260901-01 反馈第3轮: 复用 LogoImage 的 app-option 直接渲染)
-->

<template>
    <div class="logo-container">
        <router-link :to="{ name: RouteNames.Home }" @click="clickLogo">
            <!-- LogoImage 直接读取 app-option logo, class 经单根属性透传落到 img, 尺寸仍由本组件约束 -->
            <LogoImage class="logo" />
        </router-link>
    </div>
</template>

<script setup lang="ts">
import LogoImage from "@/components/common/logo-image"
import { RouteNames } from "@/router"

defineOptions({ name: "HeaderLogo" })

const route = useRoute()

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
