<!--
 * @FilePath     : \blog-client\src\views\user-info\component\favorite\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 用户信息组件 收藏
-->

<template>
    <div class="pc">
        <UserInfoFavoritePC />
    </div>
    <div class="phone">
        <UserInfoFavoritePhone />
    </div>
</template>
<script setup lang="ts">
import UserInfoFavoritePC from "./pc.vue"
import UserInfoFavoritePhone from "./phone.vue"

defineOptions({ name: "UserInfoFavorite" })
</script>
<style scoped lang="scss"></style>
