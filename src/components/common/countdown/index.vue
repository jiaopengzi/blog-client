<!--
 * FilePath    : blog-client-nuxt\src\components\common\countdown\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 倒计时
-->

<template>
    <span>
        <template v-if="days > 0">{{ days }}d {{ hours }}h {{ minutes }}m {{ seconds }}s</template>
        <template v-else-if="hours > 0">{{ hours }}h {{ minutes }}m {{ seconds }}s</template>
        <template v-else-if="minutes > 0">{{ minutes }}m {{ seconds }}s</template>
        <template v-else>{{ seconds }}s</template>
    </span>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from "vue"

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: "Countdown" })

const emit = defineEmits<{
    (event: "countdown-over", value: boolean): void // 倒计时结束事件
}>()

const { countdown = 100 } = defineProps<{
    countdown?: number
}>()

const totalSeconds = ref(countdown) // 初始化倒计时时间, 单位为秒

let timer: ReturnType<typeof setInterval> | undefined = undefined

const days = computed(() => Math.floor(totalSeconds.value / 60 / 60 / 24))
const hours = computed(() => Math.floor((totalSeconds.value / 60 / 60) % 24))
const minutes = computed(() => Math.floor((totalSeconds.value / 60) % 60))
const seconds = computed(() => Math.floor(totalSeconds.value % 60))

// 监控 props.countdown 变化, 重新开始倒计时
watch(
    () => countdown,
    (valNew) => {
        totalSeconds.value = valNew
        stopCountdown()
        startCountdown()
    },
    { immediate: true },
)

// 启动倒计时
function startCountdown() {
    timer = setInterval(() => {
        if (totalSeconds.value > 0) {
            totalSeconds.value--
        } else if (totalSeconds.value === 0) {
            emit("countdown-over", true)
            clearInterval(timer)
        } else {
            clearInterval(timer)
        }
    }, 1000)
}

// 停止倒计时
function stopCountdown() {
    if (timer) {
        clearInterval(timer)
    }
}

// 组件卸载时停止定时器
onUnmounted(() => {
    stopCountdown()
})
</script>
