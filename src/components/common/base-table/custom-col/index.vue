<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-24 15:53:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-24 18:12:33
 * @FilePath     : \blog-client\src\components\common\base-table\custom-col\index.vue
 * @Description  : 自定义列
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <el-table-column
        :key="`custom-${index}`"
        :min-width="col.width"
        :align="col.align"
        :label="col.label"
    >
        <template #default="scope">
            <!-- 标题 -->
            <h4 v-if="col.isHeading">{{ scope.row[col.prop] }}</h4>

            <!-- 作者 -->
            <el-button
                v-if="col.isAuthor"
                class="is-author"
                @click="handleAuthorClick(scope.row[col.prop])"
                >{{ scope.row[col.prop].user_name }}</el-button
            >

            <!-- 可点击标签 -->
            <el-scrollbar v-if="col.isTags || col.isCategories" max-height="120px">
                <TagItem
                    v-for="item in scope.row[col.prop]"
                    :tag-data="item"
                    :key="item.id"
                    @click="handleTagClick(item)"
                />
            </el-scrollbar>

            <!-- 格式化 -->
            <span v-if="col.formatter">{{
                col.formatter ? col.formatter(scope.row) : scope.row[col.prop]
            }}</span>
        </template>
    </el-table-column>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue"
import TagItem from "@/components/common/tag-item"
import type { TableColumn } from "../index"
import type { PostTag } from "@/api/postTag/view"
import type { User } from "@/api/user/getUsers"

defineOptions({ name: "CustomCol" })

const { col, index } = defineProps<{
    col: TableColumn
    index: number
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
</style>
