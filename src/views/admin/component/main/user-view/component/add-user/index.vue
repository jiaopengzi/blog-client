<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-06-16 14:48:56
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-18 08:43:48
 * @FilePath     : \blog-client\src\views\admin\component\main\user-view\component\add-user\index.vue
 * @Description  : 添加用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="add-user-page">
        <el-form :label-position="labelPosition" label-width="100px" ref="addUserFormRef" :model="addUserForm"
            :rules="rules" class="add-user-form" :size="formSize" status-icon>
            <el-form-item label="用户名" prop="userName">
                <el-input v-model.trim="addUserForm.userName" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model.trim="addUserForm.email" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input class="generate-password" type="text" v-model.trim="addUserForm.password" />
                <button class="btn-generate-password" type="button" @click="generatePasswordHandle">
                    生成密码
                </button>
            </el-form-item>

            <el-form-item label="角色" prop="roleName">
                <el-select v-model="addUserForm.roleName" placeholder="选择用户角色">
                    <el-option v-for="item in props.roles" :key="item.role_name" :label="item.description"
                        :value="item.role_name" />
                </el-select>
            </el-form-item>
            <el-form-item prop="isSendEmail">
                <el-checkbox v-model="addUserForm.isSendEmail" value="发送邮件" name="send_email">是否发送邮件到用户邮箱。</el-checkbox>
            </el-form-item>

            <div class="btn-submit">
                <el-form-item>
                    <el-button type="primary" @click="submitForm(addUserFormRef)">新增用户</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRef } from 'vue'
import { ShowMsgTip } from '@/utils/message'
import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S
import type { AddUserRequest } from '@/api/user/addUser'
import { AddUserAPI } from '@/api/user/addUser'
import { ResponseCode } from '@/api/responseCode'
import type { AddUserForm } from '@/views/admin/component/main/user-view/component/add-user'
import { useFormValidation } from '@/components/hooks/useFormValidation'
import { generatePassword } from '@/utils/password'
import { type Role } from '@/api/permissionRole/role'
import { RegexPatterns } from '@/utils/regexPatterns'

defineOptions({ name: 'AddUser' })

const emit = defineEmits<{
    (event: 'add-user-status', value: boolean): void // 添加用户状态
}>()

// props
const props = defineProps<{
    roles: Role[] // 角色列表
}>()


// 表单label位置 top | left | right
const labelPosition = ref('left')

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('large')

// 表单实例
const addUserFormRef = ref<FormInstance>()
// const role_name = ref('Subscriber')

// 表单数据
const addUserForm = reactive<AddUserForm>({
    userName: 'jiaopengzi',
    email: 'jiaopengzi@qq.com',
    password: generatePassword(),
    roleName: 'Subscriber',
    isSendEmail: false
})

const userNameRef = toRef(addUserForm, 'userName')
const emailRef = toRef(addUserForm, 'email')
const passwordRef = toRef(addUserForm, 'password')

// hooks
const {
    checkUserNameValidator,
    checkEmailValidator } = useFormValidation({
        FormUserName: userNameRef,
        FormEmail: emailRef,
        FormPassword: passwordRef
    })

const generatePasswordHandle = () => {
    addUserForm.password = generatePassword()
}


/**
 * @description: 表单校验规则
 * @return  FormRules<AddUserForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<AddUserForm>>({
    userName: [
        { required: true, message: '请输入用户名！', trigger: 'blur' },
        { pattern: new RegExp(RegexPatterns.UserName), message: '用户名长度:6-20的小写字母或数字', trigger: 'change' },
        // 用户查重
        { validator: checkUserNameValidator, trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入小写的邮箱地址', trigger: 'blur' },
        {
            pattern: new RegExp(RegexPatterns.Email),
            message: '请输入有效的邮箱',
            trigger: 'blur',
        },
        // 邮箱查重
        { validator: checkEmailValidator, trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'change' },
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
                const req: AddUserRequest = {
                    user_name: addUserForm.userName,
                    password: addUserForm.password,
                    email: addUserForm.email,
                    role_name: addUserForm.roleName,
                    is_send_email: addUserForm.isSendEmail
                }
                console.log('req:', req)
                const { data } = await AddUserAPI(req)

                if (data.code === ResponseCode.UserAddUserSuccess) {
                    // 添加成功提示
                    emit('add-user-status', true)
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

</script>

<style lang="scss" scoped>
.add-user-page {
    display: flex;
    align-items: center;
}

.add-user-form {
    width: 400px;
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