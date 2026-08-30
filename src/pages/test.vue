<!--
 * FilePath    : blog-client-nuxt\src\pages\test.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 测试页面
-->

<template>
    <div class="test">This is a test page.</div>
    <div class="go-home">
        <router-link to="/">返回首页</router-link>
    </div>
</template>
<script lang="ts" setup>
defineOptions({ name: "DemoTest" })
</script>
<style scoped lang="scss">
.test {
    font-size: 24px;
    color: var(--jpz-text-color-primary);
    text-align: center;
    margin-top: 50px;
    margin-bottom: 50px;
    padding: 20px;
}

.go-home {
    text-align: center;
    margin-top: 20px;
    a {
        font-size: 18px;
        color: var(--jpz-text-color-primary);
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
