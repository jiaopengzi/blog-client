<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 写文章
-->

<template>
    <section>
        <PostUpsert :route-name="RouteNames.PostWrite" :post-type="PostType.Post" :head-title="adminMenuItemMap[RouteNames.PostWrite].text" />
    </section>
</template>
<script lang="ts" setup>
import { PostType } from "@/api/post/common"
import PostUpsert from "@/components/common/post-upsert"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"

defineOptions({ name: RouteNames.PostWrite })
</script>
