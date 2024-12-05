<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-05 10:58:23
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div>
        <p>Number keys in ViewPostByAdminRequest:</p>
        <ul>
            <li v-for="key in numberKeys" :key="key">{{ key }}</li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

export interface PaginationRequest {
    page: number
    pageSize: number
}

export interface CustomFields {
    // 自定义字段定义
}

export interface ViewPostByAdminRequest extends PaginationRequest {
    post_author: string // 文章作者
    post_status: number // 文章状态
    year: number // 文章年份
    month: number // 文章月份
    post_category_id: string // 文章分类ID
    post_tag_id: string // 文章标签ID
    custom_filed: CustomFields // 自定义字段
    custom_filed_min: string // 自定义字段最小值
    custom_filed_max: string // 自定义字段最大值
}

type NumberKeys<T> = {
    [K in keyof T]: T[K] extends number ? K : never
}[keyof T]

function getNumberKeys<T>(obj: T): (keyof T)[] {
    return Object.keys(obj as object).filter(
        (key) => typeof obj[key as keyof T] === "number",
    ) as (keyof T)[]
}

const sampleObject: ViewPostByAdminRequest = {
    page: 1,
    pageSize: 10,
    post_author: "Author",
    post_status: 1,
    year: 2023,
    month: 12,
    post_category_id: "category1",
    post_tag_id: "tag1",
    custom_filed: {},
    custom_filed_min: "min",
    custom_filed_max: "max",
}

const numberKeys = ref<(keyof ViewPostByAdminRequest)[]>(getNumberKeys(sampleObject))
</script>

<style scoped lang="scss">
/* 样式定义 */
</style>
