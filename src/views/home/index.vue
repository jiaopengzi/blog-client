<!--
 * @FilePath     : \blog-client\src\views\home\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 首页
-->

<template>
    <div class="page">
        <LayoutHeader @handle-search="handleSearch" />
        <LayoutHome :search-key-word="searchKeyWord" />
        <LayoutFooter />
    </div>

    <el-backtop :bottom="100" class="backtop-container">
        <div class="backtop">UP</div>
    </el-backtop>
</template>

<script setup lang="ts">
import { ref } from "vue"

import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"

import LayoutHome from "./component"

defineOptions({ name: "PageHome" })

const searchKeyWord = ref("") // 搜索关键字

const handleSearch = (val: string) => {
    console.log("搜索内容:", val)
    searchKeyWord.value = val
}
</script>

<style scoped lang="scss">
// 返回顶部容器
.backtop-container {
    // 位置参考 main.scss中的 z-index 管理
    z-index: 999;

    .backtop {
        height: 100%;
        width: 100%;
        text-align: center;
        line-height: 40px;
        color: var(--jpz-color-primary);
    }
}
</style>
