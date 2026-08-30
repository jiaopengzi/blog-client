<!--
 * FilePath    : blog-client-nuxt\src\pages\[...slug].vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 未匹配路径兜底 → 404 (SEO 正确语义)
-->

<!--
 * 补充说明:
 * /admin 子路径由 pages/admin.vue + pages/admin/[...slug].vue 承接, 不会命中本兜底
-->

<script setup lang="ts">
// 路由名与 SPA RouteNames.NotFound ("not-found") 对齐
definePageMeta({ name: "not-found" })

// 任何未匹配的路径都渲染 404 且返回 HTTP 404
// 不加 fatal: true(260825-02 bug04 约定): nitropack 的 defaultHandler 以
// `error.unhandled || error.fatal` 判定 isSensitive 并 console.error 输出
// "[request error] [fatal]" 堆栈; 未匹配路径属高频正常 404(扫描器/失效外链),
// 若带 fatal 会把服务端堆栈噪音打满终端. 去掉后仍返回真 404 状态码与错误页.
throw createError({ statusCode: 404, message: "页面不存在" })
</script>

<template>
    <div />
</template>
