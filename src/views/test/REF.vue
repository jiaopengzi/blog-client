<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-10 10:22:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-10 10:22:41
 * @FilePath     : \blog-client\src\views\test\Index copy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-10 10:22:15
 * @FilePath     : \blog-client\src\views\test\Index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div id="app" ref="containerRef">
    <div class="preview1">
      测试使用
    </div>
  </div>
</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue'
import type { ComponentPublicInstance } from 'vue'

interface Container extends HTMLElement {
  navigateToHeading: (index: number) => void
  navigateToElement: (index: number) => void
  navigateGoHome: (behavior: ScrollBehavior) => void
  navigateGoEnd: (behavior: ScrollBehavior) => void
}
export type ContainerRef = ComponentPublicInstance & Container

const containerRef = ref<ContainerRef | null>(null) // 容器

onMounted(() => {
  console.log("containerRef====>", containerRef.value)
  containerRef.value?.getElementsByClassName('preview')
  console.log("preview====>", containerRef.value?.getElementsByClassName('preview'))
})

</script>
