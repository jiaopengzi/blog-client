<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-23 20:11:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-23 20:50:32
 * @FilePath     : \blog-client\src\views\test\CustomSubtitles.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!-- components/CustomSubtitles.vue -->
<template>
    <div class="subtitles" v-if="currentCue">
        {{ currentCue.text }}
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect, onBeforeMount } from 'vue';
import { parseVTT } from '@/utils/vttParser';

const props = defineProps<{ currentTime: number, vttUrl: string }>();

const cues = ref<Array<{ start: number, end: number, text: string }>>([]);
const currentCue = ref<{ start: number, end: number, text: string } | null>(null);

onBeforeMount(async () => {
    if (props.vttUrl) {
        cues.value = await parseVTT(props.vttUrl);
    }
})

watchEffect(() => {
    if (cues.value) {
        console.log("cues2", cues.value);
    }
});


watch(() => props.currentTime, (newTime) => {
    if (newTime !== undefined) {
        currentCue.value = cues.value.find(cue => newTime >= cue.start && newTime <= cue.end) || null;
    }
});
</script>

<style scoped lang="scss">
.subtitles {
    position: absolute;
    bottom: 10%;
    width: 100%;
    text-align: center;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    font-size: 1.5rem;
}
</style>