<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-14 17:40:58
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>

  <VideoControls />

</template>

<script setup lang="ts">

import { ref, defineAsyncComponent } from 'vue'
import type { PlayLevel, SubtitleStatus } from '@/stores/player'
import { PlaySpeed, PlayLevelItem } from '@/stores/player'
defineOptions({ name: 'TestVue' })
const VideoControls = defineAsyncComponent(() => import('@/components/player/components/controls'))
// const VideoSetting = defineAsyncComponent(() => import('@/components/player/components/setting'))

const subtitles = ref<SubtitleStatus>({
  availableSubtitles: {
    en: { label: 'English', url: 'https://example.com/en.vtt' },
    zh: { label: '中文', url: 'https://example.com/zh.vtt' },
    es: { label: 'Español', url: 'https://example.com/es.vtt' },
  },
  selectedSubtitle: '',
})

const playLevel = {
  level: PlayLevelItem.FULL_HD,
  // allLevels: [PlayLevelItem.TWO_K],
  allLevels: [PlayLevelItem.TWO_K, PlayLevelItem.FULL_HD, PlayLevelItem.HD, PlayLevelItem.SD],
}

const playSpeed = ref<PlaySpeed>(PlaySpeed.NORMAL)

</script>