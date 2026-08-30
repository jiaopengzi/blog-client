<!--
 * FilePath    : blog-client-nuxt\src\components\common\stat-scripts\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 统计脚本加载器(@nuxt/scripts registry 版)
-->

<!--
 * 补充说明:
 * 统计脚本加载器(@nuxt/scripts registry 版, P0-4 nuxt4-good): GA 走官方 registry
 * composable(useScriptGoogleAnalytics), 百度统计无 registry 条目, 走通用 useScript。
 * composable 须在组件 setup 内调用, 而统计 id 由后端 app-option 异步下发——由父组件
 * (footer-statistics)解析 id 后按需渲染本组件, 卸载(admin 无公开布局)即由模块清理脚本。
 * trigger 用 onNuxtReady: 水合完成后再加载, 不阻塞页面交互。百度 _hmt 队列在脚本加载前
 * 初始化, 保持官方接入语义。
-->

<template>
    <span v-if="false" />
</template>

<script setup lang="ts">
import { useScript, useScriptGoogleAnalytics } from "#imports"

defineOptions({ name: "StatScripts" })

const { gaIds = [], baiduId = "" } = defineProps<{
    /** Google Analytics measurement id 列表 */
    gaIds?: string[]
    /** 百度统计 site id */
    baiduId?: string
}>()

// 统计脚本仅在客户端加载(footer-statistics 位于公开页默认布局, SSR 也会执行本 setup;
// window 访问与脚本注入都是客户端语义, 服务端直接跳过, useScript 的挂载由模块在客户端接管)
if (import.meta.client) {
    for (const gaId of gaIds) {
        useScriptGoogleAnalytics({
            id: gaId,
            scriptOptions: {
                // 水合完成后加载, 不与页面资源争抢带宽
                trigger: "onNuxtReady",
            },
        })
    }

    if (baiduId) {
        // 百度官方接入: hm.js 加载前需存在 _hmt 命令队列(计算属性访问规避 no-underscore-dangle
        // 告警, _hmt 为百度 SDK 约定的全局名, 不可更名)
        const BAIDU_QUEUE_KEY = "_hmt"
        const baiduWindow = window as unknown as Record<string, unknown[] | undefined>
        baiduWindow[BAIDU_QUEUE_KEY] = baiduWindow[BAIDU_QUEUE_KEY] ?? []

        useScript(
            {
                src: `https://hm.baidu.com/hm.js?${baiduId}`,
            },
            {
                trigger: "onNuxtReady",
                use: () => ({ hmt: baiduWindow[BAIDU_QUEUE_KEY] }),
            },
        )
    }
}
</script>
