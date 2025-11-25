<!--
 * FilePath    : blog-client\src\views\admin\component\main\account-key-all\component\add\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 添加账号密钥
-->

<template>
    <View :view-data="addForm" :is-show-id="false" :btn-loading="btnLoading" btn-submit-display="新增" @submit-data="submitData" />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"

import { type InsertAccountKeyRequest } from "@/api/accountKey/common"
import { insertAccountKeyAPI } from "@/api/accountKey/insert"
import { nullPgSqlDateTime } from "@/api/common"
import { ResponseCode } from "@/api/response"
import { yuanToFen } from "@/utils/amount"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"
import { formatTime } from "../view/hooks"

defineOptions({ name: "AddAccountKey" })

const emit = defineEmits<{
    (event: "add-status", value: boolean): void // 添加用户状态
}>()

// 表单数据
const addForm = reactive<ViewForm>({
    purchase_min: 1,
    purchase_start: nullPgSqlDateTime(), // 开始购买时间
    purchase_end: nullPgSqlDateTime(), // 结束购买时间
})

const btnLoading = ref(false)

const submitData = async (form: ViewForm) => {
    btnLoading.value = true
    // 将 itemStr 转为数组
    const items = form.itemStr ? form.itemStr.split("\n").filter((item) => item.trim() !== "") : []

    // 格式化时间
    form = formatTime(form)

    const req: InsertAccountKeyRequest = {
        title: form.title,
        description: form.description,
        price: yuanToFen(form.price?.toString() || "0", true) as string, // 转为分
        purchase_min: form.purchase_min,
        purchase_max: form.purchase_max,
        user_max: form.user_max,
        purchase_start: form.purchase_start,
        purchase_end: form.purchase_end,
        // pay_roles: form.pay_roles,
        items: items,
    }

    const { data } = await insertAccountKeyAPI(req)

    if (data.code === ResponseCode.AccountKeyInsertSuccess) {
        // 保证有数据且包含 stream_items 字段才进行轮询
        if (data.data && data.data.stream_items) {
            await pollingGetStreamIDsStatus(data.data.stream_items)
        }

        btnLoading.value = false

        // 添加成功提示
        emit("add-status", true)
        MessageUtil.success(data.msg, 6000)
    } else {
        btnLoading.value = false
        // 添加失败提示
        MessageUtil.error(data.msg, 0)
    }
}
</script>
