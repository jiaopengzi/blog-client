<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-29 19:49:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 21:13:08
 * @FilePath     : \blog-client\src\components\layout\content\userinfo\info\pc.vue
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
        <el-descriptions-item label="注册时间">{{
          convertToBeijingTime(userData.user.created_at)
        }}</el-descriptions-item>
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
import { onMounted, computed } from 'vue'
import { reactive, ref, onBeforeMount } from 'vue'
import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S
// import AvatarInitials from '@/components/common/avatar-initials'
import AvatarInitials from '@/components/common/avatar-initials'
import AvatarUpload from '@/components/common/avatar-upload'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { convertToBeijingTime } from '@/utils/utcToBeijingTime'
import type { UserInfo } from '@/api/user/getUserInfo'
import { social } from '@/api/responseCode'
import type { CheckUserNameRequest } from '@/api/user/checkUserName'
import { checkUserNameByJosn } from '@/api/user/checkUserName'
import { ResponseCode } from '@/api/responseCode'
import type { editUserInfoRequest } from '@/api/user/editUserInfo'
import { editUserInfoByJosn } from '@/api/user/editUserInfo'
import { ShowMsgTip } from '@/utils/message'
import { MsgType } from '@/components/common/alert-tip'
import type { EditForm } from "@/components/layout/content/userinfo/info"

defineOptions({ name: 'UserInfoInfoPC' })

// 获取用户信息
const userStore = useUserStore()

let { data: userData, avatar, isBindEmail } = storeToRefs(userStore)

// 表单label位置 top | left | right
const labelPosition = ref('right')

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('default')

// 表单实例
const editFormRef = ref<FormInstance>()

const userNameDisabled = ref(true) //用户名不可用，默认true(不能编辑)
const changeUserNameDisabled = () => {
  userNameDisabled.value = userData.value.user.id.toString() !== userData.value.user.user_name
}

// 获取用户元数据列表中信息
const getUserMetaValue = (key: string): string | undefined => {
  const meta = userData.value.user_meta.find((item) => item.meta_key === key)
  return meta ? meta.meta_value : undefined
}

// 表单数据
const editForm = reactive<EditForm>({
  userName: userData.value.user.user_name,
  nickName: userData.value.user.user_display_name,
  sex: getUserMetaValue('sex') || '男',
  description: getUserMetaValue('description') || '',
})

const email = computed(() => {
  return userData.value.user.id.toString() === userData.value.user.user_email
    ? ''
    : userData.value.user.user_email
})

// 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
const rules = reactive<FormRules<EditForm>>({
  userName: [
    { required: true, message: '请输入用户名！', trigger: 'blur' },
    { pattern: /^[a-z0-9]{6,20}/, message: '用户名长度:6-20的小写字母或数字', trigger: 'change' },
    // 用户查重
    { validator: checkUserNameValidator, trigger: 'blur' },
  ],

  nickName: [
    { required: true, message: '请输入昵称！', trigger: 'blur' },
    { pattern: /^.{1,20}$/, message: '昵称长度1-20字符', trigger: 'change' },
  ],
})

/**
 * @description: 用户名查重 Validator
 * @param rule 无用参数
 * @param value 无用参数
 * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
 */
function checkUserNameValidator(
  rule: any,
  value: string,
  callback: (error?: string | Error | undefined) => void,
): void {
  // 在这里处理异步验证逻辑
  checkUserName()
    .then(() => {
      callback() // 校验成功
    })
    .catch((err: Error) => {
      callback(err.message) // 如果失败（用户名已经存在），则传入错误提示字符串
    })
}

/**
 * @description: 用户名查重 异步函数
 * @return  Promise<void> 用户名存在返回 Promise.reject()，否则返回 Promise.resolve()
 */
async function checkUserName(): Promise<void> {
  try {
    // 创建请求对象 加密内容
    const req: CheckUserNameRequest = {
      user_name: editForm.userName,
    }
    console.log(req)
    const { data } = await checkUserNameByJosn(req)

    if (
      data.code === ResponseCode.UserNameExist &&
      userData.value.user.user_name !== editForm.userName
    ) {
      throw new Error(data.msg)
    }
  } catch (err: unknown) {
    console.log(err)
    throw err
  }
}

/**
 * @description: 提交表单
 * @param formEl 表单实例
 * @param fields 表单字段
 * @return  void
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      // 创建请求对象 加密内容
      const req: editUserInfoRequest = {
        user_name: editForm.userName,
        nickname: editForm.nickName,
        sex: editForm.sex,
        description: editForm.description,
      }

      const { data } = await editUserInfoByJosn(req)

      if (data.code === ResponseCode.UserEditUserInfoSuccess) {
        await userStore.getUserInfoByToken(true)
        changeUserNameDisabled()
        // 显示成功提示
        ShowMsgTip(MsgType.success, data.msg, 6000)
      } else {
        // 注册失败
        // console.log("注册失败");
        ShowMsgTip(MsgType.error, data.msg, 0)
      }
    }
  })
}

const showQQ = ref(false)
const showWeChat = ref(false)

/**
 * @description: 获取社交昵称
 * @param platform 平台
 * @param field 字段
 * @return string
 */
const socialNickname = (platform: keyof UserInfo, field: string) => {
  const userDataP = userData.value as UserInfo
  return userDataP[platform] ? (userDataP[platform] as any)[field] : ''
}

/**
 * @description: 绑定社交账号
 * @param platform 平台
 * @return  void
 */
const bindSocial = async (platform: social) => {
  if (!userStore.isBindEmail) {
    await userStore.changeShowDialogBindEmail(true)
    return
  }

  if (platform === social.QQ) {
    await userStore.bindQQ()
  } else if (platform === social.WeChat) {
    await userStore.bindWeChat()
  }
  updateShowStatus(platform)
}

const unBindSocial = async (platform: social) => {
  if (platform === social.QQ) {
    await userStore.unBindQQ()
    showQQ.value = false
  } else if (platform === social.WeChat) {
    await userStore.unBindWeChat()
    showWeChat.value = false
  }
  updateShowStatus(platform)
}

/**
 * @description: 更新社交账号显示状态
 * @param platform 平台
 * @return  void
 */
const updateShowStatus = (platform: social) => {
  if (platform === social.QQ && userData.value.user_qq && userData.value.user_qq.openid) {
    showQQ.value = true
  } else if (
    platform === social.WeChat &&
    userData.value.user_wechat &&
    userData.value.user_wechat.unionid
  ) {
    showWeChat.value = true
  }
}

onMounted(() => {
  updateShowStatus(social.QQ)
  updateShowStatus(social.WeChat)
  changeUserNameDisabled()
})

onBeforeMount(() => {
  // 组件挂载前
  userStore.getUserInfoByToken()
})
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
