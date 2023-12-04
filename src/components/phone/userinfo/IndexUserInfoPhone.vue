<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-05 16:45:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-25 15:22:30
 * @FilePath     : \blog-client\src\components\phone\userinfo\IndexUserInfoPhone.vue
 * @Description  : 用户中心 PC端
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <!-- 绑定邮箱对话框弹窗 -->
  <BindemailDialog></BindemailDialog>

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
          <InfoPhone />
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
          <OrderPhone />
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
          <VipPhone />
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
          <PostPhone />
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
          <CommentPhone />
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
          <FavoritePhone />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { View, Tickets, Goods, Document, ChatLineSquare, Star } from '@element-plus/icons-vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { ref } from 'vue'
import BindemailDialog from '@/components/common/BindEmailDialog.vue'
import { routeObj } from '@/router/routeAll'
import InfoPhone from '@/components/phone/userinfo/InfoPhone.vue'
import OrderPhone from '@/components/phone/userinfo/OrderPhone.vue'
import VipPhone from '@/components/phone/userinfo/VipPhone.vue'
import PostPhone from '@/components/phone/userinfo/PostPhone.vue'
import CommentPhone from '@/components/phone/userinfo/CommentPhone.vue'
import FavoritePhone from '@/components/phone/userinfo/FavoritePhone.vue'
import { useRouter } from 'vue-router'

const tabPosition = ref('top') // tab位置
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
  display: flex;
  flex-direction: column;
  align-items: center;
  // border: 5px solid red;
  width: 94vw;
}

.tabs {
  width: 94vw;
  min-height: calc(100vh - phone.$height-footer - phone.$height-header);
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
