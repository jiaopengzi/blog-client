<!--
 * FilePath    : blog-client\src\components\layout\footer-statistics\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 公开页统计脚本挂载器
-->

<template>
    <span v-if="false" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { nextTick, onMounted, watch } from "vue"

import { useOptionsStore } from "@/stores/options"
import { enableFooterStatisticsScript } from "@/utils/footerStatistics"

defineOptions({ name: "FooterStatistics" })

const optionsStore = useOptionsStore()
const { footer_statistics_code } = storeToRefs(optionsStore)

/**
 * 判断当前统计脚本是否存在有效内容.
 *
 * @param scriptStr 统计脚本字符串.
 * @returns 存在有效统计脚本内容时返回 true, 否则返回 false.
 */
const hasFooterStatisticsCode = (scriptStr: string | undefined): boolean => {
    return !!scriptStr?.trim()
}

/**
 * 在当前公开页 DOM 稳定后再挂载统计脚本, 保证统计脚本位于页面内容之后.
 *
 * @param scriptStr 统计脚本字符串.
 * @returns Promise<void>.
 */
const mountFooterStatistics = async (scriptStr: string | undefined): Promise<void> => {
    if (!hasFooterStatisticsCode(scriptStr)) {
        return
    }

    await nextTick()
    await enableFooterStatisticsScript(scriptStr)
}

onMounted(() => {
    void mountFooterStatistics(footer_statistics_code.value)
})

watch(footer_statistics_code, (newVal, oldVal) => {
    if (newVal === oldVal) {
        return
    }

    void mountFooterStatistics(newVal)
})
</script>
