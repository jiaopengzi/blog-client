<!--
 * FilePath    : blog-client-nuxt\src\components\common\account-form-header\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号相关表单头部 (logo 统一复用 LogoImage 运行时镜像)
-->

<template>
    <div class="header-main">
        <!-- a 标签 -->
        <div v-if="aTag" class="header-main">
            <a :href="aTag.href" :target="aTag.target">
                <div class="logo">
                    <LogoImage :alt="alt" />
                </div>
            </a>
            <h2 v-if="title" class="title">{{ title }}</h2>
        </div>

        <!-- router-link 标签 -->
        <div v-if="routerLinkTo" class="header-main">
            <router-link v-if="routerLinkTo" :to="routerLinkTo" class="link">
                <div class="logo">
                    <LogoImage :alt="alt" />
                </div>
            </router-link>
            <h2 v-if="title" class="title">{{ title }}</h2>
        </div>
    </div>
</template>

<script lang="ts" setup>
// Nuxt 适配: vue-router 非直接依赖, prop 类型用结构类型替代 RouteLocationAs* 类型
type RouterLinkToProp = string | Record<string, unknown>

import LogoImage from "@/components/common/logo-image"

defineOptions({ name: "AccountFormHeader" })

const {
    title,
    alt = "www.jiaopengzi.com",
    aTag,
    routerLinkTo,
} = defineProps<{
    title?: string
    alt?: string

    aTag?: {
        href: string
        target?: string
    }

    routerLinkTo?: RouterLinkToProp
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
}

.logo {
    :deep(.logo-image) {
        width: auto;
        height: 50px;
    }
}
</style>
