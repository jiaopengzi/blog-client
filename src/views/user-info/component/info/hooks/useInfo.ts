/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-13 18:13:40
 * @FilePath     : \blog-client\src\views\user-info\component\info\hooks\useInfo.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { reactive, ref, onBeforeMount, onMounted, computed, toRef } from "vue"
import type { Ref, ComputedRef } from "vue"
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"
import type { UserInfo } from "@/api/user/getUserInfo"
import { Social } from "@/api/responseCode"
import { ResponseCode, handleErrInfo } from "@/api/responseCode"
import type { EditUserInfoRequest } from "@/api/user/editUserInfo"
import { editUserInfoAPI } from "@/api/user/editUserInfo"
import { ShowMsgTip } from "@/utils/message"
import type { EditForm } from "@/views/user-info/component/info"
import { formatTime } from "@/utils/dateTime"
import { useFormValidation } from "@/components/hooks/useFormValidation"
import { getUserMetaValue } from "@/utils/metaInfo"
import { RegexPatterns } from "@/utils/regexPatterns"
import { setAvatarAPI, type SetAvatarRequest } from "@/api/upload/setAvatar"

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
    bindSocial: (platform: Social) => Promise<void>
    unBindSocial: (platform: Social) => Promise<void>
    userNameDisabled: Ref<boolean>
    email: ComputedRef<string>
    updateAvatarToDB(avatarUrl: string): void
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
        sex: getUserMetaValue("sex", userData.value) || "男",
        description: getUserMetaValue("description", userData.value) || "",
    })

    const email = computed(() => {
        return userData.value.user.id.toString() === userData.value.user.user_email
            ? ""
            : userData.value.user.user_email
    })

    const userNameRef = toRef(editForm, "userName")
    const excludingUserIDRef = toRef(userData.value.user.id.toString())

    // hooks
    const { checkUserNameExcludingUserIDValidator } = useFormValidation({
        FormUserName: userNameRef,
        FormExcludingUserID: excludingUserIDRef,
    })

    // 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
    const rules = reactive<FormRules<EditForm>>({
        userName: [
            { required: true, message: "请输入用户名！", trigger: "blur" },
            {
                pattern: RegexPatterns.UserName,
                message: "用户名长度:6-20的小写字母或数字",
                trigger: "change",
            },
            // 用户查重
            { validator: checkUserNameExcludingUserIDValidator, trigger: "blur" },
        ],

        nickName: [
            { required: true, message: "请输入昵称！", trigger: "blur" },
            {
                pattern: RegexPatterns.NickName,
                message: "昵称长度1-20字符",
                trigger: "change",
            },
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
                const req: EditUserInfoRequest = {
                    user_name: editForm.userName,
                    nick_name: editForm.nickName,
                    sex: editForm.sex,
                    description: editForm.description,
                }

                const res = await editUserInfoAPI(req)

                if (res.data.code === ResponseCode.UserEditUserInfoSuccess) {
                    await userStore.getUserInfoByToken(true)
                    changeUserNameDisabled()
                    // 显示成功提示
                    ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 6000)
                } else {
                    // 注册失败
                    const msg = handleErrInfo(res)
                    ShowMsgTip(ShowMsgTip.MsgType.error, msg, 0)
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
    const bindSocial = async (platform: Social) => {
        if (!userStore.isBindEmail) {
            await userStore.changeShowDialogBindEmail(true)
            return
        }

        if (platform === Social.QQ) {
            await userStore.bindQQ()
        } else if (platform === Social.WeChat) {
            await userStore.bindWeChat()
        }
        updateShowStatus(platform)
    }

    const unBindSocial = async (platform: Social) => {
        if (platform === Social.QQ) {
            await userStore.unBindQQ()
            showQQ.value = false
        } else if (platform === Social.WeChat) {
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
    const updateShowStatus = (platform: Social) => {
        if (platform === Social.QQ && userData.value.user_qq && userData.value.user_qq.openid) {
            showQQ.value = true
        } else if (
            platform === Social.WeChat &&
            userData.value.user_wechat &&
            userData.value.user_wechat.unionid
        ) {
            showWeChat.value = true
        }
    }

    onMounted(() => {
        updateShowStatus(Social.QQ)
        updateShowStatus(Social.WeChat)
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
                // userStore.getUserInfoByToken(true)
            } else {
                const msg = handleErrInfo(res)
                ShowMsgTip(ShowMsgTip.MsgType.error, msg, 0)
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
    }
}
