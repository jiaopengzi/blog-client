<!--
 * @FilePath     : \blog-client\src\views\test\index1.vue
-->

<template>
    <button @click="togglePlayPause">点击</button>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue"
import { UsePlayerProps } from "@/components/player"
import type { PlayerProps } from "@/components/player"

defineOptions({ name: "VideoPlayerTest1" })

// 定义props
const { playerProps } = defineProps<{ playerProps: PlayerProps }>()

const localPlayerState = ref<UsePlayerProps>(new UsePlayerProps(playerProps))

// 将 playerProps 包裹成 reactive
const reactivePlayerProps = reactive(playerProps)

// 切换播放暂停
const togglePlayPause = () => {
    localPlayerState.value.togglePlayPause()
}

// 根据 playStatus 控制 video 播放暂停
watchEffect(() => {
    console.log("playStatus=============>", reactivePlayerProps.playStatus)
})
</script>

