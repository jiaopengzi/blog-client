<!--
 * filepath    : blog-client\src\views\test\mytest.vue
 * author      : jiaopengzi
 * blog        : https://jiaopengzi.com
 * copyright   : copyright (c) 2025 by jiaopengzi, all rights reserved.
 * description : 
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
