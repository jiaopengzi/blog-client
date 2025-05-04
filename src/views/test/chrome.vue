<!--
 * FilePath    : blog-client\src\views\test\index.vue
 * Description : 测试页面
-->
<template>
    <div>
        <h1>测试页面</h1>
        <p>当前浏览器：{{ isChrome ? "Chrome" : "非Chrome" }}</p>
        <p>userAgent: {{ userAgentAc }}</p>
        <div v-if="isChrome">
            <h2>Chrome浏览器特性</h2>
            <ul>
                <li>支持最新的Web标准</li>
                <li>内置强大的开发者工具</li>
                <li>快速的JavaScript引擎</li>
            </ul>
        </div>
        <div v-else>
            <h2>非Chrome浏览器特性</h2>
            <ul>
                <li>可能不支持最新的Web标准</li>
                <li>开发者工具可能不够强大</li>
                <li>JavaScript性能可能较低</li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
// 判断是否为Chrome浏览器
defineOptions({ name: "MyTest" })

const isChrome = ref(false)
const userAgentAc = ref("")

onMounted(() => {
    const ua = navigator.userAgent.toLowerCase()
    userAgentAc.value = ua
    // 简单判断：包含 'chrome'，且不包含 'edge'、'opr'，并且存在 window.chrome 属性
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isChrome.value = ua.includes("chrome") && !ua.includes("edge") && !ua.includes("opr") && !!(window as any).chrome
})
</script>

<style scoped lang="scss"></style>
