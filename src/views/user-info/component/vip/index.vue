<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 10:38:40
 * @FilePath     : \blog-client\src\views\user-info\component\vip\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 10:38:36
 * @FilePath     : \blog-client\src\views\user-info\component\vip\index.vue
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
import UserInfoVipPC from "./pc.vue"
import UserInfoVipPhone from "./phone.vue"

defineOptions({ name: "UserInfoVip" })
</script>
<style scoped lang="scss"></style>
