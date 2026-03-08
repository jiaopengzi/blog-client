<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\user-view\component\edit-user\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 编辑用户
-->

<template>
    <div class="edit-user-page user-form-page">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="editUserFormRef"
            :model="editUserForm"
            :rules="rules"
            class="edit-user-form user-form-shell"
            :size="formSize"
            status-icon
        >
            <div class="form-intro">
                <div>
                    <p class="eyebrow">USER PROFILE</p>
                    <h2 class="form-title">编辑用户</h2>
                </div>
                <div class="intro-meta">
                    <span class="meta-chip">{{ editUserForm.roleName || "未设置角色" }}</span>
                    <span class="meta-subtle">ID: {{ editUserForm.editUserID || "--" }}</span>
                </div>
            </div>

            <section class="form-section profile-section">
                <el-form-item class="avatar-form-item">
                    <div class="edit-avatar-info">
                        <div class="edit-avatar-panel">
                            <AvatarInitials :name="editUserForm.userName" :avatar="avatar" />
                            <div class="edit-avatar-copy">
                                <h3>头像</h3>
                                <p>头像更新会立即同步到当前用户资料。</p>
                            </div>
                        </div>
                        <div class="edit-avatar-btn">
                            <AvatarUpload :avatar_user_id="editUserForm.editUserID" @avatar-upload-url="updateAvatarToDB" />
                        </div>
                    </div>
                </el-form-item>
            </section>

            <section class="form-section">
                <div class="section-head">
                    <h3>账号信息</h3>
                </div>

                <!-- <el-form-item label="用户ID" prop="editUserID">
                    <el-input v-model="editUserForm.editUserID" disabled />
                </el-form-item> -->

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
                    <div class="field-inline">
                        <el-input class="generate-password" type="text" v-model="editUserForm.password" />
                        <button type="button" class="btn-generate-password" @click="generatePasswordHandle">生成密码</button>
                    </div>
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
                    <el-radio-group v-model="editUserForm.sex" class="sex-group">
                        <el-radio value="男">男</el-radio>
                        <el-radio value="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="简介" prop="description">
                    <el-input v-model="editUserForm.description" type="textarea" placeholder="这个人很懒,什么也没有留下。" />
                </el-form-item>
            </section>

            <div class="form-actions dual-actions">
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

    try {
        const valid = await formEl
            .validate()
            .then(() => true)
            .catch(() => false)

        if (!valid) {
            return
        }

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

            // 添加成功提示
            emit("edit-user-status", true)
            MessageUtil.success(data.msg, 6000)
            return
        }

        // 添加失败提示
        MessageUtil.error(data.msg, 0)
    } finally {
        btnLoading.value = false
    }
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
.user-form-page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 8px 0;
}

.user-form-shell {
    width: min(620px, 100%);
    padding: 28px;
    border-radius: 28px;
    border: 1px solid color-mix(in srgb, var(--jpz-color-primary) 14%, var(--el-border-color));
    background:
        linear-gradient(135deg, color-mix(in srgb, var(--jpz-color-primary) 5%, transparent), transparent 42%),
        linear-gradient(180deg, color-mix(in srgb, var(--el-bg-color-overlay) 96%, transparent), var(--el-bg-color));
    box-shadow:
        0 20px 48px rgb(15 23 42 / 8%),
        inset 0 1px 0 rgb(255 255 255 / 18%);
}

.form-intro {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
}

.eyebrow {
    margin: 0 0 10px;
    font-size: 12px;
    letter-spacing: 0.16em;
    color: var(--jpz-text-color-secondary);
}

.form-title {
    margin: 0 0 10px;
    font-size: 32px;
    line-height: 1.1;
    color: var(--jpz-text-color-primary);
}

.intro-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
}

.meta-chip {
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--jpz-color-primary) 18%, var(--el-border-color));
    background: color-mix(in srgb, var(--jpz-color-primary) 8%, transparent);
    color: var(--jpz-color-primary);
    font-size: 13px;
    font-weight: 700;
}

.meta-subtle {
    font-size: 12px;
    color: var(--jpz-text-color-secondary);
}

.form-section {
    padding: 18px 18px 6px;
    border-radius: 22px;
    border: 1px solid var(--el-border-color-lighter);
    background: color-mix(in srgb, var(--el-fill-color-light) 78%, transparent);

    & + .form-section {
        margin-top: 16px;
    }
}

.profile-section {
    padding-bottom: 18px;
}

.section-head {
    margin-bottom: 16px;

    h3 {
        margin: 0 0 6px;
        font-size: 18px;
        color: var(--jpz-text-color-primary);
    }

    p {
        margin: 0;
        font-size: 13px;
        line-height: 1.7;
        color: var(--jpz-text-color-secondary);
    }
}

.avatar-form-item {
    margin-bottom: 0;
}

.edit-avatar-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
}

.edit-avatar-panel {
    display: flex;
    align-items: center;
    gap: 18px;
}

.edit-avatar-copy {
    h3 {
        margin: 0 0 6px;
        font-size: 18px;
        color: var(--jpz-text-color-primary);
    }

    p {
        margin: 0;
        font-size: 13px;
        line-height: 1.7;
        color: var(--jpz-text-color-secondary);
    }
}

.field-inline {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
}

.generate-password {
    flex: 1;
}

.btn-generate-password {
    flex: 0 0 auto;
    min-width: 112px;
    height: 40px;
    padding: 0 14px;
    border: 1px solid color-mix(in srgb, var(--jpz-color-primary) 18%, var(--el-border-color));
    border-radius: 14px;
    background: color-mix(in srgb, var(--jpz-color-primary) 8%, var(--el-bg-color));
    color: var(--jpz-color-primary);
    cursor: pointer;
    transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--jpz-color-primary) 32%, var(--el-border-color));
        background: color-mix(in srgb, var(--jpz-color-primary) 12%, var(--el-bg-color));
    }
}

.sex-group {
    min-height: 40px;
    display: flex;
    align-items: center;
}

.form-actions {
    margin-top: 22px;
}

.dual-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
}

:deep(.el-form-item) {
    margin-bottom: 18px;
}

:deep(.el-form-item__label) {
    color: var(--jpz-text-color-primary);
    font-weight: 600;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-textarea__inner),
:deep(.el-date-editor.el-input__wrapper) {
    border-radius: 14px;
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--el-border-color) 92%, transparent) inset;
    background: color-mix(in srgb, var(--el-bg-color-overlay) 96%, transparent);
}

.dual-actions :deep(.el-form-item) {
    margin-bottom: 0;
}

.dual-actions :deep(.el-form-item__content) {
    margin-left: 0 !important;
    justify-content: center;
}

@include respond-to("phone") {
    .user-form-shell {
        padding: 20px;
        border-radius: 22px;
    }

    .form-intro,
    .edit-avatar-info,
    .edit-avatar-panel {
        flex-direction: column;
        align-items: flex-start;
    }

    .intro-meta {
        align-items: flex-start;
    }

    .field-inline {
        flex-direction: column;
        align-items: stretch;
    }

    .btn-generate-password {
        width: 100%;
    }
}
</style>
