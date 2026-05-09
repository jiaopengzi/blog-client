<!--
 * FilePath    : blog-client\src\views\test\index.vue
 * Description : 
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
    //border: 1px solid #ccc;
    //border-radius: 8px;
    //background-color: #f9f9f9;
    //box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    // transition: all 0.3s ease;
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
