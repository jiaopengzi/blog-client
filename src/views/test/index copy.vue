<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-17 17:50:42
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-17 18:00:12
 * @FilePath     : \blog-client\src\views\test\index copy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div>
    <button @click="toggleFullScreen">Toggle Full Screen</button>
    <el-popover v-model:visible="popoverVisible" placement="top" width="200" trigger="click" :append-to-body="false">
      <p>This is a popover content</p>
      <template #reference>
        <button @click="togglePopover">Click me</button>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// :teleported="true"


const popoverVisible = ref(false);

const togglePopover = () => {
  // popoverVisible.value = !popoverVisible.value;
};

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
};
</script>

<style scoped lang="scss">
button {
  margin: 10px;
}
</style>
