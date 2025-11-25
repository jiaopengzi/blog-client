<!--
 * FilePath    : blog-client\src\views\admin\component\main\notification\component\add\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 添加通知
-->

<template>
    <View :view-data="addForm" :is-show-id="false" :btn-loading="btnLoading" btn-submit-display="新增" @submit-data="submitData" />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"

import { NotificationCategory, NotificationFormat, NotificationPushStatus, NotificationStatus } from "@/api/notification/common"
import { type InsertNotificationRequest } from "@/api/notification/common"
import { insertNotificationAPI } from "@/api/notification/insert"
import { handleResErr, ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "AddNotification" })

const emit = defineEmits<{
    (event: "add-status", value: boolean): void // 添加用户状态
}>()

// 表单数据
const addForm = reactive<ViewForm>({
    subject: "",
    content: "",
    category: NotificationCategory.ScheduledTask,
    status: NotificationStatus.Disabled,
    format: NotificationFormat.HTML,
    push_time: {
        Time: new Date(),
        Valid: false,
    },
})

const btnLoading = ref(false)

const submitData = async (form: ViewForm) => {
    btnLoading.value = true
    const req: InsertNotificationRequest = {
        to_list: form.to_list, // 接收人列表
        exclude_to_list: form.exclude_to_list, // 排除接收人列表
        subject: form.subject, // 通知主题
        content: form.content, // 通知内容
        push_time: form.push_time, // 推送时间
        category: form.category, // 通知类别
        status: form.status, // 状态
        format: form.format, // 通知格式
    }

    // 如果是定时任务，则设置为未推送状态
    if (form.category === NotificationCategory.ScheduledTask) {
        req.push_status = NotificationPushStatus.NotPushed
    }

    // 如果推送时间存在且是有效的，则设置为有效
    if (form.push_time.Time && req.push_time) {
        req.push_time.Time = new Date(form.push_time.Time) // 将字符串时间转换为有效的日期对象
        req.push_time.Valid = true
    }

    // 如果推送时间不存在且有值，则设置为无效
    if (!form.push_time.Time && req.push_time) {
        req.push_time.Valid = false
    }

    const res = await insertNotificationAPI(req)

    if (res.data.code === ResponseCode.NotificationInsertSuccess) {
        // 保证有数据且包含 stream_items 字段才进行轮询
        if (res.data.data && res.data.data.stream_items) {
            await pollingGetStreamIDsStatus(res.data.data.stream_items)
        }
        btnLoading.value = false

        // 添加成功提示
        emit("add-status", true)
        MessageUtil.success(res.data.msg, 6000)
    } else {
        btnLoading.value = false
        // 添加失败提示
        MessageUtil.error(handleResErr(res), 6000)
    }
}
</script>
