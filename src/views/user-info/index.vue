<!--
 * @FilePath     : \blog-client\src\views\user-info\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 用户信息页面
-->

<template>
    <div class="page">
        <LayoutHeader />
        <UserInfo />
        <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import UserInfo from "@/views/user-info/component"

defineOptions({ name: "PageUserInfo" })
</script>

<style scoped lang="scss"></style>
