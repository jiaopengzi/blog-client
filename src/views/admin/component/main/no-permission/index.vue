<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\no-permission\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 无权限路由入口
-->

<template>
    <NoPermissionView />
</template>
<script setup lang="ts">
import { RouteNames } from "@/router"

import NoPermissionView from "./NoPermissionView.vue"

defineOptions({ name: RouteNames.NoPermission })
</script>
