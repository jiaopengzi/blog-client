<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 21:24:53
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 21:26:38
 * @FilePath     : \blog-client\src\components\layout\content\userinfo\comment\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
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
import { defineAsyncComponent } from 'vue'

// import UserInfoFavoritePC from './pc.vue'
// import UserInfoFavoritePhone from './phone.vue'
const UserInfoFavoritePC = defineAsyncComponent(() => import('./pc.vue'))
const UserInfoFavoritePhone = defineAsyncComponent(() => import('./pc.vue'))

defineOptions({ name: 'UserInfoFavorite' })

</script>
<style scoped lang="scss"></style>