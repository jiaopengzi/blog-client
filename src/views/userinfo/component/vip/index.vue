<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 21:31:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 21:34:14
 * @FilePath     : \blog-client\src\components\layout\content\userinfo\vip\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
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
import UserInfoVipPC from './pc.vue'
import UserInfoVipPhone from './phone.vue'

defineOptions({ name: 'UserInfoVip' })

</script>
<style scoped lang="scss"></style>