<!--
 * FilePath    : blog-client-nuxt\src\layouts\default.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 根级默认布局 (阶段 4 终版: header/侧栏/footer 常驻, 页面仅提供内容)
-->

<!--
 * 补充说明:
 * 按 Nuxt 布局机制, 跨页导航 (如详情→首页、热门A→B) 布局组件不重挂载,
 * 侧栏数据不再被重复渲染/清空; 搜索框数据经 provide/inject 传给列表内容组件
-->

<template>
    <div class="page">
        <LayoutHeader :is-show-search="isShowSearch" @handle-search="handleSearch" />

        <div class="content">
            <!-- 面包屑 -->
            <JBreadcrumb />

            <!-- 正文内容 (页面内容经默认插槽注入) -->
            <el-container class="container-main">
                <el-main>
                    <slot />
                </el-main>

                <LayoutAside />
            </el-container>
        </div>

        <LayoutFooter />
    </div>

    <el-backtop :bottom="100" class="backtop-container">
        <div class="backtop">UP</div>
    </el-backtop>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { provide, ref } from "vue"

import JBreadcrumb from "@/components/common/breadcrumb"
import LayoutAside from "@/components/layout/aside/layout-aside.vue"
import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import { type SearchData } from "@/components/layout/search"
import { useSiteOptions } from "@/composables/useSiteOptions"
import { useStatusStore } from "@/stores/status"

defineOptions({ name: "DefaultLayout" })

// 站点配置 SSR 预填充 (页头 Logo/导航依赖, 布局层在渲染前完成, SSR 与客户端一致)
await useSiteOptions()

const statusStore = useStatusStore()
const { isShowSearch } = storeToRefs(statusStore)

// 搜索框数据流 (页头搜索弹窗 → 列表内容组件, 经 provide/inject 传递)
const searchData = ref<SearchData>({
    keyword: "",
    time: new Date(),
})

provide("layoutSearchData", searchData)

const handleSearch = (val: string) => {
    searchData.value.keyword = val
    searchData.value.time = new Date() // 保证相同关键字搜索时, 重新渲染
}
</script>

<style scoped lang="scss">
// 返回顶部容器
.backtop-container {
    // 位置参考 main.scss 中的 z-index 管理
    z-index: 1000;

    .backtop {
        height: 100%;
        width: 100%;
        text-align: center;
        line-height: 40px;
        color: var(--jpz-color-primary);
    }
}

.content {
    display: flex;
    flex-direction: column;
    background-color: var(--jpz-bg-color-page);
}

@include respond-to("pc") {
    .content {
        width: pc.$width-page-main;
    }

    .container-main {
        display: flex;
        align-items: flex-start;
    }

    .el-main {
        padding-left: 0px;
        padding-top: 0px;
    }
}

@include respond-to("pad") {
    .content {
        width: pad.$width-page;
    }

    .el-main {
        padding-left: 0;
        padding-top: 0;
        padding-right: 0;
        padding-bottom: 10px;
    }
}

@include respond-to("phone") {
    .content {
        width: 100vw;
    }

    .el-main {
        padding-left: 0;
        padding-top: 0;
        padding-right: 0;
        padding-bottom: 10px;
    }
}
</style>
