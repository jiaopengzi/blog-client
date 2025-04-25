<template>
    <div class="scroll-container" @scroll="onScroll">
        <div class="content">
            <!-- 模拟多行文本，使得容器内有滚动条可演示 -->
            <p v-for="item in 100" :key="item">这是第 {{ item }} 行，用于测试滚动...</p>
        </div>
    </div>
    <div class="info">
        <p>当前状态： {{ isScrolling ? "正在滚动" : "停止滚动" }}</p>
        <p v-if="!isScrolling && scrollElapsedTime > 0">本次滚动耗时：{{ scrollElapsedTime }} ms</p>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

defineOptions({ name: "MyTest" })
// 是否正在滚动
const isScrolling = ref(false)
// 记录滚动开始的时间戳
let startTime = 0
// 记录滚动总耗时
const scrollElapsedTime = ref(0)
// 计时器ID，用于清除上一次的延时
let timerId: number | undefined

/**
 * 监听滚动事件
 */
function onScroll() {
    // 若当前不在滚动状态，则记录滚动开始时间，并更新滚动状态
    if (!isScrolling.value) {
        isScrolling.value = true
        startTime = Date.now()
    }

    // 每次触发滚动事件，都要清除上一次的定时器
    if (timerId) {
        clearTimeout(timerId)
    }

    // 延时 200ms 以判断是否停止滚动
    timerId = window.setTimeout(() => {
        // 计算从开始到停止的耗时
        scrollElapsedTime.value = Date.now() - startTime
        // 状态设为停止，并清空定时器
        isScrolling.value = false
        timerId = undefined
    }, 200)
}
</script>

<style scoped lang="scss">
.scroll-container {
    width: 400px;
    height: 200px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 8px;
    margin-bottom: 16px;
}

.info {
    p {
        margin: 4px 0;
    }
}
</style>
