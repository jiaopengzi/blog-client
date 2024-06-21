<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 08:47:01
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-21 23:35:53
 * @FilePath     : \blog-client\src\views\admin\component\main\user-view\component\edit-user\index.vue
 * @Description  : 编辑用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->


<template>
    <div class="edit-user-page">
        <el-form :label-position="labelPosition" label-width="100px" ref="editUserFormRef" :model="editUserForm"
            :rules="rules" class="edit-user-form" :size="formSize" status-icon>

            <el-form-item>
                <div class="edit-avatar-div">
                    <div class="edit-avatar">
                        <AvatarInitials :name="editUserForm.userName" :avatar="avatar" />
                    </div>
                    <div class="edit-avatar-btn">
                        <AvatarUpload :avatar_user_id="editUserForm.editUserID"
                            @avatar-upload-status="avatarUploadStatus" />
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="用户ID" prop="editUserID">
                <el-input v-model.trim="editUserForm.editUserID" disabled />
            </el-form-item>

            <el-form-item label="用户名" prop="userName">
                <el-input v-model.trim="editUserForm.userName" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model.trim="editUserForm.email" />
            </el-form-item>

            <el-form-item label="禁用到期时间" prop="disableExpiresAt">
                <el-date-picker v-model="editUserForm.disableExpiresAt.Time" type="datetime" placeholder="留空则为未禁用" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input class="generate-password" type="text" v-model.trim="editUserForm.password" />
                <button class="btn-generate-password" type="button" @click="generatePasswordHandle">
                    重置密码
                </button>
            </el-form-item>

            <el-form-item label="角色" prop="roleName">

                <el-select v-model="editUserForm.roleName" placeholder="选择用户角色">
                    <el-option v-for="item in props.roles" :key="item.role_name" :label="item.description"
                        :value="item.role_name" />
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
                    <el-button type="primary" @click="submitForm(editUserFormRef)">更新</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="logoutByAdmin">登出</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRef, onBeforeMount, watch } from 'vue'
import { ShowMsgTip } from '@/utils/message'
import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S
import { type EditUserInfoByAdminRequest, EditUserInfoByAdminAPI } from '@/api/user/editUserInfoByAdmin'
import { ResponseCode } from '@/api/responseCode'
import { type EditUserByAdminForm } from '@/views/admin/component/main/user-view/component/edit-user'
import { useFormValidation } from '@/components/hooks/useFormValidation'
import { generatePassword } from '@/utils/password'
import { type Role } from '@/api/permissionRole/role'
import { type UserInfo } from '@/api/user/getUserInfo'
import { type GetUserInfoByUserIDRequest, getUserInfoByUserIDAPI } from '@/api/user/getUserInfoByUserID'
import { getUserMetaValue } from '@/utils/metaInfo'
import AvatarInitials from '@/components/common/avatar-initials'
import AvatarUpload from '@/components/common/avatar-upload'
import { getAvatarUrl } from '@/utils/avatar'
import { RegexPatterns } from '@/utils/regexPatterns'
import { type LogoutByAdminRequest, logoutByAdminAPI } from '@/api/user/logoutByAdmin'

defineOptions({ name: 'EditUser' })

const emit = defineEmits<{
    (event: 'edit-user-status', value: boolean): void // 编辑用户状态
}>()

// props
const props = defineProps<{
    editUserData: EditUserByAdminForm // 需要编辑的用户ID
    roles: Role[] // 角色列表
}>()


// 表单label位置 top | left | right
const labelPosition = ref('left')

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('large')

// 表单实例
const editUserFormRef = ref<FormInstance>()
// const role_name = ref('Subscriber')

// 表单数据
const editUserForm = reactive<EditUserByAdminForm>({
    editUserID: props.editUserData.editUserID,
    userName: props.editUserData.userName,
    email: props.editUserData.email,
    disableExpiresAt: props.editUserData.disableExpiresAt, // 转换为 Date 类型,
    password: '',
    roleName: props.editUserData.roleName,
    nickName: props.editUserData.nickName,
    sex: '男',
    description: '',
})

// 头像 url
const avatar = ref('')

const updateEditUserForm = (data: EditUserByAdminForm) => {
    editUserForm.editUserID = data.editUserID
    editUserForm.userName = data.userName
    editUserForm.email = data.email
    editUserForm.disableExpiresAt = data.disableExpiresAt
    editUserForm.password = ''
    editUserForm.roleName = data.roleName
    editUserForm.nickName = data.nickName
}


//  获取用户信息
const getUserInfo = async () => {
    const req: GetUserInfoByUserIDRequest = {
        user_id: props.editUserData.editUserID
    }

    const { data } = await getUserInfoByUserIDAPI(req)
    if (data.code === ResponseCode.UserGetInfoSuccess) {
        const userInfo: UserInfo = data.data
        editUserForm.sex = getUserMetaValue('sex', userInfo) || '男'
        editUserForm.description = getUserMetaValue('description', userInfo) || ''
        avatar.value = getAvatarUrl(userInfo)
    }
    console.log('editUserForm:', editUserForm)
}


const userNameRef = toRef(editUserForm, 'userName')
const emailRef = toRef(editUserForm, 'email')
const passwordRef = toRef(editUserForm, 'password')
const excludingUserIDRef = toRef(editUserForm, 'editUserID')

// hooks
const {
    checkUserNameExcludingUserIDValidator,
    checkEmailExcludingUserIDValidator,
} = useFormValidation({
    FormUserName: userNameRef,
    FormEmail: emailRef,
    FormPassword: passwordRef,
    FormExcludingUserID: excludingUserIDRef,
})

const generatePasswordHandle = () => {
    editUserForm.password = generatePassword()
}


/**
 * @description: 表单校验规则
 * @return  FormRules<EditUserForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<EditUserByAdminForm>>({
    userName: [
        { required: true, message: '请输入用户名！', trigger: 'blur' },
        { pattern: new RegExp(RegexPatterns.UserName), message: '用户名长度:6-20的小写字母或数字', trigger: 'change' },
        // 用户查重
        { validator: checkUserNameExcludingUserIDValidator, trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入小写的邮箱地址', trigger: 'blur' },
        {
            pattern: new RegExp(RegexPatterns.Email),
            message: '请输入有效的邮箱',
            trigger: 'blur',
        },
        // 邮箱查重
        { validator: checkEmailExcludingUserIDValidator, trigger: 'blur' },
    ],
    password: [
        { message: '请输入密码', trigger: 'change' },
        // 必须包含：大小写字母+数字,长度:6-64 特殊字符可有可无
        {
            pattern: new RegExp(RegexPatterns.Password),
            message: '必须包含：大小写字母+数字,长度:6-64',
            trigger: 'blur',
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
    try {
        await formEl.validate(async (valid) => {
            if (valid) {
                // 创建请求对象 加密内容
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
                console.log('req:', req)
                console.log('req.disable_expires_at type:', typeof req.disable_expires_at)
                console.log('editUserForm.disableExpiresAt type', typeof editUserForm.disableExpiresAt)
                const { data } = await EditUserInfoByAdminAPI(req)

                if (data.code === ResponseCode.EditUserInfoByAdminSuccess) {
                    // 添加成功提示
                    emit('edit-user-status', true)
                    ShowMsgTip(ShowMsgTip.MsgType.success, data.msg, 6000)

                } else {
                    // 添加失败提示
                    ShowMsgTip(ShowMsgTip.MsgType.error, data.msg, 0)
                }
                console.log('submit!')
            }
        })
    } catch (error) {
        return
    }

}

// 头像更新状态
const avatarUploadStatus = (status: boolean) => {
    if (status) {
        getUserInfo()
        emit('edit-user-status', true)
    }
}

// 注销会话
const logoutByAdmin = async () => {
    const req: LogoutByAdminRequest = {
        logout_user_id: editUserForm.editUserID
    }

    const { data } = await logoutByAdminAPI(req)

    if (data.code === ResponseCode.UserLogoutByAdminSuccess) {
        // 添加成功提示
        emit('edit-user-status', true)
        ShowMsgTip(ShowMsgTip.MsgType.success, data.msg, 6000)

    } else {
        // 添加失败提示
        ShowMsgTip(ShowMsgTip.MsgType.error, data.msg, 0)
    }
}

// 监控 props.editUserData 变化 更新页面数据
watch(
    () => props.editUserData,
    (newVal) => {
        updateEditUserForm(newVal) // 更新表单数据
        getUserInfo() // 获取用户信息
    },
    { deep: true } // 深度观察 { deep: true } 选项
)

onBeforeMount(() => {
    getUserInfo()
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