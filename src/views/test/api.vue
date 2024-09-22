<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-22 08:57:06
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-22 08:57:09
 * @FilePath     : \blog-client\src\views\test\index copy 2.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!--
 * @FilePath     : \blog-client\src\views\test\index.vue
-->
<template>
  <div class="video-container">

    <div>{{ mainM3u8 }}</div>

  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TestVue' })
import { ref, onMounted, reactive } from 'vue';
import { getMainM3u8API } from '@/api/video/getMainM3u8'

const videoID: string = '1-8e72860c'
const videoQuality: string = '1080p'

const mainM3u8 = ref<string>('')

const getMainM3u8 = async () => {
  await getMainM3u8API(videoID).then(res => {
    console.log(res)
    mainM3u8.value = res.data.data
  })
}

onMounted(() => {
  getMainM3u8()
})


</script>




<style scoped lang="scss">
.video-container {
  position: relative;
  width: 100%;
}

.custom-video {
  width: 720px;
  height: auto;
}
</style>
