<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:14:11
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-18 11:54:00
 * @FilePath     : \blog-client\src\components\layout\aside\hot-post\index.vue
 * @Description  : 热门文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="aside-item">
        <div class="title">
            <h2 class="icon-container"><Icon :name="IconKeys.Hot" custom-class="aside-icon" /> 热门文章</h2>
        </div>
        <div class="post-list">
            <PostItem v-for="item in postData" :key="item.post_title" :post-data="item" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { type PostResCommon } from "@/api/post/common"
import { IconKeys } from "@/components/common/icons"
import PostItem from "@/components/common/post-item-aside"

defineOptions({ name: "HostPost" })

const { postData } = defineProps<{
    postData: PostResCommon[]
}>()
</script>
<style scoped lang="scss">
.aside-item {
    border: 1px solid var(--jpz-border-color);
    background-color: var(--jpz-bg-color);
    border-radius: 5px;

    .title {
        background-color: var(--jpz-bg-color);
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
    fill: var(--jpz-color-secondary);
}
</style>
