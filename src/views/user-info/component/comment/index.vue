<!--
 * @FilePath     : \blog-client\src\views\user-info\component\comment\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 用户信息组件 评论
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
import UserInfoCommentPC from "./pc.vue"
import UserInfoCommentPhone from "./phone.vue"

defineOptions({ name: "UserInfoComment" })
</script>
<style scoped lang="scss"></style>
