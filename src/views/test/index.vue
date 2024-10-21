<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-21 23:08:29
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="app">
        <button @click="redirectToThirdParty">跳转到第三方链接</button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

function redirectToThirdParty() {
    setTimeout(() => {
        window.location.href = "https://jiaopengzi.com"
    }, 2000)
}
</script>

<style scoped lang="scss">
.app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;

    button {
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #0056b3;
        }
    }
}
</style>
