<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-02-22 14:58:53
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div>
    {{ progress }}
  </div>
  <div>
    {{ percentage }}
  </div>
</template>

<script setup lang="ts">
import FakeProgress from 'fake-progress'
import { ref, computed } from 'vue'

const fake = new FakeProgress({
  timeConstant: 5000,
  autoStart: true
})
const progress = ref(fake.progress)
const percentage = computed(() => parseInt(progress.value * 100 + ''))
setInterval(() => {
  progress.value = fake.progress
}, 100)








</script>




