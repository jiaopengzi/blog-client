<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:15:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-11 15:38:25
 * @FilePath     : \blog-client\src\components\layout\aside\post-tag\index.vue
 * @Description  : 文章标签
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="aside-item">
        <div class="title">
            <h2>
                <Icon :name="IconKeys.Label" custom-class="my-icon" />
                文章标签
            </h2>
        </div>
        <div v-if="noData" class="tag-box">
            <el-empty description="暂无数据" />
        </div>
        <div v-else class="tag-box">
            <el-scrollbar max-height="300px">
                <TagItem
                    v-for="item in items"
                    :tag-data="item"
                    :key="item.id"
                    @click="handleClick(item)"
                />
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, computed } from "vue"
import { IconKeys } from "@/components/common/icons"

import TagItem from "@/components/common/tag-item"
import { viewPostTagTopAPI, type PostTag } from "@/api/postTag/view"
import { ResponseCode } from "@/api/responseCode"

defineOptions({ name: "PostTag" })

const emit = defineEmits<{
    (event: "click", tagItemData: PostTag): void
}>()

const items = reactive<PostTag[]>([])

// 是否没有数据
const noData = computed(() => items.length === 0)

// 获取分页用户
const getTagTopN = async () => {
    // 获取标签列表
    await viewPostTagTopAPI().then((res) => {
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
