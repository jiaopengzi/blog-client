<template>
    <div class="container">
        <h1>测试页面</h1>
        <p>滚动条事件</p>
        <p>滚动条位置：{{ scrollData.position.toFixed(2) }} px</p>
        <p>滚动条速度：{{ scrollData.speed.toFixed(2) }} px/s</p>
        <p>滚动条方向：{{ scrollData.direction }}</p>
        <div class="main" ref="mainRef">
            <div class="content" style="height: 2000px; background: linear-gradient(to bottom, #fff, #000)"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type Ref, useTemplateRef } from "vue"

import type { ScrollData } from "@/components/hooks/useScroll"
import { useScrollActions } from "@/components/hooks/useScroll"

defineOptions({ name: "MyTest" })

const mainRef = useTemplateRef("mainRef")

const scrollUpAction = () => {
    if (scrollData.value.speed > 100 || scrollData.value.position < 200) {
        // 速度大于100px/s 或者 滚动条位置小于200px
    }
}

const scrollDownAction = () => {
    if (scrollData.value.speed > 100 && scrollData.value.position > 400) {
        // console.log(`===>Down, 位置：${scrollData.value.position.toFixed(2)}, 速度：${scrollData.value.speed.toFixed(2)} px/s`);
    }
}

const scrollData: Ref<ScrollData> = useScrollActions(scrollUpAction, scrollDownAction, mainRef)
</script>

<style scoped lang="scss">
// 容器宽高 500px
.container {
    width: 500px;
    height: 500px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.main {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
    background-color: #f0f0f0;
}
</style>
