<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\user-view\component\edit-user\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 编辑用户
-->

<template>
    <div class="edit-user-page">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="editUserFormRef"
            :model="editUserForm"
            :rules="rules"
            class="edit-user-form"
            :size="formSize"
            status-icon
        >
            <el-form-item>
                <div class="edit-avatar-info">
                    <div class="edit-avatar">
                        <AvatarInitials :name="editUserForm.userName" :avatar="avatar" />
                    </div>
                    <div class="edit-avatar-btn">
                        <AvatarUpload :avatar_user_id="editUserForm.editUserID" @avatar-upload-url="updateAvatarToDB" />
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="用户ID" prop="editUserID">
                <el-input v-model="editUserForm.editUserID" disabled />
            </el-form-item>

            <el-form-item label="用户名" prop="userName">
                <el-input v-model="editUserForm.userName" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editUserForm.email" />
            </el-form-item>

            <el-form-item label="禁用到期时间" prop="disableExpiresAt">
                <el-date-picker
                    v-model="editUserForm.disableExpiresAt.Time"
                    type="datetime"
                    placeholder="留空则为未禁用"
                    :shortcuts="shortcuts"
                    :default-time="defaultTime"
                />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input class="generate-password" type="text" v-model="editUserForm.password" />
                <button type="button" class="btn-generate-password" @click="generatePasswordHandle">生成密码</button>
            </el-form-item>

            <el-form-item label="角色" prop="roleName">
                <el-select v-model="editUserForm.roleName" placeholder="选择用户角色">
                    <el-option v-for="item in props.roles" :key="item.role_name" :label="item.description" :value="item.role_name" />
                </el-select>
            </el-form-item>

            <el-form-item label="昵称" prop="nickName">
                <el-input v-model="editUserForm.nickName" />
            </el-form-item>

            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="editUserForm.sex">
                    <el-radio value="男">男</el-radio>
                    <el-radio value="女">女</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="简介" prop="description">
                <el-input v-model="editUserForm.description" type="textarea" placeholder="这个人很懒,什么也没有留下。" />
            </el-form-item>

            <div class="btn-submit">
                <el-form-item>
                    <el-button type="primary" :loading="btnLoading" @click="submitForm(editUserFormRef as FormInstance)">更新</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="logoutByAdmin">登出</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { onBeforeMount, reactive, ref, toRef, useTemplateRef, watch } from "vue"

import { type Role } from "@/api/permissionRole/role"
import { handleResErr, ResponseCode } from "@/api/response"
import { setAvatarAPI, type SetAvatarRequest } from "@/api/upload/setAvatar"
import { editUserInfoByAdminAPI, type EditUserInfoByAdminRequest } from "@/api/user/editUserInfoByAdmin"
import { type UserInfo } from "@/api/user/getUserInfo"
import { getUserInfoByUserIDAPI, type GetUserInfoByUserIDRequest } from "@/api/user/getUserInfoByUserID"
import { logoutByAdminAPI, type LogoutByAdminRequest } from "@/api/user/logoutByAdmin"
import AvatarInitials from "@/components/common/avatar-initials"
import AvatarUpload from "@/components/common/avatar-upload"
import { useAccountFormValidation } from "@/components/hooks/useAccountFormValidation"
import { getAvatarUrl } from "@/utils/avatar"
// import { type PgSqlDateTime } from "@/api/common"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"
import { getUserMetaValue } from "@/utils/metaInfo"
import { generatePassword } from "@/utils/password"

import type { EditUserByAdminForm } from "./types"

defineOptions({ name: "EditUser" })

const emit = defineEmits<{
    (event: "edit-user-status", value: boolean): void // 编辑用户状态
}>()

// props
const props = defineProps<{
    editUserData: EditUserByAdminForm // 需要编辑的用户ID
    roles: Role[] // 角色列表
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("large")

// 默认时间为当前日期
const defaultTime = new Date()

// 时间快捷选项
const shortcuts = [
    {
        text: "禁止5分钟",
        value: () => {
            const date = new Date()
            date.setMinutes(date.getMinutes() + 5)
            return date
        },
    },
    {
        text: "禁止1小时",
        value: () => {
            const date = new Date()
            date.setHours(date.getHours() + 1)
            return date
        },
    },
    {
        text: "禁止天",
        value: () => {
            const date = new Date()
            date.setDate(date.getDate() + 1)
            return date
        },
    },
    {
        text: "禁止7天",
        value: () => {
            const date = new Date()
            date.setDate(date.getDate() + 7)
            return date
        },
    },
]

// 表单实例
const editUserFormRef = useTemplateRef<FormInstance>("editUserFormRef")

// // 按需获取禁用时间
// const getPgSqlDateTime = (disableExpiresAt: PgSqlDateTime) => {
//     if (!disableExpiresAt.Time) {
//         return {
//             time: null,
//             valid: false,
//         }
//     }
//     const now = new Date().getTime() // 获取当前时间的时间戳
//     const disableExpiresAtTime = new Date(disableExpiresAt.Time).getTime() // 获取 disableExpiresAt.Time 的时间戳
//     // 比较两个时间戳，如果 disableExpiresAtTime 小于当前时间 now，则 valid 为 false，否则为 true
//     if (disableExpiresAtTime > now) {
//         return {
//             time: disableExpiresAt.Time,
//             valid: true,
//         }
//     }
//     return {
//         time: null,
//         valid: false,
//     }
// }

// 表单数据
const editUserForm = reactive<EditUserByAdminForm>({
    editUserID: "",
    userName: "",
    email: "",
    disableExpiresAt: {
        Time: null,
        Valid: false,
    },
    password: "",
    roleName: "",
    nickName: "",
    sex: "男",
    description: "",
})

// 头像 url
const avatar = ref("")

const updateEditUserForm = (data: EditUserByAdminForm) => {
    editUserForm.editUserID = data.editUserID
    editUserForm.userName = data.userName
    editUserForm.email = data.email
    editUserForm.disableExpiresAt = data.disableExpiresAt
    editUserForm.password = ""
    editUserForm.roleName = data.roleName
    editUserForm.nickName = data.nickName
}

//  获取用户信息
const getUserInfo = async () => {
    const req: GetUserInfoByUserIDRequest = {
        user_id: props.editUserData.editUserID,
    }

    const { data } = await getUserInfoByUserIDAPI(req)
    if (data.code === ResponseCode.UserGetInfoSuccess) {
        const userInfo: UserInfo = data.data
        editUserForm.sex = getUserMetaValue("sex", userInfo) || "男"
        editUserForm.description = getUserMetaValue("description", userInfo) || ""
        avatar.value = getAvatarUrl(userInfo)
    }
    console.log("editUserForm:", editUserForm)
}

const userNameRef = toRef(editUserForm, "userName")
const emailRef = toRef(editUserForm, "email")
const passwordRef = toRef(editUserForm, "password")
const excludingUserIDRef = toRef(editUserForm, "editUserID")

// hooks
const { checkUserNameExcludingUserIDValidator, checkEmailExcludingUserIDValidator, createEmailRules, createPasswordRules, createUserNameRules } =
    useAccountFormValidation({
        FormUserName: userNameRef,
        FormEmail: emailRef,
        FormPassword: passwordRef,
        FormExcludingUserID: excludingUserIDRef,
    })

const generatePasswordHandle = () => {
    editUserForm.password = generatePassword()
}

const rules = reactive<FormRules<EditUserByAdminForm>>({
    userName: createUserNameRules(checkUserNameExcludingUserIDValidator),
    email: createEmailRules(checkEmailExcludingUserIDValidator),
    password: createPasswordRules(false),
})

const btnLoading = ref(false)

/**
 * @description: 提交表单
 * @param formEl 表单实例
 * @param fields 表单字段
 * @return  void
 */
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    btnLoading.value = true

    await formEl.validate(async (valid) => {
        if (valid) {
            // 当前时间
            const now = new Date()
            // 当前时间小于禁用时间 valid = true
            if (editUserForm.disableExpiresAt.Time && now >= editUserForm.disableExpiresAt.Time) {
                MessageUtil.error("禁用时间不能小于当前时间", 6000)
                return
            }
            if (editUserForm.disableExpiresAt.Time && now < editUserForm.disableExpiresAt.Time) {
                editUserForm.disableExpiresAt.Valid = true
            }
            if (!editUserForm.disableExpiresAt.Time) {
                editUserForm.disableExpiresAt.Valid = false
            }

            const req: EditUserInfoByAdminRequest = {
                edit_user_id: editUserForm.editUserID,
                user_name: editUserForm.userName,
                email: editUserForm.email,
                disable_expires_at: editUserForm.disableExpiresAt,
                password: editUserForm.password,
                role_name: editUserForm.roleName,
                nick_name: editUserForm.nickName,
                sex: editUserForm.sex,
                description: editUserForm.description,
            }
            const { data } = await editUserInfoByAdminAPI(req)

            if (data.code === ResponseCode.EditUserInfoByAdminSuccess) {
                // 保证有数据且包含 stream_items 字段才进行轮询
                if (data.data && data.data.stream_items) {
                    await pollingGetStreamIDsStatus(data.data.stream_items)
                }
                btnLoading.value = false

                // 添加成功提示
                emit("edit-user-status", true)
                MessageUtil.success(data.msg, 6000)
            } else {
                btnLoading.value = false
                // 添加失败提示
                MessageUtil.error(data.msg, 0)
            }
        }
    })
}

// 头像更新状态
const updateAvatarToDB = async (avatarUrl: string) => {
    const req: SetAvatarRequest = {
        user_id: editUserForm.editUserID,
        avatar_url: avatarUrl,
    }
    // 更新头像
    await setAvatarAPI(req).then(async (res) => {
        if (res.data.code === ResponseCode.SetAvatarSuccess) {
            // 轮询后端是否完成
            await pollingGetStreamIDsStatus(res.data.data.stream_items)

            // 更新用户信息
            await getUserInfo()
            emit("edit-user-status", true)
        } else {
            MessageUtil.error(handleResErr(res), 0)
        }
    })
}

// 注销会话
const logoutByAdmin = async () => {
    const req: LogoutByAdminRequest = {
        logout_user_id: editUserForm.editUserID,
    }

    const { data } = await logoutByAdminAPI(req)

    if (data.code === ResponseCode.UserLogoutByAdminSuccess) {
        // 添加成功提示
        emit("edit-user-status", true)
        MessageUtil.success(data.msg, 6000)
    } else {
        // 添加失败提示
        MessageUtil.error(data.msg, 0)
    }
}

// 监控 props.editUserData 变化 更新页面数据
watch(
    () => props.editUserData,
    (newVal) => {
        updateEditUserForm(newVal) // 更新表单数据
        getUserInfo() // 获取用户信息
    },
    { deep: true }, // 深度观察 { deep: true } 选项
)

onBeforeMount(() => {
    getUserInfo()
    updateEditUserForm(props.editUserData)
})
</script>

<style lang="scss" scoped>
.edit-user-page {
    display: flex;
    align-items: center;
}

.edit-user-form {
    width: 400px;
}

.edit-avatar-info {
    // border-top: 2px solid #ebebeb;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.edit-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 30px 10px 0;
}

.generate-password {
    flex: 5;
}

.btn-generate-password {
    flex: 2;
}

.btn-generate-password {
    width: 120px;
    margin-left: 10px;
    padding: 0 10px;
    height: 40px;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    color: #333;
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}
</style>
