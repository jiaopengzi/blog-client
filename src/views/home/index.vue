<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-17 10:30:02
 * @FilePath     : \blog-client\src\views\home\index.vue
 * @Description  : 首页
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="page">
        <LayoutHeader />
        <LayoutHome />
        <LayoutFooter />
    </div>

    <el-backtop :bottom="100" class="backtop-container">
        <div class="backtop">UP</div>
    </el-backtop>
</template>

<script setup lang="ts">
import LayoutHeader from "@/components/layout/header"
import LayoutHome from "@/views/home/component"
import LayoutFooter from "@/components/layout/footer"

defineOptions({ name: "PageHome" })
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
