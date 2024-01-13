<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 20:58:50
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 21:05:26
 * @FilePath     : \blog-client\src\components\layout\content\userinfo\info\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
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
import UserInfoInfoPC from './pc.vue'
import UserInfoInfoPhone from './phone.vue'

defineOptions({ name: 'UserInfoInfo' })

</script>
<style scoped lang="scss"></style>