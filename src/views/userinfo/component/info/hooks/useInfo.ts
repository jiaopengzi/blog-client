/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-13 10:17:33
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-16 22:15:25
 * @FilePath     : \blog-client\src\views\userinfo\component\info\hooks\useInfo.ts
 * @Description  : 用户信息页面 hooks
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { reactive, ref, onBeforeMount, onMounted, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import type { UserInfo } from '@/api/user/getUserInfo'
import { social } from '@/api/responseCode'
import { ResponseCode } from '@/api/responseCode'
import type { editUserInfoRequest } from '@/api/user/editUserInfo'
import { editUserInfoByJosn } from '@/api/user/editUserInfo'
import { ShowMsgTip } from '@/utils/message'
import type { EditForm } from '@/views/userinfo/component/info'
import { convertToBeijingTime } from '@/utils/dateTime'
import { type CheckUserNameRequest, checkUserNameByJosn } from '@/api/user/checkUserName'

export interface UseInfoReturnType {
  editFormRef: Ref<FormInstance | undefined>
  labelPosition: Ref<string>
  formSize: Ref<string>
  userData: Ref<UserInfo>
  avatar: Ref<string | undefined> | undefined
  isBindEmail: Ref<boolean>
  formatRegisterTime: string
  editForm: EditForm
  rules: FormRules<EditForm>
  submitForm: (formEl: FormInstance | undefined) => void
  showQQ: Ref<boolean>
  showWeChat: Ref<boolean>
  socialNickname: (platform: keyof UserInfo, field: string) => string
  bindSocial: (platform: social) => Promise<void>
  unBindSocial: (platform: social) => Promise<void>
  userNameDisabled: Ref<boolean>
  email: ComputedRef<string>
  getUserMetaValue: (key: string) => string | undefined
}

export function useInfo(): UseInfoReturnType {
  // 表单实例
  const editFormRef = ref<FormInstance>()

  // 表单label位置 top | left | right
  const labelPosition = ref('right')

  // 表单大小 '' | 'large' | 'default' | 'small'
  const formSize = ref('default')

  // 获取用户信息
  const userStore = useUserStore()

  const { data: userData, avatar, isBindEmail } = storeToRefs(userStore)

  const userNameDisabled = ref(true) //用户名不可用，默认true(不能编辑)

  const changeUserNameDisabled = () => {
    userNameDisabled.value = userData.value.user.id.toString() !== userData.value.user.user_name
  }

  const formatRegisterTime = convertToBeijingTime(userData.value.user.created_at)

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
      // console.log(req)
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
          ShowMsgTip(ShowMsgTip.MsgType.success, data.msg, 6000)
        } else {
          // 注册失败
          // console.log("注册失败");
          ShowMsgTip(ShowMsgTip.MsgType.error, data.msg, 0)
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

  return {
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
    getUserMetaValue,
  }
}
