<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-25 15:50:05
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 19:07:02
 * @FilePath     : \blog-client\src\components\common\base\post-item-main\index.vue
 * @Description  : 单个文章元素
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="post-item">
    <!-- 左上角提示符 -->
    <div class="tip"></div>
    <!-- 分类 -->
    <a :href="props.postData.categoryHref"><span class="category">{{ props.postData.category }}</span></a>
    <!-- 缩略图 -->
    <div class="thumbnail">
      <a :href="props.postData.thumbnailHref">
        <img class="thumbnail-img" :src="props.postData.thumbnailSrc" alt="" />
      </a>
    </div>

    <!-- 文章摘要内容 -->
    <div class="content">
      <!-- 标题 -->
      <a :href="props.postData.titleHref">
        <h2 class="title">{{ props.postData.title }}</h2>
      </a>

      <!-- 摘要文字 -->
      <div class="summary">
        <p>{{ props.postData.summary }}</p>
      </div>

      <!-- 作者 日志 访问量 -->
      <div class="meta">
        <span class="meta-avatar meta-item">
          <AvatarInitials :name="props.postData.name" :size="24" :avatar="props.postData.avatar" />
        </span>
        <span class="meta-date meta-item">{{ props.postData.date }}</span>
        <span class="meta-view meta-item">
          <el-icon>
            <View />
          </el-icon>
          {{ view }}
        </span>
      </div>
    </div>

    <!-- 阅读跳转 -->
    <a :href="props.postData.readMoreHref"><span class="read-more">阅读全文</span></a>
  </div>
</template>

<script setup lang="ts">
import AvatarInitials from '@/components/common/avatar-initials'
import type { PostItemMainObj } from '@/components/common/post-item-main'
import { computed } from 'vue'
import { View } from '@element-plus/icons-vue'

defineOptions({ name: "PostItemMain" })

const props = defineProps<{
  postData: PostItemMainObj
}>()

const view = computed(() =>
  // 显示千分符 , 如果大于 1 万 就显示 ?w
  props.postData.view > 10000
    ? `${Math.floor(props.postData.view / 10000)}w`
    : props.postData.view.toLocaleString(),
)
</script>
<style scoped lang="scss">
@include respond-to('pc') {
  .post-item {
    position: relative;
    height: 150px;
    border-radius: 3px;
    padding: 20px;
    background-color: $background-color-content;
    overflow: hidden;

    &:hover {
      // 鼠标移动到 .post-item 上时, .post-item 出现上下阴影
      box-shadow:
        0 0 5px #ccc,
        0 0 10px #ccc;

      .tip {
        opacity: 1;
      }

      .read-more {
        opacity: 1;
      }
    }
  }

  .tip {
    position: absolute;
    top: 10px;
    left: 0px;
    z-index: 1;
    line-height: 200%;
    font-size: 14px;
    background-color: transparent;
    border-radius: 5%;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;

    // 使用 ::before 伪元素添加红色外边框和绿色内边框
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0px; // 使得红色外边框在 .tip 的左侧
      height: 28px;
      border-right: 6px solid $primary-color; // 绿色内边框
    }
  }

  .post-box:hover .tip {
    opacity: 1;
  }

  .category {
    position: absolute;
    top: 10px;
    left: 20px;
    padding-left: 10px;
    padding-right: 10px;
    z-index: 2;
    background-color: $primary-color;
    line-height: 200%;
    font-size: 14px;
    color: $background-color-page;
    border-radius: 5%;
  }

  .thumbnail {
    float: left;
    width: 200px;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .thumbnail-img {
    width: 100%;
    height: 100%;
    background-size: cover;
    transition: transform 0.3s ease;
  }

  .thumbnail:hover .thumbnail-img {
    transform: scale(1.2);
  }

  .content {
    margin-left: 210px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #333;
    border: 0;
    padding: 0;
    height: 2em;
    line-height: 2em;
    display: -webkit-box;
    -webkit-line-clamp: 1; // 限制行数为1
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .summary {
    margin-top: 5px;
    flex-grow: 1;
    color: #777;
    line-height: 1.5em;
    font-size: 14px;
    height: 2em;
    display: -webkit-box;
    -webkit-line-clamp: 4; // 限制行数为4
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta {
    display: flex;
    align-items: center;
  }

  .meta-item {
    margin-right: 10px;
    color: #888;
    font-size: 14px;
    line-height: 150%;

    // 图标居中
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: gray;
    margin-right: 5px;
  }

  .read-more {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 2;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: $primary-color;
    color: $background-color-page;
    line-height: 150%;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
}

@include respond-to('phone') {
  .post-item {
    position: relative;
    height: 75px;
    border-radius: 3px;
    padding: 15px;
    background-color: $background-color-content;
    overflow: hidden;

    &:hover {
      // 鼠标移动到 .post-item 上时, .post-item 出现上下阴影
      box-shadow:
        0 0 5px #ccc,
        0 0 10px #ccc;

      .read-more {
        opacity: 1;
      }
    }
  }

  .tip {
    display: none;
  }

  .category {
    display: none;
  }

  .thumbnail {
    float: left;
    width: 100px;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .thumbnail-img {
    width: 100%;
    height: 100%;
    background-size: cover;
    transition: transform 0.3s ease;
  }

  .thumbnail:hover .thumbnail-img {
    transform: scale(1.2);
  }

  .content {
    margin-left: 110px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    border: 0;
    padding: 0;
    height: 4em;
    line-height: 2em;
    display: -webkit-box;
    -webkit-line-clamp: 2; // 限制行数为2
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .summary {
    display: none;
  }

  .meta {
    display: flex;
    align-items: center;
  }

  .meta-item {
    margin-right: 10px;
    color: #888;
    font-size: 14px;
    line-height: 150%;

    // 图标居中
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar {
    // width: 10px;
    // height: 10px;
    border-radius: 50%;
    background-color: gray;
    margin-right: 5px;
  }

  .read-more {
    display: none;
  }
}
</style>
@/components/common/post-item-main/postItemMain