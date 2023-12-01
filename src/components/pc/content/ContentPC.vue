<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-30 11:28:24
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-25 17:04:07
 * @FilePath     : \blog-client\src\components\pc\content\ContentPC.vue
 * @Description  : 内容页入口
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="content">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item breadcrumb-logo">
        <el-icon>
          <Location />
        </el-icon>
      </span>
      <span class="breadcrumb-item">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item>当前位置</el-breadcrumb-item>
          <el-breadcrumb-item :to="routeObj.login.path">首页</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>

    <!-- 正文内容 -->
    <div class="common-layout">
      <el-container>
        <el-main>
          <!-- 轮播图 -->
          <CarouselPC />
          <!-- 文章列表 -->
          <PostListPC />
          <!-- 分页 -->
          <div class="pagination-block">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :background="true"
              layout="prev, pager, next, jumper, total"
              :total="totalPages"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-main>

        <el-aside class="el-aside" ref="asideRef" id="aside">
          <!-- 推荐阅读 -->
          <RecommendedReadsPC class="el-aside-item" />
          <!-- 热门文章 -->
          <HotPostsPC class="el-aside-item" />
          <!-- 月度归档 -->
          <!-- @ready="recalculateHeight" 通知子组件已经渲染完毕 执行 recalculateHeight-->
          <MonthArchivePC class="el-aside-item" @ready="reCalculateHeight" />
          <TagsPC class="el-aside-item" />
        </el-aside>
      </el-container>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowRight, Location } from '@element-plus/icons-vue'
import CarouselPC from '@/components/pc/content/main/CarouselPC.vue'
import PostListPC from '@/components/pc/content/main/PostListPC.vue'
import RecommendedReadsPC from '@/components/pc/content/aside/RecommendedReadsPC.vue'
import HotPostsPC from '@/components/pc/content/aside/HotPostsPC.vue'
import MonthArchivePC from '@/components/pc/content/aside/MonthArchivePC.vue'
import TagsPC from '@/components/pc/content/aside/TagsPC.vue'
import { routeObj } from '@/router/routeAll'
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'

const asideRef = ref<HTMLElement | null>(null)

const totalPages = ref(1000)
const currentPage = ref(5)
const pageSize = ref(10)

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

// 侧边栏高度计算
const reCalculateHeight = async () => {
  await nextTick() // 等待渲染完毕

  const aside = document.getElementById('aside') // 获取侧边栏元素
  if (aside) {
    const height = Array.from(aside.children).reduce<number>((totalHeight, child: Element) => {
      const htmlChild = child as HTMLElement // 断言为 HTMLElement 类型
      if (htmlChild.classList.contains('el-aside-item')) {
        const style = getComputedStyle(htmlChild)
        // 高度 = 之前的高度 + 当前元素的高度 + 当前元素的 marginTop + 当前元素的 marginBottom
        return (
          totalHeight +
          htmlChild.offsetHeight +
          parseFloat(style.marginTop) +
          parseFloat(style.marginBottom)
        )
      }
      return totalHeight
    }, 0)

    aside.style.height = `${height}px` // 设置侧边栏高度
    aside.style.top = `-${height - window.innerHeight}px` // 设置侧边栏距离顶部的距离 = 侧边栏高度 - 视口高度
  }
}

onMounted(() => {
  reCalculateHeight()
  window.addEventListener('resize', reCalculateHeight) // 添加 resize 事件监听器
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', reCalculateHeight) // 移除 resize 事件监听器
})
</script>
<style scoped lang="scss">
.content {
  width: pc.$width-page-main;
  display: flex;
  flex-direction: column;
}

.breadcrumb {
  width: pc.$width-page-main;
  height: 40px;
  color: #333;
  border: 0;
  margin: 0;
  margin-top: pc.$height-header;
  padding: 0;
  vertical-align: baseline;
  display: flex;
  align-items: center;
}

.breadcrumb-item {
  margin-right: 5px;
}

.breadcrumb-logo {
  color: light.$secondary-color;
}

.el-main {
  background-color: light.$background-color-page;
  padding-left: 0px;
  padding-top: 0px;
}

.el-aside {
  width: pc.$width-aside;
  background-color: light.$background-color-page;
  position: sticky; // 粘性定位
  top: -400px; // 侧边栏距离顶部的距离
}

.el-aside-item {
  margin-bottom: 10px;
}

.pagination-block {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
