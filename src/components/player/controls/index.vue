<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 19:53:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-10 22:14:36
 * @FilePath     : \blog-client\src\components\player\controls\index.vue
 * @Description  : 视频控制器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>

    <div class="controls">
        <button class="controls-btn" @click="togglePlayPause">
            <Icon :name="IconNamePlayPause" customClass="iconfont" />
        </button>

        <input class="content" type="range" min="0" :max="duration" v-model="currentTime" @input="seekVideo" />

        <button class="controls-btn" @click="toggleMute">
            <Icon :name="IconNameMute" customClass="iconfont" />
        </button>

        <input class="volume" min="0" :max="duration" v-model="currentTime" @input="seekVolume" />

        <button class="controls-btn" @click="togglePlayPause">
            <Icon :name="IconKeys.Setting" customClass="iconfont" />
        </button>

        <button class="controls-btn" @click="togglePlayPause">
            <Icon :name="IconKeys.WebFullscreen" customClass="iconfont" />
        </button>

        <button class="controls-btn" @click="togglePlayPause">
            <Icon :name="IconKeys.PictureInPicture" customClass="iconfont" />
        </button>

        <button class="controls-btn" @click="togglePlayPause">
            <Icon :name="IconKeys.Fullscreen" customClass="iconfont" />
        </button>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconKeys } from '@/components/common/icons'

defineOptions({ name: 'VideoControls' })

const duration = ref(100)
const currentTime = ref(10)
const isPlaying = ref(false)
const isMute = ref(false)
const IconNamePlayPause = ref(IconKeys.Pause)
const IconNameMute = ref(IconKeys.Unmute)

const seekVideo = () => {
    currentTime.value = 20
}

const seekVolume = () => {
    currentTime.value = 50
}



const togglePlayPause = () => {
    if (isPlaying.value) {
        IconNamePlayPause.value = IconKeys.Play
    } else {
        IconNamePlayPause.value = IconKeys.Pause
    }
    isPlaying.value = !isPlaying.value
}

const toggleMute = () => {
    if (isMute.value) {
        IconNameMute.value = IconKeys.Mute
    } else {
        IconNameMute.value = IconKeys.Unmute
    }
    isMute.value = !isMute.value
}


</script>


<style scoped lang="scss">
.controls {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 5px;
}

.controls button {
    // 背景色透明
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.iconfont {
    font-size: 24px;
    fill: rgba(255, 255, 255, 0.8);
}

.volume {
    width: 40px;
}

.conetnt {
    width: 100%;
}

.controls input[type="range"] {
    flex: 1;
    margin: 0 10px;
    -webkit-appearance: none;
    appearance: none;
    height: 5px;
    background: #ddd;
    border-radius: 5px;
    outline: none;
    opacity: 0.7;
    transition: opacity .2s;
}

.controls input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
}

.controls input[type="range"]::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
}
</style>