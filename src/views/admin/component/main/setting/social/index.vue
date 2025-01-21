<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-15 15:42:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-21 16:06:49
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\social\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="components">
        <el-button class="component-item" type="primary" @click="submitForm">提交</el-button>
        <SocialLoginConfig ref="qqRef" class="component-item" :platform="SocialLoginType.QQ" :config="configQQ">
            <template #description>
                <div class="callback-description">
                    <p>申请地址：https://connect.qq.com</p>
                    <p>请将<span class="strong">登录回调域</span>和<span class="strong">绑定回调域</span>填写到 QQ 互联的应用管理的网站回调域中。</p>
                </div>
            </template>
        </SocialLoginConfig>
        <SocialLoginConfig ref="wechatRef" class="component-item" :platform="SocialLoginType.WeChat" :config="configWeChat">
            <template #description>
                <div class="callback-description">
                    <p>申请地址：https://open.weixin.qq.com/</p>
                </div>
            </template>
        </SocialLoginConfig>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, useTemplateRef } from "vue"

import { SocialLoginType } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { getSocialLoginAPI, type LoginConfig } from "@/api/setting/getSocialLogin"
import { updateSocialLoginAPI, type UpdateSocialLoginRequest } from "@/api/setting/updateSocialLogin"
import { MessageUtil } from "@/utils/message"

import SocialLoginConfig, { type SocialLoginConfigRef } from "./social-login-config"

defineOptions({ name: "SettingSocial" })

const configQQ = ref<LoginConfig>({} as LoginConfig)
const configWeChat = ref<LoginConfig>({} as LoginConfig)

// 表单实例
const qqRef = useTemplateRef<SocialLoginConfigRef>("qqRef")
const wechatRef = useTemplateRef<SocialLoginConfigRef>("wechatRef")

const submitForm = async () => {
    // 校验表单
    if (qqRef.value) {
        if (!(await qqRef.value.validateForm())) {
            return
        }
    }
    if (wechatRef.value) {
        if (!(await wechatRef.value.validateForm())) {
            return
        }
    }

    if (!qqRef.value || !wechatRef.value) {
        return
    }

    const req: UpdateSocialLoginRequest = {
        qq: qqRef.value.formDataResult,
        wechat: wechatRef.value.formDataResult,
    }

    const res = await updateSocialLoginAPI(req)

    if (res.data.code === ResponseCode.SocialLoginUpdateSuccess) {
        MessageUtil.success("更新成功")
    } else {
        MessageUtil.error(handleResErr(res), 10000)
    }
}

onBeforeMount(async () => {
    const res = await getSocialLoginAPI()
    if (res.data.code === ResponseCode.GetSocialLoginSuccess) {
        configQQ.value = res.data.data.qq
        configWeChat.value = res.data.data.wechat
    } else {
        handleResErr(res.data)
        MessageUtil.error(handleResErr(res), 10000)
    }
})
</script>

<style lang="scss" scoped>
.component-item {
    margin-bottom: 10px;
}

.btn-submit {
    text-align: center;
}

.callback-description {
    margin: 10px 0;
    color: var(--jpz-text-color-secondary);
    font-size: 14px;

    // 行间距
    p {
        margin: 10px 0;
    }

    .strong {
        color: var(--jpz-text-color-regular);
        font-weight: 700;
    }
}
</style>
