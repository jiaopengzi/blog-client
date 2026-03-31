<!--
 * FilePath    : blog-client\src\views\test\VideoDemo.vue
-->
<template>
    <div class="container">
        <VideoPlayer :player-state="state" />
    </div>
</template>

<script setup lang="ts">
import VideoPlayer from "@/components/player/index.vue"
import { PlayerStateManager } from "@/components/player"

defineOptions({ name: "VideoDemo" })

const videoState = new PlayerStateManager()
videoState.setVideoID("m-1-c19424aa")
videoState.setIsAdmin(true)
const state = videoState.getState()
</script>

<style scoped lang="scss">
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
