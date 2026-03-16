<!--
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\stats\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 统计信息
-->

<template>
    <div class="stats-container">
        <div class="stats-head">
            <h4>统计信息</h4>
            <button class="visibility-toggle" type="button" @click="toggleStatsVisibility">
                <el-icon class="visibility-icon"><component :is="isShowStatsValue ? View : Hide" /></el-icon>
                <span>{{ isShowStatsValue ? "隐藏数值" : "显示数值" }}</span>
            </button>
        </div>
        <div class="cards-container">
            <div class="cards-item" v-for="item in localStats" :key="item.key">
                <ChartCard
                    :name="item.key"
                    :label="item.label"
                    :value="item.value"
                    :display-value="item.displayValue"
                    :is-amount-fen="item.isAmountFen"
                    :is-click="item.isClick"
                    @card-click="handleCardClick"
                />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Hide, View } from "@element-plus/icons-vue"
import { computed, onBeforeMount, ref } from "vue"
import { useRouter } from "vue-router"

import { CommentReviewCode } from "@/api/comment/common"
import { StatsResKey, StatsResKeyDisplay } from "@/api/dashboard/common"
import { type StatsRes } from "@/api/dashboard/stats"
import ChartCard from "@/components/common/chart-card"
import { RouteNames } from "@/router"
import { LocalStorageKey } from "@/stores/local"

import { useDashboard } from "../hooks"

defineOptions({ name: "DashboardStats" })

const { stats, getStats } = useDashboard()
const router = useRouter()

const savedIsShowStatsValue = localStorage.getItem(LocalStorageKey.IsShowDashboardStats)
const isShowStatsValue = ref(savedIsShowStatsValue !== null ? savedIsShowStatsValue === "true" : true)

// 事件
const emit = defineEmits<{
    (event: "card-click", label: string): void
}>()

const localStats = computed(() => {
    // 构建结果数组
    const result: Array<{ key: StatsResKey; label: string; value: number; displayValue?: string; isAmountFen: boolean; isClick: boolean }> = []

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
            if (isClickList.includes(key) && (stats.value as StatsRes)[key] > 0) {
                isClick = true
            }

            result.push({
                key,
                label,
                value: (stats.value as StatsRes)[key],
                displayValue: isShowStatsValue.value ? undefined : "****",
                isAmountFen,
                isClick,
            })
        }
    }

    return result
})

// toggleStatsVisibility 切换统计卡片敏感数值的显示状态, 并写入 localStorage.
const toggleStatsVisibility = () => {
    isShowStatsValue.value = !isShowStatsValue.value
    localStorage.setItem(LocalStorageKey.IsShowDashboardStats, isShowStatsValue.value.toString())
}

// 处理卡片点击事件
const handleCardClick = async (name: string) => {
    if (name === StatsResKey.CommentCountPending) {
        await router.push({
            name: RouteNames.Comment,
            query: {
                status: CommentReviewCode.Pending.toString(),
            },
        })
        return
    }

    emit("card-click", name)
}

onBeforeMount(async () => {
    await getStats()
})
</script>
<style scoped lang="scss">
.stats-container {
    margin-bottom: 40px;

    .stats-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 24px;
    }

    h4 {
        font-size: 16px;
        font-weight: 600;
        color: var(--jpz-text-color-primary);
        margin: 0;
        padding-left: 12px;
        border-left: 4px solid var(--jpz-text-color-primary);
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }

    .visibility-toggle {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        border: 1px solid color-mix(in srgb, var(--jpz-border-color) 72%, transparent);
        border-radius: 999px;
        background: linear-gradient(135deg, color-mix(in srgb, var(--jpz-bg-color) 92%, #8aa0b8 8%), var(--jpz-bg-color));
        color: var(--jpz-text-color-primary);
        padding: 8px 14px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.4px;
        cursor: pointer;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;

        &:hover {
            transform: translateY(-1px);
            border-color: color-mix(in srgb, var(--jpz-text-color-primary) 28%, transparent);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        .visibility-icon {
            font-size: 16px;
        }
    }

    .cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 24px;
    }

    .cards-item {
        display: flex;

        :deep(.card-container),
        :deep(.card-container-click) {
            width: 100%;
            min-height: 120px;
        }
    }

    @media (max-width: 768px) {
        .stats-head {
            align-items: flex-start;
            flex-direction: column;
        }
    }
}
</style>
