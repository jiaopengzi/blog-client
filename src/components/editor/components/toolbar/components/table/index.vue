<!--
 * FilePath    : blog-client-dev\src\components\editor\components\toolbar\components\table\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 表格组件
-->

<template>
    <el-popover
        placement="bottom"
        width="260"
        trigger="hover"
        popper-class="popper-class"
        popper-style="background-color: transparent; border: none; box-shadow: none;"
        :show-arrow="false"
        :offset="0"
    >
        <template #reference>
            <j-icon :name="icon" custom-class="iconfont" />
        </template>

        <div class="table-row-col">
            <div class="row">
                <span>行数：</span>
                <el-input-number v-model="row" :min="1" :max="10000" controls-position="right" @change="handleRowChange" />
            </div>

            <div class="col">
                <span>列数：</span>
                <el-input-number v-model="col" :min="1" :max="10000" controls-position="right" @change="handleColChange" />
            </div>
            <el-button type="primary" @click="handleTableRowCol">插入表格</el-button>
        </div>
    </el-popover>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import type { IconKeys } from "@/components/common/icons"

import { type TableRowCol } from "./types"

defineOptions({ name: "BarTable" })

// 定义 props
const { icon } = defineProps<{
    icon: IconKeys // 预览内容
}>()

// 子组件 传参
const emit = defineEmits<{
    (e: "table-row-col", tableRowCol: TableRowCol): void
}>()

// 插入表格的行列数
const row = ref(3)
const col = ref(3)

// 表格行列数变化
const handleRowChange = (value: number) => {
    row.value = value
}

// 表格行列数变化
const handleColChange = (value: number) => {
    col.value = value
}

// 插入表格
const handleTableRowCol = () => {
    emit("table-row-col", { row: row.value, col: col.value })
}
</script>

<style scoped lang="scss">
.table-row-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: var(--jpz-bg-color);

    .row,
    .col {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        span {
            margin-right: 10px;
        }
    }
}

.iconfont {
    width: 28px;
    height: 28px;
    font-size: 20px;
    fill: var(--jpz-text-color-primary);
    transition: fill 0.3s ease;
    border-radius: 4px;
}

.iconfont:hover {
    background-color: var(--jpz-text-color-secondary);
}

.popper-class {
    background: transparent;
    border: none;
    box-shadow: none;
}
</style>
