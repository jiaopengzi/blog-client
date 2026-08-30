<!--
 * FilePath    : blog-client-nuxt\src\pages\__test-404.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 404 错误渲染测试页
-->
<script setup lang="ts">
definePageMeta({ layout: false })
throw createError({ status: 404, statusMessage: "test 404 render" })
</script>

<template>
    <div>不应看到此内容</div>
</template>
