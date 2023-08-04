<template>
  <div class="nav">
    <ul>
      <li>
        <router-link to="/" class="link">
          <span class="titile">首页</span>
        </router-link>
      </li>
      <li>
        <router-link to="/blog" class="link">
          <span class="iconfont icon-article"></span>

          <span>文章</span>
        </router-link>
      </li>
      <li>
        <router-link to="/video" class="link">
          <span class="iconfont icon-video"></span>
          <span>视频课</span>
        </router-link>
      </li>
      <li>
        <router-link to="/doc" class="link">
          <span class="iconfont icon-doc"></span>
          <span>文档</span>
        </router-link>
      </li>
      <li>
        <router-link to="/tool" class="link">
          <span class="iconfont icon-tool"></span>
          <span>工具下载</span>
        </router-link>
      </li>
      <li>
        <router-link to="/vip" class="link">
          <span class="iconfont icon-vip-red icon-red"></span>
          <SPan>加入VIP</SPan>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
// 引用图标
import '@/components/icons/iconfont.css'
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
