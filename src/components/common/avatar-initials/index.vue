<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 18:37:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 19:10:42
 * @FilePath     : \blog-client\src\components\common\base\avatar-Initials\index.vue
 * @Description  : 头像
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="avatar" :style="avatarBgStyle">
    <p v-if="!props.avatar">{{ initials }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { AvatarInitialsProps } from '@/components/common/avatar-initials'

defineOptions({ name: 'AvatarInitials' })

// 定义props 参数 name 和 avatar 两个参数 name 为必传参数 avatar 为可选参数
const props = defineProps<AvatarInitialsProps>()

const initials = computed(() => (props.name ? props.name.charAt(0).toUpperCase() : '')) // 获取首字母

const avatarBgStyle = computed(() => ({
  width: props.size ? `${props.size}px` : '50px', // 宽度
  height: props.size ? `${props.size}px` : '50px', // 高度
  'border-radius': props.size ? `${props.size / 2}px` : '25px', // 圆角
  'font-size': props.size ? `${props.size / 2 + 3}px` : '28px', // 字体大小
  backgroundImage: props.avatar ? `url(${props.avatar})` : '', // 设置背景图片
  backgroundColor: !props.avatar ? '#bbb' : '' // 设置背景颜色
}))
</script>

<style lang="scss" scoped>
.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #888;
  color: $primary-color;
  font-weight: 700;
  background-size: cover;
  background-repeat: no-repeat; // 使用cover值，根据容器大小自适应
}
</style>
