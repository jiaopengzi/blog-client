<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-20 17:38:03
 * @FilePath     : \blog-client\src\views\test\index.vue
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
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  countdown: {
    type: Number,
    default: 100
  }
})

const totalSeconds = ref(props.countdown) // 初始化倒计时时间，单位为秒

let timer: number | undefined = undefined

const days = computed(() => Math.floor(totalSeconds.value / 60 / 60 / 24)) // 计算天数
const hours = computed(() => Math.floor(totalSeconds.value / 60 / 60 % 24)) // 计算小时数
const minutes = computed(() => Math.floor(totalSeconds.value / 60 % 60)) // 计算分钟数
const seconds = computed(() => Math.floor(totalSeconds.value % 60)) // 计算秒数

// 组件挂载时启动定时器
onMounted(() => {
  timer = setInterval(() => {
    if (totalSeconds.value > 0) {
      totalSeconds.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>
