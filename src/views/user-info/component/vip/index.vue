<!--
 * @FilePath     : \blog-client\src\views\user-info\component\vip\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 用户信息组件 VIP 
-->

<template>
    <div class="pc">
        <UserInfoVipPC />
    </div>
    <div class="phone">
        <UserInfoVipPhone />
    </div>
</template>
<script setup lang="ts">
import UserInfoVipPC from "./pc.vue"
import UserInfoVipPhone from "./phone.vue"

defineOptions({ name: "UserInfoVip" })
</script>
<style scoped lang="scss"></style>
