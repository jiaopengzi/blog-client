<!--
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\page-write\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 页面新增与编辑
-->

<template>
    <section>
        <PostUpsert :route-name="RouteNames.PageWrite" :post-type="PostType.Page" :head-title="adminMenuItemMap[RouteNames.PageWrite].text" />
    </section>
</template>
<script lang="ts" setup>
import { PostType } from "@/api/post/common"
import PostUpsert from "@/components/common/post-upsert/index.vue"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/components/views/admin/component/aside"

defineOptions({ name: RouteNames.PageWrite })
</script>
