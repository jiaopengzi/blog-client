<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-23 15:33:28
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
          <span class="iconfont icon-article"></span>

          <span>文章</span>
        </router-link>
      </li>
      <li>
        <router-link :to="routeObj.video.path" class="link">
          <span class="iconfont icon-video"></span>
          <span>视频课</span>
        </router-link>
      </li>
      <li>
        <router-link :to="routeObj.doc.path" class="link">
          <span class="iconfont icon-doc"></span>
          <span>文档</span>
        </router-link>
      </li>
      <li>
        <router-link :to="routeObj.tool.path" class="link">
          <span class="iconfont icon-tool"></span>
          <span>工具下载</span>
        </router-link>
      </li>
      <li>
        <router-link :to="routeObj.vip.path" class="link">
          <span class="iconfont icon-vip-red icon-red"></span>
          <span>加入VIP</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
// 引用图标
import '@/components/icons/iconfont.css'
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
  /* font-size: 16px; */

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

.iconfont {
  font-size: 1em;
  color: #222;
  margin-right: 4px;
}

.icon-red {
  color: rgb(222, 0, 0);
}
</style>
@/router/routeAll
