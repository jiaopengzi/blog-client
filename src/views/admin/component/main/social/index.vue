<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\social\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 社交登录配置 
-->

<template>
    <div class="components">
        <el-button class="component-item" type="primary" @click="submitForm">保存</el-button>
        <SocialLoginConfig ref="qqRef" class="component-item" :platform="SocialLoginType.QQ" :config="configQQ">
            <template #description>
                <div class="callback-description">
                    <p>申请地址：https://connect.qq.com</p>
                    <p>请将<span class="strong"> 登录回调域 </span>和<span class="strong"> 绑定回调域 </span>填写到 QQ 互联的应用管理的网站回调域中。</p>
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
    <RestartDialog :is-show-timer="isShowTimer" :wait-seconds="waitSeconds" />
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { onBeforeMount, ref, useTemplateRef } from "vue"

import { SocialLoginType } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { getSocialLoginAPI, type LoginConfig } from "@/api/setting/getSocialLogin"
import { updateSocialLoginAPI, type UpdateSocialLoginRequest } from "@/api/setting/updateSocialLogin"
import RestartDialog from "@/components/common/restart-dialog"
import { useRestart } from "@/components/hooks/useRestart"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import SocialLoginConfig, { type SocialLoginConfigRef } from "./social-login-config"

defineOptions({ name: RouteNames.SettingSocial })

useHead({
    title: adminMenuItemMap[RouteNames.SettingSocial].display,
})

const configQQ = ref<LoginConfig>({} as LoginConfig)
const configWeChat = ref<LoginConfig>({} as LoginConfig)

// 表单实例
const qqRef = useTemplateRef<SocialLoginConfigRef>("qqRef")
const wechatRef = useTemplateRef<SocialLoginConfigRef>("wechatRef")

// hooks
const { showRestart, waitSeconds, isShowTimer } = useRestart()

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
        await showRestart()
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
.components {
    padding-top: 10px;
    padding-left: 10px;
}

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
