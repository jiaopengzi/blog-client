<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-12-24 23:17:08
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-24 23:39:53
 * @FilePath     : \blog-client\src\views\test\testPagination.vue
 * @Description  : 测试分页组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <el-pagination
        v-model:current-page="paginationAC.current_page"
        v-model:page-size="paginationAC.page_size"
        :page-sizes="paginationAC.page_sizes"
        :page-count="paginationAC.page_count"
        :total="paginationAC.total"
        :background="true"
        layout="total, prev, pager, next, jumper, sizes"
        size="small"
        @update:page-size="updatePageSize"
    />
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"

defineOptions({ name: "TestPagination" })
export interface Pagination {
    total: number // 总记录数量
    current_page: number // 当前页
    page_size: number // 每页显示条数
    page_count: number // 总页数
    page_sizes: number[] // 每页显示个数选择器的选项设置
}

const { paginationData } = defineProps<{
    paginationData: Pagination
}>()

// 事件
const emit = defineEmits<{
    (event: "updatePageSize", val: number): void
}>()

// 当前分页数据
const paginationAC: Pagination = {
    total: 0,
    current_page: 1,
    page_size: 10,
    page_count: 0,
    page_sizes: [10, 20, 30, 40],
}

// 更新每页显示数量
const updatePageSize = (val: number) => {
    emit("updatePageSize", val)
}

onMounted(async () => {
    // 将父组件传递的分页数据赋值给当前分页数据
    Object.assign(paginationAC, paginationData)
})
</script>
