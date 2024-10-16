<!-- src/App.vue -->
<template>
  <div ref="previewRef" id="preview"></div>
</template>

<script lang="ts" setup>
// main.js
import { createApp, h } from 'vue'
import Icon from '@/components/common/icons' // 引用自定义的全局图标

const App = {
  render() {
    return h('div', { id: 'preview' }, [h('h1', 'hello world'), h(Icon, { name: 'save' })])
  }
}

createApp(App).mount('#app')
</script>
