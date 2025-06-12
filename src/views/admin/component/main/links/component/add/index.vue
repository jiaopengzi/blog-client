<!--
 * FilePath    : blog-client\src\views\admin\component\main\links\component\add\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 添加链接
-->

<template>
    <View
        :view-data="addForm"
        :is-show-id="false"
        :is-admin="isAdmin"
        :btn-loading="btnLoading"
        :btn-submit-display="btnSubmitDisplay"
        @submit-data="submitData"
    />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"

import { type InsertLinkRequest, LinkStatusCode } from "@/api/link/common"
import { insertLinkAdminAPI, insertLinkAPI } from "@/api/link/insert"
import { ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "AddLink" })

// props
const { isAdmin = false } = defineProps<{
    isAdmin?: boolean // 是否是管理员添加链接
}>()

const emit = defineEmits<{
    (event: "add-status", value: boolean): void // 添加用户状态
}>()

// 表单数据
const addForm = reactive<ViewForm>({
    name: "", // 名称
    url: "", // 链接地址
    thumbnail: "", // 图片URL
    description: "", // 描述信息
    status: LinkStatusCode.Hidden, // 状态，默认不显示
})

const btnLoading = ref(false)

const insertAPI = isAdmin ? insertLinkAdminAPI : insertLinkAPI
const btnSubmitDisplay = isAdmin ? "新增" : "提交申请"

const submitData = async (form: ViewForm) => {
    btnLoading.value = true
    const req: InsertLinkRequest = {
        name: form.name,
        url: form.url,
        thumbnail: form.thumbnail,
        description: form.description,
        status: form.status,
        order: form.order ? form.order.toString() : "0",
    }

    const { data } = await insertAPI(req)

    if (data.code === ResponseCode.LinkInsertSuccess) {
        // 轮询后端是否完成
        await pollingGetStreamIDsStatus(data.data.stream_ids)
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
