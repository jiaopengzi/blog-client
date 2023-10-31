<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-30 21:12:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-30 21:41:28
 * @FilePath     : \blog-client\src\components\common\pc\content\aside\HotPosts.vue
 * @Description  : 热门文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="aside-item">
    <div class="title">
      <h2><span class="iconfont icon-hot"></span>热门文章</h2>
    </div>
    <div class="post-list">
      <PostItem v-for="(item, index,) in postItems" :key="index" :postData="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostItem from '@/components/common/pc/content/aside/PostItem.vue'
import type { PostItemAsideObj } from '@/components/common/pc/content/aside/postItem.d'
const postDataObj: PostItemAsideObj = {
  thumbnailSrc: "https://image.jiaopengzi.com/blog/202309181034415-w280h210.png",
  thumbnailHref: "http://192.168.2.222:8081/post",
  titleHref: "http://192.168.2.222:8081/tool",
  title: "184_Python 在 Excel 和 Power BI 绘制堆积瀑布图",
  date: "2023年3月15日",
  view: 1000,
}

const postItems: PostItemAsideObj[] = Array(5).fill(postDataObj)
</script>
<style scoped lang="less">
.aside-item {
  border: 1px solid #eaeaea;
  background-color: @background-color-content;
  border-radius: 5px;

  .title {
    background-color: @background-color;
    padding: 10px 5px;
  }

  h2 {
    font-size: 16px;
    font-weight: 600;
  }
}

.post-list {
  font-size: 14px;
  padding-left: 10px;
  padding-right: 10px;

  .post-item {
    margin-top: 10px;
  }

  &:last-child {
    margin-bottom: 10px;
  }
}

.iconfont {
  font-size: 16px;
  margin-right: 10px;
  color: #BB1818;
}
</style>
