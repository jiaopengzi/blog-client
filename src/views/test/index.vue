<!--
 * FilePath    : blog-client-dev\src\views\test\index.vue
-->
<template>
    <div id="preview-test">
        <div v-html="`<div class='test'>test</div><p>hello</p>`"></div>
    </div>
</template>
<script setup lang="ts">
defineOptions({ name: "MyTest" })
</script>

<style scoped lang="scss">
@use "./style.module.scss";
</style>
