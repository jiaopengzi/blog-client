<template>
    <div>
        <div ref="el" class="fullscreen-wrapper">
            <h1>全屏测试</h1>
            <button @click="toggle">切换全屏</button>
            <p>当前状态：{{ isWebFullscreen ? "全屏" : "非全屏" }}</p>
        </div>
        其他内容
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
defineOptions({ name: "MyFull" })
import { useWebFullscreen } from "@/components/hooks/useWebFullscreen"
const el = ref<HTMLElement | null>(null)
const { isWebFullscreen, toggle } = useWebFullscreen(el)
</script>

<style scoped lang="scss">
.fullscreen-wrapper {
    background-color: red;
    width: 200px;
    height: 200px;
    transition: all 0.3s ease;
}

.web__fullscreen {
    @include webFullscreen();
}
</style>
