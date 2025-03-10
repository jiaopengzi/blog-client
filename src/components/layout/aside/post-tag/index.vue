<!--
 * @FilePath     : \blog-client\src\components\layout\aside\post-tag\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 文章标签
-->

<template>
    <div class="aside-item">
        <div class="title">
            <h2>
                <j-icon :name="IconKeys.Label" custom-class="my-icon" />
                文章标签
            </h2>
        </div>
        <div v-if="noData" class="tag-box">
            <el-empty description="暂无数据" />
        </div>
        <div v-else class="tag-box">
            <el-scrollbar max-height="300px">
                <TagItem v-for="item in items" :tag-data="item" :is-admin="isAdmin" :key="item.id" @click="handleClick(item)" />
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive } from "vue"

import { type PostTag } from "@/api/postTag/view"
import { viewPostTagTopNAPI } from "@/api/postTag/viewPostTagTopN"
import { viewPostTagTopNAdminAPI } from "@/api/postTag/viewPostTagTopNAdmin"
import { ResponseCode } from "@/api/response"
import { IconKeys } from "@/components/common/icons"
import TagItem from "@/components/common/tag-item"

defineOptions({ name: "PostTag" })

const { isAdmin = false } = defineProps<{
    isAdmin?: boolean
}>()

const emit = defineEmits<{
    (event: "click", tagItemData: PostTag): void
}>()

const items = reactive<PostTag[]>([])

// 是否没有数据
const noData = computed(() => items.length === 0)

const topNAPI = isAdmin ? viewPostTagTopNAdminAPI : viewPostTagTopNAPI

// 获取分页用户
const getTagTopN = async () => {
    // 获取标签列表
    await topNAPI().then((res) => {
        if (res.data.code === ResponseCode.PostTagViewTopNSuccess) {
            Object.assign(items, res.data.data)
        }
    })
}

const handleClick = (tagItemData: PostTag) => {
    emit("click", tagItemData)
}

onBeforeMount(() => {
    getTagTopN()
})
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

.tag-box {
    // border: 1px solid #000;
    overflow-y: auto;
    padding-bottom: 5px;
    padding-left: 5px;
}

.my-icon {
    font-size: 20px;
    margin-right: 5px;
    fill: var(--jpz-color-secondary);
}
</style>
