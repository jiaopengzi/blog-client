<!--
 * FilePath    : blog-client\src\views\home\main-content\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 主内容区
-->

<template>
    <div class="content">
        <!-- 面包屑 -->
        <JBreadcrumb />

        <el-container class="container-main">
            <LinkList :is-show-description="true" :size="24" :truncated-count="50" />
        </el-container>
    </div>
</template>
<script setup lang="ts">
import JBreadcrumb from "@/components/common/breadcrumb"
import { useBreadcrumbStore } from "@/stores/breadcrumb"

import LinkList from "./components"

defineOptions({ name: "MainContent" })
const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.updateItems("友情链接", "/link-list")
</script>
<style scoped lang="scss">
:deep(.highlight-title) {
    color: var(--jpz-color-secondary);
    font-weight: 600;
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
        // 确保子元素可以自行决定高度, 配合 el-aside 的 sticky 定位
        display: flex;
        align-items: flex-start;
    }

    .el-main {
        // background-color: var(--jpz-bg-color);
        padding-left: 0px;
        padding-top: 0px;
    }

    .el-aside {
        position: sticky; // 使侧边栏固定在页面顶部, 粘性定位
        top: 0;
        width: pc.$width-aside;
        background-color: var(--jpz-bg-color-page);
    }

    .el-aside-item {
        margin-bottom: 10px;
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

    .el-aside {
        display: none;
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
