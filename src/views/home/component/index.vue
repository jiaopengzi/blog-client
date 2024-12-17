<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:44:33
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-17 18:47:44
 * @FilePath     : \blog-client\src\views\home\component\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="pc">
        <HomePC />
    </div>
    <div class="pad">
        <HomePad />
    </div>
    <div class="phone">
        <HomePhone />
    </div>
</template>
<script setup lang="ts">
import { reactive, provide } from "vue"
import type { PaginationRequest } from "@/components/common"
import { useGetHomeData } from "@/components/hooks/useGetHomeData"

import HomePC from "./pc.vue"
import HomePad from "./pad.vue"
import HomePhone from "./phone.vue"

defineOptions({ name: "LayoutHome" })

const mainReq = reactive<PaginationRequest>({} as PaginationRequest)

const { pagination, updateCurrentPage, updatePageSize } = useGetHomeData(mainReq)
provide("pagination", pagination)
provide("updateCurrentPage", updateCurrentPage)
provide("updatePageSize", updatePageSize)
</script>
<style scoped lang="scss"></style>
