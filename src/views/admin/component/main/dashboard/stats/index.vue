<!--
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\stats\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 统计信息
-->

<template>
    <div class="stats-container">
        <h4>统计信息</h4>
        <div class="cards-container">
            <div class="cards-item" v-for="item in localStats" :key="item.key">
                <ChartCard
                    :name="item.key"
                    :label="item.label"
                    :value="item.value"
                    :is-amount-fen="item.isAmountFen"
                    :is-click="item.isClick"
                    @card-click="handleCardClick"
                />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount } from "vue"

import { StatsResKey, StatsResKeyDisplay } from "@/api/dashboard/common"
import { type StatsRes } from "@/api/dashboard/stats"
import ChartCard from "@/components/common/chart-card"

import { useDashboard } from "../hooks"

defineOptions({ name: "DashboardStats" })

const { stats, getStats } = useDashboard()

// 事件
const emit = defineEmits<{
    (event: "card-click", label: string): void
}>()

const localStats = computed(() => {
    // 构建结果数组
    const result: Array<{ key: StatsResKey; label: string; value: number; isAmountFen: boolean; isClick: boolean }> = []

    // 如果没有 stats 则返回空数组
    if (!stats.value) return result

    // 以分记录的金额的 key 列表
    const isAmountFenList = [StatsResKey.OrderPaidTotalAmount, StatsResKey.OrderTotalAmount]

    // 可点击的 key 列表
    const isClickList = [StatsResKey.CommentCountPending]

    // 遍历 StatsResKeyDisplay 构建结果
    for (const k in StatsResKeyDisplay) {
        const key = k as StatsResKey
        const label = StatsResKeyDisplay[key]
        if (k in stats.value) {
            let isAmountFen = false
            let isClick = false

            if (isAmountFenList.includes(key)) {
                isAmountFen = true
            }
            if (isClickList.includes(key)) {
                isClick = true
            }

            result.push({ key, label, value: (stats.value as StatsRes)[key], isAmountFen, isClick })
        }
    }

    return result
})

// 处理卡片点击事件
const handleCardClick = (name: string) => {
    emit("card-click", name)
}

onBeforeMount(async () => {
    await getStats()
})
</script>
<style scoped lang="scss">
.stats-container {
    h4 {
        font-size: 18px;
        font-weight: 600;
        color: var(--jpz-text-color-primary);
        margin-bottom: 10px;
    }

    .cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }
}
</style>
