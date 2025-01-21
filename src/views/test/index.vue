<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-10-19 10:58:05
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-21 16:31:38
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div :class="{ 'full-screen': isFullScreen }" class="content-container">
        <button type="button" @click="toggleFullScreen">
            {{ isFullScreen ? "Exit Full Screen" : "Enter Full Screen" }}
        </button>
        <div class="content">
            <!-- 你的内容在这里 -->
            <p>这里是网页内容...</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const isFullScreen = ref(false)

const toggleFullScreen = () => {
    isFullScreen.value = !isFullScreen.value
}
</script>

<style scoped lang="scss">
.content-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #f9f9f9;
    transition: all 0.3s ease;

    &.full-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        padding: 0;
        z-index: 1000;
        background-color: #fff;
    }
}

button {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.content {
    margin-top: 50px;
    /* 其他内容样式 */
}
</style>
