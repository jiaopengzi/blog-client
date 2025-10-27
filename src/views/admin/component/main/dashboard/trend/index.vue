<!--
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\trend\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 趋势信息
-->

<template>
    <div class="trend-container">
        <div class="trend-item">
            <chart-bar-basic title="当期" :data="trendData.rows" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onBeforeMount } from "vue"

import ChartBarBasic from "@/components/common/chart-bar-basic"

import { useDashboard } from "../hooks"

defineOptions({ name: "DashboardTrend" })

const { trendReq, trendData, getTrend, updateTrendReq } = useDashboard()

onBeforeMount(async () => {
    await getTrend()
})
</script>
<style scoped lang="scss">
.trend-container {
    .trend-item {
        margin-top: 20px;
    }
}
</style>
