<template>
    <div class="video-container" :class="{ fullscreen: isFullscreen }">
        <video ref="video" :controls="false" @fullscreenchange="handleFullscreenChange">
            <source src="http://localhost:8081/api/v1/uploads/test.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div class="watermark" :class="{ fullscreen: isFullscreen }"
            :style="{ animationDuration: `${duration}s`, left: isFullscreen ? '0' : '100%' }">
            {{ watermarkText }}
        </div>
    </div>
    <button @click="toggleFullscreen()">Toggle Fullscreen</button>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const video = ref<HTMLVideoElement | null>(null);
const watermarkText = 'Your Watermark Text';
const duration = 10; // Duration for the watermark to move across the video
const isFullscreen = ref(false);

const handleFullscreenChange = () => {
    if (document.fullscreenElement) {
        isFullscreen.value = true;
    } else {
        isFullscreen.value = false;
    }
};

const toggleFullscreen = () => {
    if (isFullscreen.value) {
        document.exitFullscreen();
    } else {
        video.value?.requestFullscreen();
    }
};

onMounted(() => {
    if (video.value) {
        video.value.play();
    }
});
</script>

<style scoped lang="scss">
.video-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;

    &.fullscreen {
        width: 100%;
        height: 100%;
    }
}

video {
    width: 100%;
    height: auto;

    &.fullscreen {
        width: 100%;
        height: 100%;
    }
}

.watermark {
    position: absolute;
    white-space: nowrap;
    font-size: 24px;
    color: red;
    /* Set the watermark color to red */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    animation: moveWatermark linear infinite;
    z-index: 9999;
    /* Ensure the watermark is above the video */
}

.watermark.fullscreen {
    font-size: 36px;
    /* Increase font size for better visibility in fullscreen */
    z-index: 10000;
    /* Ensure the watermark is above the video in fullscreen */
    position: fixed;
    /* Ensure the watermark is positioned correctly in fullscreen */
}

@keyframes moveWatermark {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-100%);
    }
}
</style>