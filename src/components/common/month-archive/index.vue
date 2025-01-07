<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:14:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-21 16:24:38
 * @FilePath     : \blog-client\src\components\common\month-archive\index.vue
 * @Description  : 月度归档
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="aside-item">
        <div class="title">
            <h2><Icon :name="IconKeys.Archive" custom-class="aside-icon" />文章归档</h2>
        </div>
        <div class="table">
            <el-table
                :max-height="400"
                :data="postList"
                :show-header="true"
                row-class-name="month-archive-row-class"
                @row-click="handleRowClick"
            >
                <el-table-column prop="year_month" label="年月" align="center" />
                <el-table-column prop="count" label="文章" align="center" />
            </el-table>
        </div>
    </div>
</template>
<script setup lang="ts">
import { IconKeys } from "@/components/common/icons"

import { type MonthArchiveData } from "./types"

defineOptions({ name: "MonthArchive" })

const { postList } = defineProps<{
    postList: MonthArchiveData[]
}>()

// 事件
const emit = defineEmits<{
    (event: "PostByMonth", val: MonthArchiveData): void
}>()

// 参考官方文档 https://element-plus.org/zh-CN/component/table.html#table-%E4%BA%8B%E4%BB%B6

const handleRowClick = (row: MonthArchiveData) => {
    console.log({ row })
    emit("PostByMonth", row)
}
</script>
<style scoped lang="scss">
.aside-item {
    border: 1px solid var(--jpz-border-color);
    background-color: var(--jpz-bg-color);
    border-radius: 5px;
}

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

.aside-icon {
    font-size: 20px;
    margin-right: 5px;
    fill: var(--jpz-color-secondary);
}

:deep(.month-archive-row-class) {
    cursor: pointer;
}
</style>
