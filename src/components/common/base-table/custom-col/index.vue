<!--
 * @FilePath     : \blog-client\src\components\common\base-table\custom-col\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 自定义列 
-->

<template>
    <el-table-column :width="col.width" :min-width="col.minWidth" :align="col.align" :label="col.label">
        <template #default="scope">
            <!-- 标题 -->
            <h4 v-if="col.isHeading">{{ scope.row[col.prop] }}</h4>

            <!-- 作者 -->
            <el-button v-if="col.isAuthor" class="is-author" @click="handleAuthorClick(scope.row[col.prop])">{{ scope.row[col.prop].user_name }}</el-button>

            <!-- 可点击标签 -->
            <el-scrollbar v-if="col.isTags || col.isCategories" :max-height="tagsItemMaxHeight ? tagsItemMaxHeight : '100px'">
                <!-- 注意 key 需要使用 id + 文章数量 -->
                <TagItem
                    v-for="item in scope.row[col.prop]"
                    :tag-data="item"
                    :is-admin="true"
                    :key="item.id + item.post_count_admin"
                    @click="handleTagClick(item)"
                />
            </el-scrollbar>

            <!-- 格式化 -->
            <span v-if="col.formatter">{{ col.formatter ? col.formatter(scope.row) : scope.row[col.prop] }}</span>
        </template>
    </el-table-column>
</template>

<script lang="ts" setup>
import type { PostTag } from "@/api/postTag/view"
import type { User } from "@/api/user/getUsers"
import TagItem from "@/components/common/tag-item"

import type { TableColumn } from "../types"

defineOptions({ name: "CustomCol" })

const { col, tagsItemMaxHeight } = defineProps<{
    col: TableColumn
    tagsItemMaxHeight?: string // 标签项目最大高度
}>()

const emit = defineEmits<{
    (event: "click-item", item: PostTag): void
    (event: "click-author", author: User): void
}>()

const handleTagClick = (item: PostTag) => {
    emit("click-item", item)
}

const handleAuthorClick = (author: User) => {
    emit("click-author", author)
}
</script>

<style lang="scss" scoped>
.is-author {
    padding: 0;
    margin: 0;
    border: none;
    background-color: transparent;
}

.is-author:hover {
    font-weight: 700;
}
</style>
