<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 20:31:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 10:14:46
 * @FilePath     : \blog-client\src\components\layout\header\index.vue
 * @Description  : 头部
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <section class="pc">
        <HeaderPC />
    </section>
    <section class="phone">
        <HeaderPhone />
    </section>
</template>
<script setup lang="ts">
import HeaderPC from './pc.vue'
import HeaderPhone from './phone.vue'

defineOptions({ name: 'LayoutHeader' })

</script>
<style scoped lang="scss">
.my-icon-red {
    fill: rgb(222, 0, 0);
}
</style>