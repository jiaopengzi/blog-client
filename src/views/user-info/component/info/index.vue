<!--
 * @FilePath     : \blog-client\src\views\user-info\component\info\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 用户信息组件 信息
-->

<template>
    <div class="pc">
        <UserInfoInfoPC />
    </div>
    <div class="phone">
        <UserInfoInfoPhone />
    </div>
</template>
<script setup lang="ts">
import UserInfoInfoPC from "./pc.vue"
import UserInfoInfoPhone from "./phone.vue"

defineOptions({ name: "UserInfoInfo" })
</script>
<style scoped lang="scss"></style>
