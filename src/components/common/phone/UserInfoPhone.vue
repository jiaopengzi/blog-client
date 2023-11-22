<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-05 16:54:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-22 17:57:51
 * @FilePath     : \blog-client\src\components\common\phone\UserInfoPhone.vue
 * @Description  : 用户中心
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->


<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="routeObj.login.path">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div>
      <el-tabs type="border-card" :tab-position="tabPosition" class="tabs">
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label"><el-icon>
                <View />
              </el-icon><span>我的信息</span></span>
          </template>

          <div class="el-descriptions-div">
            <el-descriptions title="我的信息" :column="3" size="large" border>
              <el-descriptions-item label="文章">86</el-descriptions-item>
              <el-descriptions-item label="评论">53</el-descriptions-item>
              <el-descriptions-item label="注册时间">{{
                convertToBeijingTime(data.user.created_at)
              }}</el-descriptions-item>
              <el-descriptions-item label="最后登录">53</el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="el-social-div">
            <el-descriptions title="社交信息" :column="3" size="large" border>
              <el-descriptions-item label="QQ"><a href="#">点击绑定</a></el-descriptions-item>
              <el-descriptions-item label="微信"><a href="#">点击绑定</a></el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="edit-avatar-div">
            <div class="edit-avatar">
              <InitialAvatar :name="data.user.user_display_name" :avatar="avatar" />
            </div>
            <div class="edit-avatar-btn">
              <avatar-upload></avatar-upload>
            </div>
          </div>

          <div class="edit-div">
            <el-form :label-position="labelPosition" label-width="100px" ref="editFormRef" :model="editForm"
              class="edit-form" :size="formSize" status-icon>
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="editForm.userName" disabled />
              </el-form-item>

              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email" disabled />
              </el-form-item>

              <el-form-item label="昵称" prop="nickName">
                <el-input v-model="editForm.nickName" />
              </el-form-item>

              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="editForm.sex">
                  <el-radio label="男" />
                  <el-radio label="女" />
                </el-radio-group>
              </el-form-item>

              <el-form-item label="简介" prop="description">
                <el-input v-model="editForm.description" type="textarea" />
              </el-form-item>
              <div class="btn-submit">
                <el-form-item>
                  <el-button type="primary" @click="submitForm(editFormRef)">保存修改</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <Tickets />
              </el-icon>
              <span>我的订单</span>
            </span>
          </template></el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <Goods />
              </el-icon>
              <span>购买会员</span>
            </span>
          </template></el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <Document />
              </el-icon>
              <span>我的文章</span>
            </span>
          </template></el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <ChatLineSquare />
              </el-icon>
              <span>我的评论</span>
            </span>
          </template></el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <Star />
              </el-icon>
              <span>我的收藏</span>
            </span>
          </template></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { View, Tickets, Goods, Document, ChatLineSquare, Star } from '@element-plus/icons-vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { reactive, ref, onBeforeMount } from 'vue'
import type { FormInstance } from 'element-plus' // 需要全部安装 npm i element-plus -S
import InitialAvatar from '@/components/common/InitialAvatar.vue'
import AvatarUpload from '@/components/common/AvatarUploader.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { convertToBeijingTime } from '@/utils/utcToBeijingTime'
import { routeObj } from '@/router/routeAll'
const tabPosition = ref('left') // tab位置

interface EditForm {
  userName: string
  email: string
  nickName: string
  sex: string
  description: string
}

// 获取用户信息
const userStore = useUserStore()
let { data, avatar } = storeToRefs(userStore)

onBeforeMount(() => {
  // 组件挂载前
  userStore.getUserInfoByToken()
})

// 表单label位置 top | left | right
const labelPosition = ref('right')

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('default')

// 表单实例
const editFormRef = ref<FormInstance>()

// 表单数据
const editForm = reactive<EditForm>({
  userName: ref(data.value.user.user_name).value,
  email: ref(data.value.user.user_email).value,
  nickName: ref(data.value.user.user_display_name).value,
  sex: ref('男').value,
  description: ref('jianjie').value,
})

const submitForm = async (formEl: FormInstance | undefined) => { }

interface Bindings {
  QQ: boolean
  WeChat: boolean
}

type Platform = 'QQ' | 'WeChat'

const isBound = ref<Bindings>({ QQ: false, WeChat: true })
const nickname = ref<string>('')

const toggleBinding = (platform: Platform) => {
  isBound.value[platform] = true
  if (platform === 'WeChat' && isBound.value[platform]) {
    // 在这里添加获取微信昵称的逻辑
    nickname.value = '微信昵称'
  } else if (platform === 'WeChat') {
    nickname.value = ''
  }
  console.log(`${isBound.value[platform] ? '绑定' : '解绑'} ${platform}`)
  // 在这里添加处理逻辑，例如调用 API 进行实际绑定或解绑操作
}
</script>
<style scoped lang="scss">
.content {
  width: pc.$width-page-main;
  display: flex;
  flex-direction: column;
}

.breadcrumb {
  width: pc.$width-page-main;
  height: 56px;
  color: #333;
  border: 0;
  margin: 0;
  margin-top: pc.$height-header;
  padding: 0;
  vertical-align: baseline;
  display: flex;
  align-items: center;
}

.tabs {
  width: pc.$width-page-main;
  min-height: calc(100vh - pc.$height-footer - pc.$height-header);
  background-color: light.$background-color-page;
}

.tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}

.tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}

.tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}

.el-social-div {
  margin-top: 20px;
}

.edit-div {
  // 显示上边框
  border-top: 2px solid #ebebeb;
  // 内边距 40px
  padding-top: 40px;
  // 右内边距 200px
  padding-right: 50%;
}

.edit-avatar-div {
  // border-top: 2px solid #ebebeb;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.edit-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 40px 40px 0;
}
</style>
@/utils/utcToBeijingTime
