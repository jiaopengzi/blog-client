<!--
 * FilePath    : blog-client-nuxt\src\pages\checkout.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 结算支付页 (阶段 6: 真实视图接入)
-->

<!--
 * 补充说明:
 * 渲染 SPA views/checkout 迁移视图 (src/components/views/checkout)
 * layout:false (视图自带结算页布局 + FooterStatistics)
 * 纯 CSR (routeRules /checkout ssr:false, 订单数据来自客户端支付流程)
 * SPA checkoutMiddleware (进入时 updatePayConfig) 等价为 setup 内 await
 * 未登录由 middleware/auth.global.ts 跳登录
-->

<script setup lang="ts">
import CheckoutView from "@/components/views/checkout"
import { useOptionsStore } from "@/stores/options"

// 路由名与 SPA RouteNames.Checkout 对齐; 视图自组合布局 (无默认布局)
definePageMeta({ layout: false, name: "checkout" })

// 等价 SPA checkoutMiddleware: 进入支付页时更新支付信息配置
await useOptionsStore().updatePayConfig()
</script>

<template>
    <CheckoutView />
</template>
