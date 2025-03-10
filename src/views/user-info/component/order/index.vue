<!--
 * @FilePath     : \blog-client\src\views\user-info\component\order\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 用户信息组件 订单
-->

<template>
    <div class="pc">
        <UserInfoOrderPC />
    </div>
    <div class="phone">
        <UserInfoOrderPhone />
    </div>
</template>
<script setup lang="ts">
import UserInfoOrderPC from "./pc.vue"
import UserInfoOrderPhone from "./phone.vue"
defineOptions({ name: "UserInfoOrder" })
</script>
<style scoped lang="scss"></style>
