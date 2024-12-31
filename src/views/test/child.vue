<!--
 * @FilePath     : \blog-client\src\views\test\child.vue
-->

<template>
    <el-input v-model="search" placeholder="关键字搜索" clearable />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

defineOptions({ name: "MyChild" })

// 数据
const { searchStr = "" } = defineProps<{
    searchStr?: string // 搜索关键字
}>()

const search = ref(searchStr) // 搜索关键字

// 监听父组件传递的 searchStr 变化
watch(
    () => searchStr,
    (newVal) => {
        search.value = newVal
    },
    // { immediate: true },
)
</script>
