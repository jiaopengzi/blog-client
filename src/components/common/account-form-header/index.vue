<!--
 * FilePath    : blog-client-nuxt\src\components\common\account-form-header\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号相关表单头部
-->

<template>
    <div class="header-main">
        <!-- a 标签 -->
        <div v-if="aTag" class="header-main">
            <a :href="aTag.href" :target="aTag.target">
                <div class="logo">
                    <img :src="imgSrcAc" :alt="alt" />
                </div>
            </a>
            <h2 v-if="title" class="title">{{ title }}</h2>
        </div>

        <!-- router-link 标签 -->
        <div v-if="routerLinkTo" class="header-main">
            <router-link v-if="routerLinkTo" :to="routerLinkTo" class="link">
                <div class="logo">
                    <img :src="imgSrcAc" :alt="alt" />
                </div>
            </router-link>
            <h2 v-if="title" class="title">{{ title }}</h2>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

// Nuxt 适配: vue-router 非直接依赖, prop 类型用结构类型替代 RouteLocationAs* 类型
type RouterLinkToProp = string | Record<string, unknown>

// H7(品牌资产统一): 站点配置缺失时的兜底图使用内置品牌 Logo, 不再回落到占位图
import brandLogo from "@/assets/img/logo-jiaopengzi-162-50.png"

import { useOptionsStore } from "@/stores/options"

defineOptions({ name: "AccountFormHeader" })

const {
    title,
    alt = "www.jiaopengzi.com",
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

    routerLinkTo?: RouterLinkToProp
}>()

const optionsStore = useOptionsStore()
const logo = optionsStore.getLogo
const imgSrcAc = computed(() => imgSrc || logo || brandLogo)
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
}

.logo {
    img {
        width: auto;
        height: 50px;
    }
}
</style>
