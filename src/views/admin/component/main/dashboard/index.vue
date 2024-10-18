<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-25 14:23:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 08:52:27
 * @FilePath     : \blog-client\src\views\admin\component\main\dashboard\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="container">首页面板</div>
</template>
<script setup lang="ts">
import { AdminSideMenu } from "@/views/admin/component/aside"

defineOptions({ name: AdminSideMenu.Dashboard })
</script>
<style scoped lang="scss">
.container {
    height: 100%;
    width: 100%;
    background-color: red;
}
</style>
