<!--
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\trend\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 趋势信息
-->
<template>
    <div class="trend-container">
        <h4>趋势图表信息</h4>
        <div class="trend-select">
            <!-- 分类选择 -->
            <div class="trend-select-item">
                <el-select v-model="valueCategory" placeholder="Select" style="width: 160px">
                    <el-option v-for="item in optionsCategory" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>

            <!-- 时间维度选择 -->
            <div class="trend-select-item">
                <el-select v-model="valueTime" placeholder="Select" style="width: 160px">
                    <el-option v-for="item in optionsTime" :key="item.name" :label="item.label" :value="item.name" />
                </el-select>
            </div>
        </div>

        <!-- 图表 -->
        <div class="trend-chart">
            <chart-bar-basic :title="title" :data="trendData.rows" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, type Ref, ref, watch } from "vue"

import { getTrendCategoryOptions, TrendCategory, TrendCategoryDisplay } from "@/api/dashboard/common"
import ChartBarBasic from "@/components/common/chart-bar-basic"

import { useDashboard } from "../hooks"
import { getSavedTrendSelection, persistTrendSelection, useTrend } from "./hooks"
import { DimensionItemName, DimensionItemNameDisplay } from "./types"

defineOptions({ name: "DashboardTrend" })

// 使用 dashboard hooks
const { trendData, getTrend, updateTrendReq } = useDashboard()

// 使用 trend hooks
const { allDimensionMap, getAllDimension } = useTrend()

const savedTrendSelection = getSavedTrendSelection()

// 分类选择项和值
const optionsCategory = ref(getTrendCategoryOptions())
const valueCategory: Ref<TrendCategory> = ref(savedTrendSelection?.category ?? TrendCategory.UserCount)

// 时间维度选择项和值
const optionsTime = ref(getAllDimension())
const valueTime: Ref<DimensionItemName> = ref(savedTrendSelection?.time ?? DimensionItemName.ThisMonth)

// 图表标题
const title = computed(() => {
    return `${DimensionItemNameDisplay[valueTime.value]}${TrendCategoryDisplay[valueCategory.value]}`
})

// 监听变化
watch(
    [valueCategory, valueTime],
    async ([newCategory, newTime]) => {
        persistTrendSelection(newCategory, newTime)
        updateTrendReq(newCategory, allDimensionMap.get(newTime)!.dimension, allDimensionMap.get(newTime)!.is_current)
        await getTrend()
    },
    { immediate: true },
)
</script>
<style scoped lang="scss">
.trend-container {
    margin-top: 48px;

    h4 {
        font-size: 16px;
        font-weight: 600;
        color: var(--jpz-text-color-primary);
        margin-bottom: 24px;
        padding-left: 12px;
        border-left: 4px solid var(--jpz-text-color-primary);
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }

    .trend-select {
        margin-bottom: 24px;
        padding: 16px;
        background-color: var(--jpz-bg-color);
        border: 1px solid var(--jpz-border-color-lighter);
        border-radius: 6px;
        display: inline-flex;
        gap: 16px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        align-items: center;
    }

    .trend-chart {
        margin-top: 0;
    }
}
</style>
