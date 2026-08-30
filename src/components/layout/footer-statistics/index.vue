<!--
 * FilePath    : blog-client-nuxt\src\components\layout\footer-statistics\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 公开页统计脚本挂载器 (P0-4 nuxt4-good: 已知 GA/百度统计经 @nuxt/scripts 加载)
-->

<!--
 * 补充说明:
 * 后端 footer_statistics_code 为任意脚本串——先解析出 GA/百度 id 交 StatScripts
 * (registry composable, onNuxtReady 触发, admin 无公开布局天然屏蔽);
 * 剥离已知块后的残余内容(其它自定义统计)仍走原字符串注入通道, 保持后台配置兼容
-->

<template>
    <span v-if="false" />

    <!-- 已知统计: GA registry + 百度 useScript, id 就绪后按需挂载 -->
    <StatScripts v-if="statGaIds.length > 0 || statBaiduId" :ga-ids="statGaIds" :baidu-id="statBaiduId" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { computed, nextTick, onMounted, watch } from "vue"

import StatScripts from "@/components/common/stat-scripts"
import { useOptionsStore } from "@/stores/options"
import {
    enableFooterStatisticsScript,
    extractBaiduAnalyticsSiteIds,
    extractGoogleAnalyticsMeasurementIds,
    stripKnownAnalyticsScriptBlocks,
} from "@/utils/footerStatistics"

defineOptions({ name: "FooterStatistics" })

const optionsStore = useOptionsStore()
const { footer_statistics_code } = storeToRefs(optionsStore)

// 解析已知统计 id (GA/百度), 交由 StatScripts 经 @nuxt/scripts 加载
const statGaIds = computed(() => extractGoogleAnalyticsMeasurementIds(footer_statistics_code.value))
const statBaiduId = computed(() => extractBaiduAnalyticsSiteIds(footer_statistics_code.value)[0] ?? "")

// 已知统计块剥离后的残余内容 (后台配置的其它自定义脚本), 走原字符串注入通道
const residualCode = computed(() =>
    stripKnownAnalyticsScriptBlocks(footer_statistics_code.value, statGaIds.value, extractBaiduAnalyticsSiteIds(footer_statistics_code.value)),
)

/**
 * 在当前公开页 DOM 稳定后再挂载残余统计脚本, 保证统计脚本位于页面内容之后
 * @param scriptStr 残余统计脚本字符串
 * @returns Promise<void>
 */
const mountResidualStatistics = async (scriptStr: string | undefined): Promise<void> => {
    if (!scriptStr?.trim()) {
        return
    }

    await nextTick()
    await enableFooterStatisticsScript(scriptStr)
}

onMounted(() => {
    void mountResidualStatistics(residualCode.value)
})

watch(residualCode, (newVal, oldVal) => {
    if (newVal === oldVal) {
        return
    }

    void mountResidualStatistics(newVal)
})
</script>
