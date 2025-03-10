<!--
 * @FilePath     : \blog-client\src\views\user-info\component\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 用户信息组件 
-->

<template>
    <div class="pc">
        <UserInfoPC />
    </div>
    <div class="phone">
        <UserInfoPhone />
    </div>
</template>
<script setup lang="ts">
import UserInfoPC from "./pc.vue"
import UserInfoPhone from "./phone.vue"

defineOptions({ name: "UserInfo" })
</script>
<style scoped lang="scss"></style>
