<!--
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\post-all\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章列表
-->

<template>
    <section>
        <PostListAdmin
            :route-name="RouteNames.PostAll"
            :write-route-name="RouteNames.PostWrite"
            :post-type="PostType.Post"
            :head-title="adminMenuItemMap[RouteNames.PostAll].text"
        />
    </section>
</template>
<script lang="ts" setup>
import { PostType } from "@/api/post/common"
import PostListAdmin from "@/components/common/post-list-admin"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/components/views/admin/component/aside"

defineOptions({ name: RouteNames.PostAll })
</script>
