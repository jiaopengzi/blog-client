<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-25 15:52:05
 * @FilePath     : \blog-client\src\components\pc\content\main\PostListPC.vue
 * @Description  : 文章列表
 * @blog         : https://jiaopengzi.com
 * Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="post-list">
    <PostItem v-for="(item, index) in postItems" :key="index" :postData="item" />
  </div>
</template>

<script setup lang="ts">
import PostItem from '@/components/common/base/post-item-main'
import type { PostItemMainObj } from '@/components/common/base/post-item-main'
const postDataObj: PostItemMainObj = {
  category: 'PowerBI',
  categoryHref: 'http://192.168.2.222:8081/video',
  thumbnailSrc: 'https://image.jiaopengzi.com/blog/202309181034415-w280h210.png',
  thumbnailHref: 'http://192.168.2.222:8081/post',
  titleHref: 'http://192.168.2.222:8081/tool',
  title: '184_Python 在 Excel 和 Power BI 绘制堆积瀑布图z脑',
  summary:
    '焦棚子的文章目录 请在撒阿阿斯顿法师打发是的法师打发谁斯顿发山东旦法师打发阿斯顿发山东发生的发生懂法守法文阿斯顿法三大法师打发手动阀手动阀阿斯顿法师打发手动阀手打师打发阿斯顿发山东阿斯顿法师打发手动阀阿斯顿发山东发生的阿德发生的发生的阿诗丹顿法师打发阿斯顿发山东发生的阿德发生的发生的阿斯顿发山东末下载附件 一、背景 在 2023 年 8 月 22 日 微软 Excel 官方宣布：在 Excel 原生内置的支持了 Python。博客原文 笔者第一时间就更新...',
  name: 'ts',
  avatar: 'https://jiaopengzi.com/wp-content/uploads/2022/01/焦棚子_avatar-64x64.png',
  date: '2023年3月15日',
  view: 1000,
  readMoreHref: 'http://192.168.2.222:8081/vip',
}

const postItems: PostItemMainObj[] = Array(30).fill(postDataObj)
</script>
<style scoped lang="scss">
.post-list {
  font-size: 14px;
  margin-top: 10px;
  border: 1px solid #eaeaea;
  // 除了最后一个元素显示下边框 其他都只显示上边框

  .post-item {
    border-top: 1px solid #eaeaea;
    border-bottom: 1px solid #eaeaea;

    &:last-child {
      border-bottom: 1px solid #eaeaea;
    }
  }
}
</style>
@/components/pc/content/main/postItemMain
@/components/common/base/post-item-main/postItemMain