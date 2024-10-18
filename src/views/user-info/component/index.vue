<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 10:39:24
 * @FilePath     : \blog-client\src\views\user-info\component\index.vue
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
import UserInfoPC from "./pc.vue"
import UserInfoPhone from "./phone.vue"

defineOptions({ name: "UserInfo" })
</script>
<style scoped lang="scss"></style>
