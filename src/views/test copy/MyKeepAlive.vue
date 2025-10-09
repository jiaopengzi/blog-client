<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 16:51:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 18:13:34
 * @FilePath     : \blog-client\src\views\test\MyKeepAlive.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div>
        <h1>MyKeepAlive</h1>
    </div>
</template>
<script setup lang="ts">
defineOptions({ name: "MyKeepAlive" })
import { useTest } from "./useTest"

useTest()
</script>
