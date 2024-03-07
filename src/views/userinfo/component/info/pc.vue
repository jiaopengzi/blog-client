<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-29 19:49:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-07 22:51:24
 * @FilePath     : \blog-client\src\views\userinfo\component\info\pc.vue
 * @Description  : 我的信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="container">
    <div class="el-descriptions-div">
      <el-descriptions title="我的信息" :column="3" size="large" border>
        <el-descriptions-item label="文章">86</el-descriptions-item>
        <el-descriptions-item label="评论">53</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ formatRegisterTime }}</el-descriptions-item>
        <el-descriptions-item label="最后登录">53</el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="el-social-div">
      <el-descriptions title="社交信息" :column="3" size="large" border>
        <el-descriptions-item :label="social.QQDisplay">
          <button class="btn-bind" v-if="!showQQ" @click="bindSocial(social.QQ)">
            绑定{{ social.QQDisplay }}
          </button>
          <span class="social-nickname">{{ socialNickname('user_qq', 'nickname') }}</span>
          <button class="btn-unbind" v-if="showQQ && isBindEmail" @click="unBindSocial(social.QQ)">
            解绑{{ social.QQDisplay }}
          </button>
        </el-descriptions-item>

        <el-descriptions-item :label="social.WeChatDisplay">
          <button class="btn-bind" v-if="!showWeChat" @click="bindSocial(social.WeChat)">
            绑定{{ social.WeChatDisplay }}
          </button>
          <span class="social-nickname">{{ socialNickname('user_wechat', 'nickname') }}</span>
          <button class="btn-unbind" v-if="showWeChat && isBindEmail" @click="unBindSocial(social.WeChat)">
            解绑{{ social.WeChatDisplay }}
          </button>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="edit-avatar-div">
      <div class="edit-avatar">
        <AvatarInitials :name="userData.user.user_display_name" :avatar="avatar" />
      </div>
      <div class="edit-avatar-btn">
        <AvatarUpload />
      </div>
    </div>

    <div class="edit-div">
      <el-form :label-position="labelPosition" label-width="100px" ref="editFormRef" :model="editForm" :rules="rules"
        class="edit-form" :size="formSize" status-icon>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName" :disabled="userNameDisabled" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="email" disabled />
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
          <el-input v-model="editForm.description" type="textarea" placeholder="这个人很懒,什么也没有留下。" />
        </el-form-item>
        <div class="btn-submit">
          <el-form-item>
            <el-button type="primary" @click="submitForm(editFormRef)">保存修改</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import AvatarInitials from '@/components/common/avatar-initials'
import AvatarUpload from '@/components/common/avatar-upload'
import { social } from '@/api/responseCode'
import { useInfo } from '@/views/userinfo/component/info/hooks'

defineOptions({ name: 'UserInfoInfoPC' })

const {
  editFormRef,
  labelPosition,
  formSize,
  userData,
  avatar,
  isBindEmail,
  formatRegisterTime,
  editForm,
  rules,
  submitForm,
  showQQ,
  showWeChat,
  socialNickname,
  bindSocial,
  unBindSocial,
  userNameDisabled,
  email,
} = useInfo()


</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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

.social-nickname {
  margin-left: 5px;
  margin-right: 10px;
}

.btn-unbind {
  color: #409eff;
  border: 1px solid #409eff;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.btn-bind {
  color: #409eff;
  border: 1px solid #409eff;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}
</style>
