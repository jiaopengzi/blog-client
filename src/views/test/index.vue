<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-18 11:19:15
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="demo-image__lazy">
        <el-image v-for="url in urls" :key="url" :src="url" lazy />
    </div>
</template>

<script lang="ts" setup>
const urls = [
    "https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-1.png",
    "https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-2.png",
    "https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-3.png",
    "https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-4.png",
    "https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-5.png",
    "https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-6.png",
    "https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-7.png",
    "https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-8.png",
    "https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-9.png",
]
</script>

<style scoped ts="scss">
.demo-image__lazy {
    /* height: 400px; */
    /* overflow-y: auto; */
}
.demo-image__lazy .el-image {
    /* display: block; */
    min-height: 200px;
    margin-bottom: 10px;
}
.demo-image__lazy .el-image:last-child {
    margin-bottom: 0;
}
</style>
