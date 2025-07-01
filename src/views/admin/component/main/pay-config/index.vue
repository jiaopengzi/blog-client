<!--
 * FilePath    : blog-client\src\views\admin\component\main\app-option\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 网站选项
-->

<template>
    <div class="components">
        <el-button class="head" type="primary" @click="submitForm">保存</el-button>
        <BaseForm
            class="pay-form"
            ref="wechatPayFormRef"
            title="微信支付配置"
            :form-data="wechatPayData"
            :rules="rules"
            :form-items="wechatPayFormItems"
            :label-width="200"
            :form-width="800"
        />
        <BaseForm
            class="pay-form"
            ref="alipayFormRef"
            title="支付宝配置"
            :form-data="alipayData"
            :rules="rules"
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
import { storeToRefs } from "pinia"
import { reactive, useTemplateRef } from "vue"

import { OptionType } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { type UpdateAPPOption, updateAPPOptionAPI, type UpdateAPPOptionRequest } from "@/api/setting/updateAPPOption"
import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options" // 网站配置选项
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import BaseForm, { type FormRef, type FormView, type KeyofFormView } from "./base"

defineOptions({ name: RouteNames.PayConfig })

useHead({
    title: adminMenuItemMap[RouteNames.PayConfig].text,
})

// 获取网站配置选项
const optionsStore = useOptionsStore()

const wechatPayFormRef = useTemplateRef<FormRef>("wechatPayFormRef")
const alipayFormRef = useTemplateRef<FormRef>("alipayFormRef")

const { wechatPayData, alipayData } = storeToRefs(optionsStore)

const wechatPayFormItems = [
    { label: "商户号", prop: "mch_id", type: "text", placeholder: "请输入商户号" },
    { label: "商户证书序列号", prop: "mch_certificate_serial_number", type: "text", placeholder: "请输入商户证书序列号" },
    { label: "商户私钥", prop: "mch_private_key", type: "textarea", placeholder: "请输入商户私钥" },
    { label: "应用ID", prop: "app_id", type: "text", placeholder: "请输入应用ID" },
    { label: "APIv3密钥", prop: "api_v3_key", type: "text", placeholder: "请输入APIv3密钥" },
    { label: "支付结果通知地址", prop: "notify_url", type: "text", placeholder: "请输入支付结果通知地址" },
    { label: "退款结果通知地址", prop: "refund_notify_url", type: "text", placeholder: "请输入退款结果通知地址" },
    { label: "启用微信支付", prop: "enabled", isCheckbox: true },
]

const alipayFormItems = [
    { label: "支付宝应用ID", prop: "app_id", type: "text", placeholder: "请输入支付宝应用ID" },
    { label: "支付宝商户ID", prop: "pid", type: "text", placeholder: "请输入支付宝商户ID" },
    { label: "支付宝商户私钥", prop: "private_key", type: "textarea", placeholder: "请输入支付宝商户私钥" },
    { label: "支付宝公钥", prop: "public_key", type: "textarea", placeholder: "请输入支付宝公钥" },
    { label: "支付结果通知地址", prop: "notify_url", type: "text", placeholder: "请输入支付结果通知地址" },
    { label: "退款结果通知地址", prop: "refund_url", type: "text", placeholder: "请输入退款结果通知地址" },
    { label: "启用支付宝支付", prop: "enabled", isCheckbox: true },
]

const submitForm = async () => {
    // 校验表单
    if (wechatPayFormRef.value) {
        if (!(await wechatPayFormRef.value.validateForm())) {
            return
        }
    }
    // 校验表单
    if (alipayFormRef.value) {
        if (!(await alipayFormRef.value.validateForm())) {
            return
        }
    }
    const reqList: UpdateAPPOption[] = []
    const wechatPayDataTar = JSON.stringify(wechatPayFormRef.value?.formDataResult)
    const aliPayDataTar = JSON.stringify(alipayFormRef.value?.formDataResult)

    reqList.push({
        key: "pay_wechat_config",
        value: wechatPayDataTar ? wechatPayDataTar.toString() : "",
        type: OptionType.JSON,
    })
    reqList.push({
        key: "pay_alipay_config",
        value: aliPayDataTar ? aliPayDataTar.toString() : "",
        type: OptionType.JSON,
    })

    const req = { options: reqList } as UpdateAPPOptionRequest
    const res = await updateAPPOptionAPI(req)
    if (res.data.code === ResponseCode.UpdateAPPOptionSuccess) {
        optionsStore.update(true) // 强制刷新
        MessageUtil.success("更新成功")
    } else {
        MessageUtil.error(handleResErr(res), 10000)
    }
}

const rules = reactive<FormRules<FormView>>({})
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
