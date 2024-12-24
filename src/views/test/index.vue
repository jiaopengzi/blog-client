<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:26:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-24 23:38:38
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 主页内容
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <TestPagination :pagination-data="pagination" @update-page-size="updatePageSize" />
</template>
<script setup lang="ts">
import { reactive } from "vue"

import TestPagination from "./testPagination.vue"

defineOptions({ name: "LayoutHome" })

export interface Pagination {
    total: number // 总记录数量
    current_page: number // 当前页
    page_size: number // 每页显示条数
    page_count: number // 总页数
    page_sizes: number[] // 每页显示个数选择器的选项设置
}

const pagination = reactive<Pagination>({
    total: 100, // 总记录数量
    current_page: 1, // 当前页
    page_size: 10, // 每页显示条数
    page_count: 10, // 总页数
    page_sizes: [10, 20, 30, 40], // 每页显示个数选择器的选项设置
}) // 分页数据

// 更新每页显示条数
const updatePageSize = (val: number) => {
    console.log("val===>", val)
    console.log("page_size before update===>", pagination.page_size)
}
</script>
