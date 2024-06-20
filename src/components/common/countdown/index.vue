<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-06-20 17:43:05
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-20 20:26:53
 * @FilePath     : \blog-client\src\components\common\countdown\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
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
import { ref, onUnmounted, computed, watch } from 'vue'

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: 'countdown' })

const emit = defineEmits<{
    (event: 'countdown-over', value: boolean): void // 编辑用户状态
}>()

const props = defineProps({
    countdown: {
        type: Number,
        default: 100
    }
})

const totalSeconds = ref(props.countdown) // 初始化倒计时时间，单位为秒

let timer: number | undefined = undefined // 定时器

const days = computed(() => Math.floor(totalSeconds.value / 60 / 60 / 24)) // 计算天数
const hours = computed(() => Math.floor(totalSeconds.value / 60 / 60 % 24)) // 计算小时数
const minutes = computed(() => Math.floor(totalSeconds.value / 60 % 60)) // 计算分钟数
const seconds = computed(() => Math.floor(totalSeconds.value % 60)) // 计算秒数

// 监控 props.countdown 变化 重新开始倒计时
watch(
    () => props.countdown,
    (valNew) => {
        totalSeconds.value = valNew// 更新 totalSeconds.value 的值
        stopCountdown()
        startCountdown()// 重新开始倒计时
    },
    // 立刻执行
    { immediate: true }
)

// 启动倒计时
function startCountdown() {
    // 组件挂载时启动定时器
    timer = setInterval(() => {
        if (totalSeconds.value > 0) {
            totalSeconds.value--
        } else if (totalSeconds.value === 0) {
            emit('countdown-over', true)
            clearInterval(timer)
        }
        else {
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