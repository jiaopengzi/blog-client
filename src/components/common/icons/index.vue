<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-05 11:39:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-28 11:26:21
 * @FilePath     : \blog-client\src\components\common\icons\index.vue
 * @Description  : 图标组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <svg class="icon" aria-hidden="true" :class="iconClass">
    <use :xlink:href="iconMap[props.name]" />
  </svg>
</template>

<script lang="ts" setup>
import '@/components/common/icons/assets/iconfont.js'
import { computed, withDefaults } from 'vue'
import type { IconProps } from '@/components/common/icons'
import { iconMap } from '@/components/common/icons'

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: "Icon" })

// props 为 IconProps 类型
const props = withDefaults(defineProps<IconProps>(), {
  customClass: '',
})

// iconClass 为 icon 的 class 属性
const iconClass = computed(() => {
  return [props.name, props.customClass]
})


</script>

<style scoped lang="scss">
.icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  // fill 填充色 需要在阿里图标库中设置批量去掉去色
}
</style>
