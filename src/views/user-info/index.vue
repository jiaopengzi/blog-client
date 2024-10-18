<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 10:40:44
 * @FilePath     : \blog-client\src\views\user-info\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="page">
        <LayoutHeader />
        <UserInfo />
        <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import LayoutHeader from "@/components/layout/header"
import UserInfo from "@/views/user-info/component"
import LayoutFooter from "@/components/layout/footer"

defineOptions({ name: "PageUserInfo" })
</script>

<style scoped lang="scss"></style>
