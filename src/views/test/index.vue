<!--
 * FilePath    : blog-client\src\views\test\index.vue
 * Description : 测试父组件
-->
<template>
    <button @click="handleClick">更新</button>
</template>

<script lang="ts" setup>
import { type Reactive, reactive } from "vue"

import { type PostResPagination } from "@/api/post/common"
import { type Pagination } from "@/api/response"

defineOptions({ name: "MyTest" })

const data: Reactive<Pagination<PostResPagination>> = reactive({
    total: 0,
    current_page: 1,
    page_size: 10,
    page_count: 0,
    page_sizes: [10, 20, 30, 50],
    records: [],
    highlight: [],
})

const handleClick = () => {
    data.page_size = 20
}
</script>
