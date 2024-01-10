<!-- TestRef.vue -->
<template>
  <div ref="preview" class="preview"> 测试子组件 </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const preview = ref<HTMLElement | null>(null)

defineExpose({ preview })
defineOptions({ name: "TestRef" })
</script>
