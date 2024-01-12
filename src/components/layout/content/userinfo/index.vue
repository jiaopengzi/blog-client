<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 21:22:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 21:22:28
 * @FilePath     : \blog-client\src\components\layout\content\userinfo\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
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
import UserInfoPC from './pc.vue'
import UserInfoPhone from './phone.vue'

defineOptions({ name: 'UserInfo' })

</script>
<style scoped lang="scss"></style>