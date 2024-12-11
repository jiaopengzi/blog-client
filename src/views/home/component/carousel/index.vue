<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:24:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 13:30:53
 * @FilePath     : \blog-client\src\components\layout\content\main\carousel\index.vue
 * @Description  : 轮播图
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="block text-center">
        <el-carousel>
            <el-carousel-item v-for="item in 4" :key="item">
                <h3 class="small justify-center" text="2xl">{{ item }}</h3>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: "Carousel" })
</script>

<style scoped>
.demonstration {
    color: var(--jpz-text-color-secondary);
}

.el-carousel {
    border-radius: 4px;
    height: 300px;
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>
