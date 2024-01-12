<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 21:29:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 21:32:33
 * @FilePath     : \blog-client\src\components\layout\content\userinfo\post\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
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
import UserInfoPostPC from './pc.vue'
import UserInfoPostPhone from './phone.vue'

defineOptions({ name: 'UserInfoPost' })

</script>
<style scoped lang="scss"></style>