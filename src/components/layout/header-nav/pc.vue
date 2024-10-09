<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 20:56:51
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 22:19:10
 * @FilePath     : \blog-client\src\components\layout\header-nav\pc.vue
 * @Description  : 导航栏 pc 端
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="nav">
    <ul>
      <li v-for="(item, index) in props.navData" :key="index">
        <router-link :to="item.path" class="link">
          <Icon
            v-if="item.iconKey"
            :name="item.iconKey"
            :customClass="'my-icon ' + item.customClass"
          />
          <span class="titile">{{ item.title }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import type { HeaderNavPropsItem } from '@/components/layout/header-nav'

defineOptions({ name: 'HeaderNavPC' })

const props = defineProps<{ navData: HeaderNavPropsItem[] }>()
</script>
<style scoped lang="scss">
.nav ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 500px;
  height: 100%;

  li {
    /* width: 100px; */
    height: 100%;
    text-align: center;
    line-height: 88px;
    font-size: 16px;
    font-weight: 600;
    color: #808080;
  }
}

.link {
  display: flex;
  /* 使用 Flexbox 布局 */
  align-items: center;
  /* 垂直居中对齐 */
  text-decoration: none;
  /* 可选：去除链接的下划线 */
  padding-left: 8px;
  padding-right: 8px;
  color: #333;
}

span {
  display: flex;
  /* 使用 Flexbox 布局 */
  align-items: center;
  /* 垂直居中对齐 */
}

.my-icon {
  font-size: 20px;
  fill: #333;
  margin-right: 4px;
}

// .my-icon-red {
//     fill: rgb(222, 0, 0);
// }
</style>
