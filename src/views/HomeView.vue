


<template>
  <div class="page">
    <headerComponent />
    <contentComponent />
    <footerComponent />
  </div>
</template>

<script setup lang="ts">
import { headerComponent, footerComponent, contentComponent } from '@/components/common/index.ts'
</script>

<style scoped lang="less">
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
