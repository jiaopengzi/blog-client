<!--
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\dashboard\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 后台首页
-->

<template>
    <div class="container">
        <DashboardStats />
        <DashboardTrend />
        <DashboardVersion />
    </div>
</template>
<script setup lang="ts">
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/components/views/admin/component/aside"

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
}
</style>
