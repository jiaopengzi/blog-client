<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-25 14:23:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-25 14:23:31
 * @FilePath     : \blog-client\src\views\admin\component\main\dashboard\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->


<template>
    <div class="container">
        首页面板
    </div>
</template>
<script setup lang='ts'>

import { AadminSideMenu } from '@/views/admin/component/aside'

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: AadminSideMenu.Dashboard })

</script>
<style scoped lang='scss'>
.container {
    height: 100%;
    width: 100%;
    background-color: red;
}
</style>