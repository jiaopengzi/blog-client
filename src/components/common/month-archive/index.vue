<!--
 * @FilePath     : \blog-client\src\components\common\month-archive\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 月度归档
-->

<template>
    <div class="aside-item">
        <div class="title">
            <h2><j-icon :name="IconKeys.Archive" custom-class="aside-icon" />文章归档</h2>
        </div>
        <div v-if="noData" class="no-data-box">
            <el-empty description="暂无数据" />
        </div>
        <div v-else class="table">
            <el-table :max-height="400" :data="postList" :show-header="true" row-class-name="month-archive-row-class" @row-click="handleRowClick">
                <el-table-column prop="year_month" label="年月" align="center">
                    <template #default="scope">
                        <!-- 将月份补全为两位数 -->
                        <span>{{ scope.row.year }}-{{ String(scope.row.month).padStart(2, "0") }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="count" label="文章" align="center" />
            </el-table>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue"

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

// 是否没有数据
const noData = computed(() => {
    const flag = postList.length === 0
    return flag
})

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

.no-data-box {
    width: 100%;
    height: 160px;
    .el-empty {
        padding: 10px;
        :deep(.el-empty__image) {
            width: 80px;
            height: 80px;
        }
    }
}
</style>
