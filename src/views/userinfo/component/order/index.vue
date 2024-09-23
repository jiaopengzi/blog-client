<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 21:29:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 22:43:09
 * @FilePath     : \blog-client\src\components\layout\content\userinfo\order\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
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
import UserInfoOrderPC from './pc.vue'
import UserInfoOrderPhone from './phone.vue'
defineOptions({ name: 'UserInfoOrder' })

</script>
<style scoped lang="scss"></style>