<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-06-16 14:48:56
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-16 18:01:01
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
            <el-form-item prop="acceptedTerms">
                <el-checkbox value="发送邮件" name="acceptedTerms">是否发送邮件到用户邮箱</el-checkbox>
            </el-form-item>

            <div class="btn-submit">
                <el-form-item>
                    <el-button type="primary" @click="submitForm(addUserFormRef)">注册</el-button>
                    <el-button @click="resetForm(addUserFormRef)">重置</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ShowMsgTip } from '@/utils/message'
import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S
import type { AddUserRequest } from '@/api/user/addUser'
import { AddUserByJosn } from '@/api/user/addUser'
import { ResponseCode } from '@/api/responseCode'
import type { AddUserForm } from '@/views/admin/component/main/user-view/component/add-user'
import { useFormValidation } from '@/components/hooks/useFormValidation'
import { generatePassword } from '@/utils/password'


defineOptions({ name: 'AddUser' })

// 表单label位置 top | left | right
const labelPosition = ref('left')

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('large')

// 表单实例
const addUserFormRef = ref<FormInstance>()

// 表单数据
const addUserForm = reactive<AddUserForm>({
    userName: 'jiaopengzi',
    email: 'jiaopengzi@qq.com',
    password: '123QWEasd',
})

// hook 函数
const {
    checkUserNameValidator,
    checkEmailValidator } = useFormValidation({
        FormUserName: addUserForm.userName,
        FormEmail: addUserForm.email,
        FormPassword: addUserForm.password
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
        { pattern: /^[a-z0-9]{6,20}$/, message: '用户名长度:6-20的小写字母或数字', trigger: 'change' },
        // 用户查重
        { validator: checkUserNameValidator, trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入小写的邮箱地址', trigger: 'blur' },
        {
            pattern: /^([a-z0-9._%+-]+)@[a-z0-9.-]+\.[a-z]{2,}$/,
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
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,64}$/,
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
    await formEl.validate(async (valid) => {
        if (valid) {
            // 创建请求对象 加密内容
            const req: AddUserRequest = {
                admin_user_id: "1",
                user_name: addUserForm.userName,
                password: addUserForm.password,
                email: addUserForm.email,
            }

            const { data } = await AddUserByJosn(req)

            if (data.code === ResponseCode.UserAddUserSuccess) {
                // 显示注册成功提示
                ShowMsgTip(ShowMsgTip.MsgType.success, data.msg, 6000)

            } else {
                // 注册失败
                // console.log("注册失败");
                ShowMsgTip(ShowMsgTip.MsgType.error, data.msg, 0)
            }
            console.log('submit!')
        }
    })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
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