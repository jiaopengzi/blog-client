<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-12 15:21:43
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-15 22:32:57
 * @FilePath     : \blog-client\src\views\test\toc1.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-12 15:21:35
 * @FilePath     : \blog-client\src\views\test\Index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- App.vue -->
<template>
  <Toc :headings="headings" />
  <h1 v-for="(heding, index) in headings" :key="index"> {{ heding.heading }}</h1>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import Toc from '@/components/common/editor/Toc.vue'

const headings = ref([
  { level: 1, heading: 'test1' },
  { level: 2, heading: 'test2' },
  { level: 3, heading: 'test3' },
  { level: 3, heading: 'test4' },
])

</script>
