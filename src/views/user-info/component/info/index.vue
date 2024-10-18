<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 10:35:51
 * @FilePath     : \blog-client\src\views\user-info\component\info\index.vue
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
import UserInfoInfoPC from "./pc.vue"
import UserInfoInfoPhone from "./phone.vue"

defineOptions({ name: "UserInfoInfo" })
</script>
<style scoped lang="scss"></style>
