<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-17 10:03:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-23 16:59:30
 * @FilePath     : \blog-client\src\views\test\master.vue
 * @Description  : 视频播放器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>

  <video src="http://10.10.2.222:8081/api/v1/uploads/test.mp4" controls>
    <track class="zimu" src="http: //10.10.2.222:8081/api/v1/uploads/cn.vtt" kind="subtitles" srclang="cn" label="中文"
      default />
  </video>

</template>

<script setup lang="ts">
defineOptions({ name: 'VideoPlayer' })
</script>

<style scoped lang="scss">
video {
  object-fit: contain;
  width: 720px;
  height: 405px;
}

.zimu {
  position: absolute;
  bottom: 40px;
  width: 90%;
  left: 5%;
  text-align: center;
  color: #fff;
  text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.5);
  font-size: 20px;
}
</style>