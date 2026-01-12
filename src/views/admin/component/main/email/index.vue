<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\email\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 邮箱配置页面
-->

<template>
    <div class="form-page">
        <el-button class="submit-btn" type="primary" @click="submitForm">保存</el-button>
        <el-form
            :label-position="labelPosition"
            label-width="150px"
            ref="formRef"
            :model="form"
            :rules="rules"
            class="form-content"
            :size="formSize"
            status-icon
        >
            <h2 class="title">邮件配置</h2>
            <el-form-item label="发件名称" prop="user_name">
                <el-input v-model="form.user_name" placeholder="请输入发件名称" clearable />
            </el-form-item>
            <el-form-item label="邮箱服务器" prop="host">
                <el-input v-model="form.host" placeholder="请输入邮箱服务器" clearable />
            </el-form-item>
            <el-form-item label="端口" prop="port">
                <el-input v-model="form.port" placeholder="请输入邮箱服务器发件端口" clearable />
            </el-form-item>
            <el-form-item label="邮箱账号" prop="from">
                <el-input v-model="form.from" placeholder="请输入发件邮箱账号" clearable />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password" placeholder="邮箱密码或授权码" show-password clearable />
            </el-form-item>
            <el-form-item label="连接池" prop="pool_size">
                <el-input-number class="input-number" v-model="form.pool_size" :min="1" :precision="0" placeholder="请输入连接池大小" />
            </el-form-item>
            <el-form-item label="单次最大发送数量" prop="max_send_count">
                <el-input-number class="input-number" v-model="form.max_send_count" :min="1" :precision="0" placeholder="请输入最大发送数量" />
            </el-form-item>
            <el-form-item label="发送间隔(秒)" prop="send_interval">
                <el-input-number class="input-number" v-model="form.send_interval" :min="1" :precision="0" placeholder="请输入发送间隔(秒)" />
            </el-form-item>
            <el-form-item label="测试邮件" v-if="isSendTestEmail">
                <SendTestEmail
                    :send-api="testEmailAPI"
                    :success-code="ResponseCode.EmailTestSendSuccess"
                    btn-text="测试连接"
                    placeholder="需要发送测试邮件，才填写接收测试邮件的邮箱，否则不填写。"
                />
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import type { FormInstance, FormRules } from "element-plus"
import { computed, onBeforeMount, reactive, ref, useTemplateRef } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import { getEmailAPI, type GetEmailResponse } from "@/api/setting/getEmail"
import { testEmailAPI } from "@/api/setting/testEmail"
import { updateEmailAPI, type UpdateEmailRequest } from "@/api/setting/updateEmail"
import SendTestEmail from "@/components/common/send-test-email"
import { useFormItemRule } from "@/components/hooks/useFormItemRule"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"
import { RegexPatterns } from "@/utils/regexPatterns"
import { adminMenuItemMap } from "@/views/admin/component/aside"

defineOptions({ name: RouteNames.SettingEmail })

useHead({
    title: adminMenuItemMap[RouteNames.SettingEmail].text,
})

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 表单实例
const formRef = useTemplateRef<FormInstance>("formRef")

// 表单数据
const form = ref<GetEmailResponse>({} as GetEmailResponse)
const isSendTestEmail = computed(() => form.value.from && form.value.password && form.value.host && form.value.port && form.value.user_name)

const rules = reactive<FormRules<GetEmailResponse>>({
    user_name: [{ required: true, message: "请输入发件名称", trigger: "blur" }],
    host: [{ required: true, message: "请输入正确的邮件服务器", trigger: "blur" }],
    port: [{ required: true, message: "请输入正确的端口号", trigger: "blur" }, useFormItemRule().portFormItemRule()],
    from: [
        { required: true, message: "请输入用户名或邮箱！", trigger: "blur" },
        {
            pattern: RegexPatterns.Email,
            message: "请输入正确的邮箱地址！",
            trigger: "change",
        },
    ],
    password: [{ required: true, message: "请输入密码！", trigger: "blur" }],
})

const submitForm = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (valid) {
            const req: UpdateEmailRequest = {
                user_name: form.value.user_name,
                host: form.value.host,
                port: Number(form.value.port),
                from: form.value.from,
                password: form.value.password,
                max_send_count: form.value.max_send_count,
                send_interval: form.value.send_interval,
                pool_size: form.value.pool_size,
            }

            const res = await updateEmailAPI(req)
            if (res.data.code === ResponseCode.EmailUpdateSuccess) {
                MessageUtil.success("更新成功！")
            } else if (res.data.code === ResponseCode.EmailNoUpdate) {
                MessageUtil.warning("未做任何更新！")
            } else {
                MessageUtil.error(handleResErr(res), 10000)
            }
        }
    })
}

onBeforeMount(async () => {
    const res = await getEmailAPI()
    if (res.data.code === ResponseCode.GetEmailSuccess) {
        form.value = res.data.data
    } else {
        handleResErr(res.data)
        MessageUtil.error(handleResErr(res), 10000)
    }
})
</script>

<style lang="scss" scoped>
.form-page {
    padding-top: 10px;
    // height: 100%;
    // width: 100%;
    background-color: var(--jpz-bg-color-page);
    padding-left: 10px;
}

.title {
    text-align: left;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--jpz-text-color-regular);
}

.form-content {
    width: 660px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 5px;
    padding: 20px;
    box-shadow: var(--jpz-box-shadow-light);
    background-color: var(--jpz-bg-color);
}

.submit-btn {
    margin-bottom: 10px;
}
.input-number {
    width: 100%;
}
</style>
