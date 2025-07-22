<!--
 * FilePath    : blog-client\src\views\admin\component\main\page-all\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 页面列表
-->

<template>
    <section>
        <PostListAdmin
            :route-name="RouteNames.PageAll"
            :write-route-name="RouteNames.PageWrite"
            :post-type="PostType.Page"
            :head-title="adminMenuItemMap[RouteNames.PageAll].text"
        />
    </section>
</template>
<script lang="ts" setup>
import { PostType } from "@/api/post/common"
import PostListAdmin from "@/components/common/post-list-admin"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"

defineOptions({ name: RouteNames.PageAll })
</script>
