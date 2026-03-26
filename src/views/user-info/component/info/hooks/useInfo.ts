/**
 * @FilePath     : \blog-client\src\views\user-info\component\info\hooks\useInfo.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 用户信息 hooks
 */

import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { storeToRefs } from "pinia"
import type { ComputedRef, Ref } from "vue"
import { computed, onBeforeMount, onMounted, reactive, ref, toRef } from "vue"

import { SocialLoginType } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { setAvatarAPI, type SetAvatarRequest } from "@/api/upload/setAvatar"
import type { EditUserInfoRequest } from "@/api/user/editUserInfo"
import { editUserInfoAPI } from "@/api/user/editUserInfo"
import type { UserInfo } from "@/api/user/getUserInfo"
import { useAccountFormValidation } from "@/components/hooks/useAccountFormValidation"
import { useUserStore } from "@/stores/user"
import { formatTime } from "@/utils/dateTime"
import { MessageUtil } from "@/utils/message"
import { getUserMetaValue } from "@/utils/metaInfo"

import type { EditForm } from "../types"

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
    bindSocial: (platform: SocialLoginType) => Promise<void>
    unBindSocial: (platform: SocialLoginType) => Promise<void>
    userNameDisabled: Ref<boolean>
    email: ComputedRef<string>
    updateAvatarToDB(avatarUrl: string): void
    userSysRole: ComputedRef<string>
    userMembershipRole: ComputedRef<string>
}

export function useInfo(): UseInfoReturnType {
    // 表单实例
    const editFormRef = ref<FormInstance>()

    // 表单label位置 top | left | right
    const labelPosition = ref("right")

    // 表单大小 '' | 'large' | 'default' | 'small'
    const formSize = ref("default")

    // 获取用户信息
    const userStore = useUserStore()

    const { data: userData, avatar, isBindEmail } = storeToRefs(userStore)

    const userNameDisabled = ref(true) //用户名不可用，默认true(不能编辑)

    const changeUserNameDisabled = () => {
        userNameDisabled.value = userData.value.user.id.toString() !== userData.value.user.user_name
    }

    const formatRegisterTime = formatTime(userData.value.user.created_at)

    // 表单数据
    const editForm = reactive<EditForm>({
        userName: userData.value.user.user_name,
        nickName: userData.value.user.user_display_name,
        subscribeStatus: userData.value.user.subscribe_status,
        sex: getUserMetaValue("sex", userData.value) || "未知",
        description: getUserMetaValue("description", userData.value) || "",
    })

    const email = computed(() => {
        return userData.value.user.id.toString() === userData.value.user.user_email ? "" : userData.value.user.user_email
    })

    // 获取用户系统角色
    const userSysRole = computed(() => {
        if (userData.value.user_meta) {
            for (const meta of userData.value.user_meta) {
                if (meta.meta_key === "role_name") {
                    return meta.meta_value
                }
            }
        }
        return ""
    })

    // 获取用户系统角色
    const userMembershipRole = computed(() => {
        const membershipItems = []
        if (userData.value.membership_items) {
            for (const item of userData.value.membership_items) {
                if (!item.expire_time.Valid || (item.expire_time.Time && new Date(item.expire_time.Time) > new Date())) {
                    membershipItems.push(item)
                }
            }
        }

        // 对会员角色去重并返回逗号分隔字符串
        const uniqueRoles = new Set<string>()
        membershipItems.forEach((item) => uniqueRoles.add(item.role))
        return Array.from(uniqueRoles).join(", ")
    })
    const userNameRef = toRef(editForm, "userName")
    const excludingUserIDRef = toRef(userData.value.user.id.toString())

    // hooks
    const { checkUserNameExcludingUserIDValidator, createUserNameRules, createNickNameRules } = useAccountFormValidation({
        FormUserName: userNameRef,
        FormExcludingUserID: excludingUserIDRef,
    })

    const rules = reactive<FormRules<EditForm>>({
        userName: createUserNameRules(checkUserNameExcludingUserIDValidator),
        nickName: createNickNameRules(),
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
                const req: EditUserInfoRequest = {
                    user_name: editForm.userName,
                    nick_name: editForm.nickName,
                    subscribe_status: editForm.subscribeStatus,
                    sex: editForm.sex,
                    description: editForm.description,
                }

                const res = await editUserInfoAPI(req)

                if (res.data.code === ResponseCode.EditUserInfoSuccess) {
                    await userStore.getUserInfoByToken(true)
                    changeUserNameDisabled()
                    // 显示成功提示
                    MessageUtil.success(res.data.msg, 6000)
                } else {
                    // 注册失败
                    const msg = handleResErr(res)
                    MessageUtil.error(msg, 0)
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return userDataP[platform] ? (userDataP[platform] as any)[field] : ""
    }

    /**
     * @description: 绑定社交账号
     * @param platform 平台
     * @return  void
     */
    const bindSocial = async (platform: SocialLoginType) => {
        if (!userStore.isBindEmail) {
            await userStore.changeShowDialogBindEmail(true)
            return
        }

        await userStore.socialBind(platform)

        updateShowStatus(platform)
    }

    const unBindSocial = async (platform: SocialLoginType) => {
        await userStore.socialUnBind(platform)
        if (platform === SocialLoginType.QQ) {
            showQQ.value = false
        } else if (platform === SocialLoginType.WeChat) {
            showWeChat.value = false
        }

        updateShowStatus(platform)
    }

    /**
     * @description: 更新社交账号显示状态
     * @param platform 平台
     * @return  void
     */
    const updateShowStatus = (platform: SocialLoginType) => {
        if (platform === SocialLoginType.QQ && userData.value.user_qq && userData.value.user_qq.openid) {
            showQQ.value = true
        } else if (platform === SocialLoginType.WeChat && userData.value.user_wechat && userData.value.user_wechat.unionid) {
            showWeChat.value = true
        }
    }

    onMounted(() => {
        updateShowStatus(SocialLoginType.QQ)
        updateShowStatus(SocialLoginType.WeChat)
        changeUserNameDisabled()
    })

    const updateAvatarToDB = async (avatarUrl: string) => {
        const req: SetAvatarRequest = {
            user_id: userData.value.user.id.toString(),
            avatar_url: avatarUrl,
        }
        // 更新头像
        await setAvatarAPI(req).then((res) => {
            if (res.data.code === ResponseCode.SetAvatarSuccess) {
                // 更新用户信息
                userStore.setAvatar(req.avatar_url)
                userStore.getUserInfoByToken(true)
            } else {
                const msg = handleResErr(res)
                MessageUtil.error(msg, 0)
            }
        })
    }

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
        updateAvatarToDB,
        userSysRole,
        userMembershipRole,
    }
}
