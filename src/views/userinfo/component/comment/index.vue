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
        <UserInfoCommentPC />
    </div>
    <div class="phone">
        <UserInfoCommentPhone />
    </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// import UserInfoCommentPC from './pc.vue'
// import UserInfoCommentPhone from './phone.vue'
const UserInfoCommentPC = defineAsyncComponent(() => import('./pc.vue'))
const UserInfoCommentPhone = defineAsyncComponent(() => import('./pc.vue'))

defineOptions({ name: 'UserInfoComment' })

</script>
<style scoped lang="scss"></style>