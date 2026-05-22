<!--
 * FilePath    : blog-client\src\components\common\base-table\base-table-grid.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * @Description  : BaseTable 宫格视图
-->

<template>
    <el-checkbox-group
        :model-value="checkedRows"
        @update:model-value="emit('update-checked-rows', $event)"
        @change="emit('checked-grid-change', $event)"
        v-show="!showListOrGridStatus"
    >
        <el-empty v-if="!pagination.records || !(pagination.records.length > 0)" />

        <ul class="grid">
            <li v-for="(row, index) in pagination.records" :key="row.id" class="thumbnail grid-item">
                <el-checkbox v-if="isSelected(row)" class="grid-item-selection-status" :key="row" :value="row" size="large" />

                <img
                    v-if="getRowImg(row)?.url"
                    class="thumbnail-img"
                    :src="getRowImg(row)?.url"
                    :style="imgStyle(getRowImg(row)?.width, getRowImg(row)?.height, getRowImg(row)?.imgFit)"
                    v-single-dbl-click="clickInGridHandler(row)"
                />

                <j-icon
                    v-else-if="getRowImg(row)?.iconKeyName"
                    class="thumbnail-img"
                    :name="getRowImg(row)?.iconKeyName"
                    :style="iconStyle(getRowImg(row)?.svgFontSize)"
                    v-single-dbl-click="clickInGridHandler(row)"
                />

                <el-button v-if="isShowEdit" class="grid-item-edit" size="small" type="primary" @click="emit('edit', index, row)">{{
                    rowOperationText
                }}</el-button>
            </li>
        </ul>
    </el-checkbox-group>
</template>

<script lang="ts" setup>
import { iconStyle, imgStyle } from "@/utils/style"

import type { BaseTableGridProps, TableData } from "./types"

defineOptions({ name: "BaseTableGrid" })

defineProps<BaseTableGridProps>()

const emit = defineEmits<{
    (event: "update-checked-rows", rows: TableData[]): void
    (event: "checked-grid-change", rows: TableData[]): void
    (event: "edit", index: number, row: TableData): void
}>()
</script>
