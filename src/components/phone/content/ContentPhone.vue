<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-25 15:36:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-25 16:55:32
 * @FilePath     : \blog-client\src\components\phone\content\ContentPhone.vue
 * @Description  : 内容页
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
          <CarouselPhone />
          <!-- 文章列表 -->
          <PostListPhone />
          <!-- 分页 -->
          <div class="pagination-block phone">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :background="true"
              :small="true" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" />
          </div>
        </el-main>

      </el-container>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowRight, Location } from '@element-plus/icons-vue'
import CarouselPhone from '@/components/phone/content/main/CarouselPhone.vue'
import PostListPhone from '@/components/phone/content/main/PostListPhone.vue'
import { routeObj } from '@/router/routeAll'
import { ref } from 'vue'

const totalPages = ref(1000)
const currentPage = ref(5)
const pageSize = ref(10)

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

</script>
<style scoped lang="scss">
.content {
  // width: pc.$width-page-main;
  display: flex;
  flex-direction: column;
  width: 94vw;
}

.breadcrumb-item {
  margin-right: 5px;
}

.breadcrumb-logo {
  color: light.$secondary-color;
}

.el-main {
  padding-left: 0px;
  padding-top: 0px;
  padding-right: 0px;
}

.pagination-block {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
