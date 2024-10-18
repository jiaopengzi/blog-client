<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 10:37:10
 * @FilePath     : \blog-client\src\views\user-info\component\order\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 10:37:06
 * @FilePath     : \blog-client\src\views\user-info\component\order\index.vue
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
import UserInfoOrderPC from "./pc.vue"
import UserInfoOrderPhone from "./phone.vue"
defineOptions({ name: "UserInfoOrder" })
</script>
<style scoped lang="scss"></style>
