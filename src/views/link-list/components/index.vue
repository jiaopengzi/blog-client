<!--
 * FilePath    : blog-client\src\views\link-list\components\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 友情链接列表详情
-->

<template>
    <div class="content">
        <!-- 面包屑 -->
        <JBreadcrumb />
        <el-container class="container-main">
            <LinkList class="container-main-item" :is-show-description="true" :size="24" :truncated-count="80" />
            <div class="container-main-item title-container">
                <h3 class="title">友情链接申请</h3>
            </div>
            <AddLink class="container-main-item add" />
        </el-container>
    </div>
</template>
<script setup lang="ts">
import JBreadcrumb from "@/components/common/breadcrumb"
import { RouteNames } from "@/router"
import { useBreadcrumbStore } from "@/stores/breadcrumb"
import AddLink from "@/views/admin/component/main/links/component/add"

import LinkList from "./link-list"

defineOptions({ name: "LinkListDetail" })

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.updateItems("友情链接", `/${RouteNames.LinkList}`)
</script>
<style scoped lang="scss">
.content {
    display: flex;
    flex-direction: column;
    background-color: var(--jpz-bg-color-page);
    margin-bottom: 10px;
}

.container-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.title-container {
    // 坐上和右上圆角
    border-radius: 4px 4px 0 0;
    margin-top: 20px;
    width: 100%;
    background-color: var(--jpz-bg-color);

    .title {
        padding: 20px;
        font-size: 20px;
        font-weight: bold;
        color: var(--jpz-text-color-primary);
    }
}

.add {
    padding-top: 20px;
    padding-bottom: 20px;
    // 左下和右下圆角
    border-radius: 0 0 4px 4px;
    width: 100%;
    background-color: var(--jpz-bg-color);
}

@include respond-to("pc") {
    .content {
        width: pc.$width-page-main;
    }
}

@include respond-to("pad") {
    .content {
        width: pad.$width-page;

        .container-main {
            margin-left: 10px;
            margin-right: 10px;
        }
    }
}

@include respond-to("phone") {
    .content {
        width: 100vw;

        .container-main {
            margin-left: 10px;
            margin-right: 10px;
        }
    }
}
</style>
