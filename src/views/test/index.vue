<!--
 * FilePath    : blog-client\src\views\user-info\component\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 用户信息组件
-->

<template>
    <!-- 内容页 -->
    <div class="content">
        <el-tabs type="border-card" tab-position="left" v-model="activeTab">
            <el-tab-pane> test </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

defineOptions({ name: "UserInfo" })
// 当前激活的 tab
const activeTab = ref("test")
</script>
<style scoped lang="scss"></style>
