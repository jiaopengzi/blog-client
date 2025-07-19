<!--
 * FilePath    : blog-client\src\views\admin\component\main\pay-config\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 支付配置
-->

<template>
    <RestartDialog :is-show-timer="isShowTimer" :wait-seconds="waitSeconds" />
    <div class="components">
        <el-button class="head" type="primary" @click="submitForm">保存</el-button>
        <BaseForm
            class="pay-form"
            ref="wechatPayFormRef"
            title="微信支付配置"
            :form-data="wechatPayData"
            :rules="wechatRules"
            :form-items="wechatPayFormItems"
            :label-width="200"
            :form-width="800"
        />
        <BaseForm
            class="pay-form"
            ref="alipayFormRef"
            title="支付宝配置"
            :form-data="alipayData"
            :rules="alipayRules"
            :form-items="alipayFormItems"
            :label-width="200"
            :form-width="800"
        />
        <el-button class="foot" type="primary" @click="submitForm">保存</el-button>
    </div>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import type { FormRules } from "element-plus"
import { computed, type ComputedRef, onBeforeMount, ref, useTemplateRef } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import { type AliPayConf, getPayConfigAPI, type GetPayConfigResponse, type WeChatPayConf } from "@/api/setting/getPayConfig"
import { updatePayConfigAPI, type UpdatePayConfigRequest } from "@/api/setting/updatePayConfig"
import RestartDialog from "@/components/common/restart-dialog"
import { useRestart } from "@/components/hooks/useRestart"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import BaseForm, { type FormRef } from "./base"

defineOptions({ name: RouteNames.PayConfig })

useHead({
    title: adminMenuItemMap[RouteNames.PayConfig].text,
})

const wechatPayFormRef = useTemplateRef<FormRef>("wechatPayFormRef")
const alipayFormRef = useTemplateRef<FormRef>("alipayFormRef")

const wechatPayData = ref<WeChatPayConf>({} as WeChatPayConf)
const alipayData = ref<AliPayConf>({} as AliPayConf)

// 微信支付表单项
const wechatPayFormItems = [
    { label: "启用微信支付", prop: "enabled", isCheckbox: true },
    { label: "商户号", prop: "mch_id", type: "text", placeholder: "请输入商户号" },
    { label: "商户证书序列号", prop: "mch_certificate_serial_number", type: "text", placeholder: "请输入商户证书序列号" },
    { label: "商户私钥", prop: "mch_private_key", type: "textarea", placeholder: "请输入商户私钥" },
    { label: "AppID", prop: "app_id", type: "text", placeholder: "请输入应用ID" },
    { label: "APIv3密钥", prop: "api_v3_key", type: "password", placeholder: "请输入APIv3密钥" },
    { label: "支付通知主机", prop: "notify_host", type: "text", placeholder: "请输支付通知主机地址，包含协议端口，末尾不包含 /" },
    {
        label: "支付结果通知地址",
        prop: "notify_path",
        type: "text",
        placeholder: "请输入支付结果通知路由",
        description: "用于接收微信支付结果的通知，原则上保持默认值，如果需要修改，前提是你知道你在做什么。",
    },
    {
        label: "退款结果通知地址",
        prop: "refund_path",
        type: "text",
        placeholder: "请输入退款结果通知路由",
        description: "用于接收微信退款结果的通知，原则上保持默认值，如果需要修改，前提是你知道你在做什么。",
    },
]

// 支付宝表单项
const alipayFormItems = [
    { label: "启用支付宝支付", prop: "enabled", isCheckbox: true },
    { label: "AppID", prop: "app_id", type: "text", placeholder: "请输入AppID" },
    { label: "商户ID", prop: "seller_id", type: "text", placeholder: "请输入商户ID" },
    { label: "商户私钥", prop: "app_private_key", type: "textarea", placeholder: "请输入商户私钥" },
    { label: "支付宝公钥", prop: "alipay_public_key", type: "textarea", placeholder: "请输入支付宝公钥" },
    { label: "接口内容加密密钥", prop: "encrypt_key", type: "text", placeholder: "请输入接口内容加密密钥" },
    { label: "支付通知主机", prop: "notify_host", type: "text", placeholder: "请输支付通知主机地址，包含协议端口，末尾不包含 /" },
    {
        label: "支付结果通知地址",
        prop: "notify_path",
        type: "text",
        placeholder: "请输入支付结果通知路由",
        description: "用于接收支付宝支付结果的通知，原则上保持默认值，如果需要修改，前提是你知道你在做什么。",
    },
    {
        label: "退款结果通知地址",
        prop: "refund_path",
        type: "text",
        placeholder: "请输入退款结果通知路由",
        description: "用于接收支付宝退款结果的通知，原则上保持默认值，如果需要修改，前提是你知道你在做什么。",
    },
    { label: "是否为生产环境", prop: "is_production", isCheckbox: true, description: "未勾选生产环境则为沙箱测试模式" },
]

// 表单验证规则（根据 enabled 状态动态设置必填项）

// 动态生成微信支付规则
const wechatRules: ComputedRef<FormRules> = computed(() => {
    if (!wechatPayFormRef.value) {
        return {}
    }
    const enabled = wechatPayFormRef.value.formDataResult.enabled
    return {
        mch_id: [{ required: !!enabled, message: "请输入商户号", trigger: "change" }],
        mch_certificate_serial_number: [{ required: !!enabled, message: "请输入商户证书序列号", trigger: "change" }],
        mch_private_key: [{ required: !!enabled, message: "请输入商户私钥", trigger: "change" }],
        app_id: [{ required: !!enabled, message: "请输入应用ID", trigger: "change" }],
        api_v3_key: [{ required: !!enabled, message: "请输入APIv3密钥", trigger: "change" }],
        notify_host: [
            { required: !!enabled, message: "请输入通知回调主机地址", trigger: "change" },
            {
                validator: (rule, value, callback) => {
                    // 结尾不能有斜杠
                    if (value.endsWith("/")) {
                        callback(new Error("通知回调主机不能以斜杠 '/' 结尾"))
                    } else {
                        callback()
                    }
                },
                trigger: "blur",
            },
        ],
        notify_path: [{ required: !!enabled, message: "请输入支付结果通知路由", trigger: "change" }],
        refund_path: [{ required: !!enabled, message: "请输入退款结果通知路由", trigger: "change" }],
    }
})

// 动态生成支付宝规则
const alipayRules: ComputedRef<FormRules> = computed(() => {
    if (!alipayFormRef.value) {
        return {}
    }
    const enabled = alipayFormRef.value.formDataResult.enabled
    return {
        app_id: [{ required: !!enabled, message: "请输入AppID", trigger: "change" }],
        seller_id: [{ required: !!enabled, message: "请输入商户ID", trigger: "change" }],
        app_private_key: [{ required: !!enabled, message: "请输入商户私钥", trigger: "change" }],
        alipay_public_key: [{ required: !!enabled, message: "请输入支付宝公钥", trigger: "change" }],
        encrypt_key: [{ required: false, message: "选填，接口内容加密密钥", trigger: "change" }],
        notify_host: [
            { required: !!enabled, message: "请输入通知回调主机地址", trigger: "change" },
            {
                validator: (rule, value, callback) => {
                    // 结尾不能有斜杠
                    if (value.endsWith("/")) {
                        callback(new Error("通知回调主机不能以斜杠 '/' 结尾"))
                    } else {
                        callback()
                    }
                },
                trigger: "blur",
            },
        ],
        notify_path: [{ required: !!enabled, message: "请输入支付结果通知路由", trigger: "change" }],
        refund_path: [{ required: !!enabled, message: "请输入退款结果通知路由", trigger: "change" }],
        is_production: [{ required: false, message: "是否为生产环境", trigger: "change" }],
    }
})

// hooks
const { showRestart, waitSeconds, isShowTimer } = useRestart()

// 提交表单
const submitForm = async () => {
    if (!wechatPayFormRef.value || !alipayFormRef.value) {
        return
    }

    // 校验表单
    if (!(await wechatPayFormRef.value.validateForm())) {
        return
    }
    if (!(await alipayFormRef.value.validateForm())) {
        return
    }

    // 构造请求数据
    const req: UpdatePayConfigRequest = {
        wechat_pay: wechatPayFormRef.value.formDataResult as WeChatPayConf,
        alipay: alipayFormRef.value.formDataResult as AliPayConf,
    }

    const res = await updatePayConfigAPI(req)
    if (res.data.code === ResponseCode.PayConfigUpdateSuccess) {
        MessageUtil.success("更新成功，等待重启服务")
        await showRestart() // 显示重启提示
    } else if (res.data.code === ResponseCode.PayConfigNoUpdate) {
        MessageUtil.warning("当前支付配置未修改，无需更新")
    } else {
        MessageUtil.error(handleResErr(res), 10000)
    }
}

onBeforeMount(async () => {
    // 获取支付配置
    const res = await getPayConfigAPI()
    if (res.data.code === ResponseCode.GetPayConfigSuccess) {
        const data = res.data.data as GetPayConfigResponse
        wechatPayData.value = data.wechat_pay as WeChatPayConf
        alipayData.value = data.alipay as AliPayConf
    } else {
        MessageUtil.error(handleResErr(res), 10000)
    }
})
</script>

<style lang="scss" scoped>
.components {
    padding-top: 10px;
    padding-left: 10px;
}

.head {
    margin-bottom: 10px;
}

.pay-form {
    margin-bottom: 10px;
}

.foot {
    margin: 10px 0;
}

.btn-submit {
    text-align: center;
}
</style>
