<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:14:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-04 21:47:05
 * @FilePath     : \blog-client\src\components\layout\aside\recommended-read\index.vue
 * @Description  : 推荐阅读
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="aside-item">
        <div class="title">
            <h2><Icon :name="IconKeys.Recommended" custom-class="aside-icon" />推荐阅读</h2>
        </div>
        <div class="post-list">
            <PostItem v-for="item in postItems" :key="item.title" :post-data="item" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PostItemAsideObj } from "@/components/common/post-item-aside"
import { IconKeys } from "@/components/common/icons"

import PostItem from "@/components/common/post-item-aside"

defineOptions({ name: "RecommendedRead" })

const postDataObj: PostItemAsideObj = {
    thumbnailSrc: "https://image.jiaopengzi.com/blog/202309181034415-w280h210.png",
    thumbnailHref: "http://192.168.2.222:8081/post",
    titleHref: "http://192.168.2.222:8081/tool",
    title: "184_Python 在 Excel 和 Power BI 绘制堆积瀑布图",
    date: "2023年3月15日",
    view: 1000,
}

const postItems: PostItemAsideObj[] = Array(5).fill(postDataObj)
</script>
<style scoped lang="scss">
.aside-item {
    border: 1px solid #eaeaea;
    background-color: $background-color-content;
    border-radius: 5px;

    .title {
        background-color: $background-color-page;
        padding: 10px 5px;
    }

    h2 {
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
    }
}

.post-list {
    font-size: 14px;
    padding-left: 10px;
    padding-right: 10px;

    .post-item {
        margin-top: 10px;
    }

    &:last-child {
        margin-bottom: 10px;
    }
}

.aside-icon {
    font-size: 20px;
    margin-right: 5px;
    fill: #bb1818;
}
</style>
