<!--
 * FilePath    : blog-client-nuxt\src\layouts\bare-shell.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 站壳命名布局 (header + 面包屑 + slot + footer, P1-8 nuxt4-good)
-->

<!--
 * 补充说明:
 * 承接原 [username]/not-found 两页手工重复的站壳组合, 替代 layout:false +
 * 手写 LayoutHeader/JBreadcrumb/LayoutFooter 的 SPA 式拼装 (Nuxt 最佳实践为命名布局)
 * 搜索框显隐沿用 statusStore.isShowSearch 语义 (页面 setup 内设置)
 * 错误页 (error.vue) 与 admin 兜底不经过布局系统, 仍用 views/not-found 全壳视图
-->

<template>
    <div class="page">
        <LayoutHeader :is-show-search="isShowSearch" />

        <div class="content">
            <!-- 面包屑 -->
            <JBreadcrumb />

            <!-- 页面内容 (经默认插槽注入) -->
            <slot />
        </div>

        <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"

import JBreadcrumb from "@/components/common/breadcrumb"
import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import { useSiteOptions } from "@/composables/useSiteOptions"
import { useStatusStore } from "@/stores/status"

defineOptions({ name: "BareShellLayout" })

// 站点配置 SSR 预填充 (与 default.vue 对齐: 本布局的页头 Logo/导航、面包屑、页脚均读 optionsStore;
// 缺此调用时 SSR 用空 store 渲染(Logo 落到 /demo-logo.svg、面包屑与页脚为占位), 客户端
// init-stores 从 localStorage 恢复真实值后与 SSR HTML 不一致 → hydration mismatch.
// 经共用 asyncData key "site-options" 与页面内的调用自动去重, 不会重复请求.
await useSiteOptions()

const statusStore = useStatusStore()
const { isShowSearch } = storeToRefs(statusStore)
</script>

<style scoped lang="scss">
.content {
    display: flex;
    flex-direction: column;
    background-color: var(--jpz-bg-color-page);
}

@include respond-to("pc") {
    .content {
        width: pc.$width-page-main;
        min-height: calc(100vh - pc.$height-footer);
    }
}

@include respond-to("pad") {
    .content {
        width: 94vw;
        min-height: calc(100vh - pad.$height-footer);
    }
}

@include respond-to("phone") {
    .content {
        width: 100vw;
    }
}
</style>
