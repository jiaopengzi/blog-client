<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\dashboard\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 后台首页  
-->

<template>
    <div class="container">
        <h1>仪表板</h1>
        <DashboardStats />
        <DashboardTrend />
        <DashboardVersion />
    </div>
</template>
<script setup lang="ts">
import { useHead } from "@unhead/vue"

import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import DashboardStats from "./stats"
import DashboardTrend from "./trend"
import DashboardVersion from "./version"

defineOptions({ name: RouteNames.Dashboard })

useHead({
    title: adminMenuItemMap[RouteNames.Dashboard].text,
})
</script>
<style scoped lang="scss">
.container {
    padding: 20px;

    h1 {
        font-size: 24px;
        font-weight: 700;
        color: var(--jpz-text-color-primary);
        margin-bottom: 20px;
    }
}
</style>
