<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\no-permission\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 无权限页面
-->

<template>
    <div class="no-permission">
        <h1>无权限</h1>
        <p>如需访问,请联系管理员。</p>
    </div>
</template>
<script setup lang="ts">
defineOptions({ name: "NoPermission" })
</script>
<style scoped lang="scss">
.no-permission {
    text-align: center;
    padding-top: 100px;
    font-size: 24px;
    color: var(--jpz-color-primary);

    h1 {
        font-size: 100px;
        margin: 0;
        font-weight: 700;
    }

    p {
        margin: 40px 0;
    }
}
</style>
