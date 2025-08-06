<!--
 * filepath    : blog-client\src\views\test\mytest.vue
 * author      : jiaopengzi
 * blog        : https://jiaopengzi.com
 * copyright   : copyright (c) 2025 by jiaopengzi, all rights reserved.
 * description : 
-->
<template>
    <div>
        <h1 v-if="isShow">MyTest01</h1>
    </div>
</template>
<script setup lang="ts">
defineOptions({ name: "MyTest01" })

// 定义 props
const { isShow = true } = defineProps<{
    isShow?: boolean
}>()
</script>
