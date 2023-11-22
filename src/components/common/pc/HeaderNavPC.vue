<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-05 16:27:32
 * @FilePath     : \blog-client\src\components\common\pc\HeaderNav.vue
 * @Description  : 头部导航 PC端
 * @blog         : https://jiaopengzi.com
 * Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="nav">
    <ul>
      <li>
        <router-link :to="routeObj.home.path" class="link">
          <span class="titile">首页</span>
        </router-link>
      </li>
      <li>
        <router-link :to="routeObj.post.path" class="link">
          <Icon name="article" customClass="my-icon" />
          <span>文章</span>
        </router-link>
      </li>
      <li>
        <router-link :to="routeObj.video.path" class="link">
          <Icon name="video" customClass="my-icon" />
          <span>视频课</span>
        </router-link>
      </li>
      <li>
        <router-link :to="routeObj.doc.path" class="link">
          <Icon name="doc" customClass="my-icon" />
          <span>文档</span>
        </router-link>
      </li>
      <li>
        <router-link :to="routeObj.tool.path" class="link">
          <Icon name="tool" customClass="my-icon" />
          <span>工具下载</span>
        </router-link>
      </li>
      <li>
        <router-link :to="routeObj.vip.path" class="link">
          <Icon name="vip-red" customClass="my-icon my-icon-red" />
          <span>加入VIP</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { routeObj } from '@/router/routeAll'
</script>
<style scoped>
.nav ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 500px;
  height: 100%;
}

.nav ul li {
  /* width: 100px; */
  height: 100%;
  text-align: center;
  line-height: 88px;
  font-size: 16px;
  font-weight: 600;
  color: #808080;
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

.my-icon-red {
  fill: rgb(222, 0, 0);
}
</style>
@/router/routeAll
