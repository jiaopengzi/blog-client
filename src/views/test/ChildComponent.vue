<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-10-21 14:47:01
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-21 14:48:40
 * @FilePath     : \blog-client\src\views\test\ChildComponent.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div ref="scrollContainer" class="scroll-container">
        <!-- 内容 -->
        <div v-for="i in 100" :key="i" class="item">Item {{ i }}</div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from "vue"

const scrollContainer = ref<HTMLElement | null>(null)

const scrollToTop = () => {
    scrollContainer.value?.scrollTo({ top: 0, behavior: "smooth" })
}

const scrollToBottom = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollTo({
            top: scrollContainer.value.scrollHeight,
            behavior: "smooth",
        })
    }
}

defineExpose({
    scrollToTop,
    scrollToBottom,
})
</script>

<style scoped lang="scss">
.scroll-container {
    height: 300px;
    overflow-y: auto;
    border: 1px solid #ccc;
}

.item {
    padding: 10px;
    border-bottom: 1px solid #eee;
}
</style>
