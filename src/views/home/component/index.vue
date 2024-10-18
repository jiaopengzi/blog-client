<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:44:33
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-04 21:29:40
 * @FilePath     : \blog-client\src\views\home\component\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="pc">
        <HomePC />
    </div>
    <div class="phone">
        <HomePhone />
    </div>
</template>
<script setup lang="ts">
import HomePC from "./pc.vue"
import HomePhone from "./phone.vue"

defineOptions({ name: "LayoutHome" })
</script>
<style scoped lang="scss"></style>
