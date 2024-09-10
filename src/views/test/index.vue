<template>

  <VideoControls />

</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
defineOptions({ name: 'TestVue' })
const VideoControls = defineAsyncComponent(() => import('@/components/player/controls'))
</script>

<style scoped lang="scss"></style>
