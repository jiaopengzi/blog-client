<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-07 18:11:08
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
import { watch } from "vue"

import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import { useUserStore } from "@/stores/user"
import LayoutHome from "@/views/home/component"

// 监控 isSetupDB 数据库是否初始化
const userStore = useUserStore()

watch(
    () => userStore.isSetupDB,
    (value) => {
        if (!value) {
            // 初始化数据库
            console.log("开始初始化数据库")
        }
    },
)

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
