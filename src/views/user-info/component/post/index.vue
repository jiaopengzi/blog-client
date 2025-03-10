<!--
 * @FilePath     : \blog-client\src\views\user-info\component\post\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 用户信息组件 文章 
-->

<template>
    <div class="pc">
        <UserInfoPostPC />
    </div>
    <div class="phone">
        <UserInfoPostPhone />
    </div>
</template>
<script setup lang="ts">
import UserInfoPostPC from "./pc.vue"
import UserInfoPostPhone from "./phone.vue"

defineOptions({ name: "UserInfoPost" })
</script>
<style scoped lang="scss"></style>
