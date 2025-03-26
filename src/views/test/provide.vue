<!--
 * FilePath    : blog-client\src\views\test\provide.vue
 * Description : 提供方
-->

<template>
    <button @click="handleProvide">提供</button>
</template>

<script lang="ts" setup>
import { provide, ref } from "vue"
defineOptions({ name: "TestProvide" })
const result = ref(false)
const handleProvide = () => {
    result.value = true
}
provide("TestProvideKey", result)
</script>
