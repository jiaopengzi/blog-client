<!--
 * FilePath    : blog-client-nuxt\src\components\common\month-archive\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 月度归档
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
            <el-table
                :max-height="tableMaxHeight"
                :data="postList"
                :show-header="true"
                header-row-class-name="header-month-archive-row"
                row-class-name="month-archive-row"
                @row-click="handleRowClick"
            >
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
import { computed, onMounted, ref } from "vue"

import { IconKeys } from "@/components/common/icons"

import { type MonthArchiveData } from "./types"

defineOptions({ name: "MonthArchive" })

const { postList } = defineProps<{
    postList: MonthArchiveData[]
}>()

const emit = defineEmits<{
    (event: "PostByMonth", val: MonthArchiveData): void
}>()

// feature01(02-plan) 水合修复: el-table 的 max-height 在 SSR 直出为内联样式,
// 而客户端首帧渲染为空样式, 产生 hydration style mismatch;
// 水合期(挂载前)不传 max-height, 挂载后再恢复 400, 与服务端首帧一致.
const isMounted = ref(false)
onMounted(() => {
    isMounted.value = true
})

// tableMaxHeight 水合期返回 undefined, 挂载后返回 400
const tableMaxHeight = computed(() => (isMounted.value ? 400 : undefined))

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

:deep(.header-month-archive-row) {
    .el-table__cell {
        background-color: var(--jpz-bg-color);
    }
}

:deep(.month-archive-row) {
    cursor: pointer;
    background-color: var(--jpz-bg-color);
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
