<!--
 * @FilePath     : \blog-client\src\views\test\index1.vue
-->

<template>
    <button @click="togglePlayPause">点击</button>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue"
import { PlayerStateManager } from "@/components/player"
import type { PlayerState } from "@/components/player"

defineOptions({ name: "VideoPlayerTest1" })

// 定义props
const { playerState } = defineProps<{
    playerState: PlayerState
}>()

const localPlayerState = ref<PlayerStateManager>(new PlayerStateManager(playerState))

// 将 playerProps 包裹成 reactive
const reactivePlayerPropsRea = reactive(playerState)

// 切换播放暂停
const togglePlayPause = () => {
    localPlayerState.value.togglePlayPause()
}

// 根据 playStatus 控制 video 播放暂停
watchEffect(() => {
    console.log("playStatus=============>1", reactivePlayerPropsRea.playStatus)
})
</script>
