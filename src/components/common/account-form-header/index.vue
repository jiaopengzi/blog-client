<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-13 10:19:16
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-14 16:02:02
 * @FilePath     : \blog-client\src\components\common\account-form-header\index.vue
 * @Description  : 账号相关表单头部
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="header-main">
        <!-- a 标签 -->
        <div v-if="aTag" class="header-main">
            <a :href="aTag.href" :target="aTag.target">
                <div class="logo">
                    <img src="@/assets/img/logo-text-rounded-rectangle-200-52.png" :alt="alt" />
                </div>
            </a>
            <h2 v-if="title" class="title">{{ title }}</h2>
        </div>

        <!-- router-link 标签 -->
        <div v-if="routerLinkTo" class="header-main">
            <router-link v-if="routerLinkTo" :to="routerLinkTo" class="link">
                <div class="logo">
                    <img src="@/assets/img/logo-text-rounded-rectangle-200-52.png" :alt="alt" />
                </div>
            </router-link>
            <h2 v-if="title" class="title">{{ title }}</h2>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from "vue-router"

defineOptions({ name: "AccountFormHeader" })

const {
    title,
    alt = "www.jiaopengzi.com",
    // 注意: Vite 的 import.meta.url 结合 new URL() 方法来解析图片路径。确保在开发和生产环境中都能正确解析路径。
    // imgSrc = new URL("@/assets/img/logo-text-rounded-rectangle-200-52.png", import.meta.url).href,
    imgSrc,
    aTag,
    routerLinkTo,
} = defineProps<{
    title?: string
    alt?: string
    imgSrc?: string

    aTag?: {
        href: string
        target?: string
    }

    routerLinkTo?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric
}>()
</script>

<style lang="scss" scoped>
.header-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.title {
    margin-top: 10px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
}

a {
    color: var(--jpz-text-color-primary);
    // text-decoration: underline;
}
</style>
