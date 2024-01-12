<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-05 16:45:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 19:04:31
 * @FilePath     : \blog-client\src\components\pc\userinfo\IndexUserInfoPC.vue
 * @Description  : 用户中心 PC端
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <!-- 绑定邮箱对话框弹窗 -->
  <BindEmailDialog></BindEmailDialog>

  <!-- 内容页 -->
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="routeObj.home.path">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div>
      <el-tabs type="border-card" :tab-position="tabPosition" class="tabs" v-model="activeTab" @tab-change="tabChange">
        <el-tab-pane name="info">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <View />
              </el-icon><span>我的信息</span></span>
          </template>
          <InfoPC />
        </el-tab-pane>
        <el-tab-pane name="order">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <Tickets />
              </el-icon>
              <span>我的订单</span>
            </span>
          </template>
          <OrderPC />
        </el-tab-pane>
        <el-tab-pane name="vip">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <Goods />
              </el-icon>
              <span>购买会员</span>
            </span>
          </template>
          <VipPC />
        </el-tab-pane>
        <el-tab-pane name="post">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <Document />
              </el-icon>
              <span>我的文章</span>
            </span>
          </template>
          <PostPC />
        </el-tab-pane>
        <el-tab-pane name="comment">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <ChatLineSquare />
              </el-icon>
              <span>我的评论</span>
            </span>
          </template>
          <CommentPC />
        </el-tab-pane>
        <el-tab-pane name="favorite">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <Star />
              </el-icon>
              <span>我的收藏</span>
            </span>
          </template>
          <FavoritePC />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { View, Tickets, Goods, Document, ChatLineSquare, Star } from '@element-plus/icons-vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { ref } from 'vue'
import BindEmailDialog from '@/components/common/bind-email-dialog'
import { routeObj } from '@/router/routeAll'
import InfoPC from '@/components/pc/userinfo/InfoPC.vue'
import OrderPC from '@/components/pc/userinfo/OrderPC.vue'
import VipPC from '@/components/pc/userinfo/VipPC.vue'
import PostPC from '@/components/pc/userinfo/PostPC.vue'
import CommentPC from '@/components/pc/userinfo/CommentPC.vue'
import FavoritePC from '@/components/pc/userinfo/FavoritePC.vue'
import { useRouter } from 'vue-router'

const tabPosition = ref('left') // tab位置
const activeTab = ref('info')
const router = useRouter()

// 根据 hash 值来设置当前的 activeTab
function tabChange(name: any) {
  router.push({ hash: `#${name}` }) // 使用哈希路由更新 URL
}
const hashValue = router.currentRoute.value.hash
if (hashValue) {
  console.log(hashValue)
  activeTab.value = hashValue.replace('#', '')
}
</script>
<style scoped lang="scss">
.content {
  width: pc.$width-page-main;
  display: flex;
  flex-direction: column;
}

.tabs {
  width: pc.$width-page-main;
  min-height: calc(100vh - pc.$height-footer - pc.$height-header);
  background-color: $background-color-page;
}

.tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}

.tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
