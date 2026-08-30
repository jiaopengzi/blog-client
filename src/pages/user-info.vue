<!--
 * FilePath    : blog-client-nuxt\src\pages\user-info.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 用户信息页(阶段 6: 真实视图接入)
-->

<!--
 * 补充说明:
 * 渲染 SPA views/user-info 迁移视图(src/components/views/user-info);
 * layout:false(视图自带 header/面包屑/内容/页脚, 无侧栏, 与 SPA 一致);
 * 纯 CSR(routeRules /user-info ssr:false); 未登录由 middleware/auth.global.ts 跳登录
-->

<script setup lang="ts">
import UserInfoView from "@/components/views/user-info"

// 路由名与 SPA RouteNames.UserInfo 对齐; 视图自组合布局(无默认布局)
definePageMeta({ layout: false, name: "user-info" })
</script>

<template>
    <UserInfoView />
</template>
