<!--
 * @FilePath     : \blog-client\src\components\common\send-test-email\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 测试发送邮件组件
-->

<template>
    <div class="send-test-email" :style="widthStyle">
        <el-input class="send-test-email-item in" v-model="toEmail" :placeholder="inputPlaceholder" clearable />
        <el-button class="send-test-email-item btn" type="primary" @click="sendEmail" :loading="loading">{{ btnTextInner }}</el-button>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"

import type { SendTestEmailRequest } from "@/api/common"
import { handleResErr, type Res, ResponseCode, type ResPromise } from "@/api/response"
import { MessageUtil } from "@/utils/message"
import { RegexPatterns } from "@/utils/regexPatterns"

defineOptions({ name: "TestSendEmail" })

const { sendApi, successCode, width, btnText, placeholder } = defineProps<{
    sendApi: (requestData: SendTestEmailRequest) => ResPromise<Res<unknown>>
    successCode: ResponseCode
    width?: string | number
    btnText?: string
    placeholder?: string
}>()

const toEmail = ref("")
const loading = ref(false)
const btnTextTemp = ref("")

const widthStyle = computed(() => {
    // 判断是数字还是字符串
    return {
        width: typeof width === "number" ? `${width}px` : width || "100%",
    }
})

const btnTextInner = ref("发起测试")

watch(
    () => btnText,
    () => {
        if (btnText) {
            btnTextInner.value = btnText
        }
    },
)

const inputPlaceholder = computed(() => {
    return placeholder || "请输入接收邮箱账号"
})

const sendEmail = async () => {
    if (!toEmail.value) {
        MessageUtil.error("请输入接收邮箱账号")
        return
    }

    // 使用正则表达式验证邮箱格式
    if (!RegexPatterns.Email.test(toEmail.value)) {
        MessageUtil.error("请输入正确的邮箱地址")
        return
    }

    loading.value = true
    btnTextTemp.value = btnTextInner.value
    btnTextInner.value = "等待结果..."

    const res = await sendApi({
        email: toEmail.value,
    })

    if (res.data.code === successCode) {
        MessageUtil.success(res.data.msg)
    } else {
        MessageUtil.error(handleResErr(res))
    }

    loading.value = false
    btnTextInner.value = btnTextTemp.value
}
</script>

<style lang="scss" scoped>
.send-test-email {
    display: flex;
    justify-content: center;
    align-items: center;

    // btn 固定宽度
    .btn {
        margin-left: 10px;
        width: 100px;
    }

    // in 使用剩余宽度
    .in {
        flex: 1;
    }
}
</style>
