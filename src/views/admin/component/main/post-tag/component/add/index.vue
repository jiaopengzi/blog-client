<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\add\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 添加标签 
-->

<template>
    <View :view-data="addForm" :is-show-id="false" :btn-loading="btnLoading" btn-submit-display="新增" @submit-data="submitData" />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"

import { insertPostTagAPI, type InsertPostTagRequest } from "@/api/postTag/insert"
import { ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "AddTag" })

const emit = defineEmits<{
    (event: "add-status", value: boolean): void // 添加用户状态
}>()

// 表单数据
const addForm = reactive<ViewForm>({
    name: "", // tag名称
    slug: "", // 别名
})

const btnLoading = ref(false)

const submitData = async (form: ViewForm) => {
    btnLoading.value = true
    const req: InsertPostTagRequest = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        thumbnail: form.thumbnail,
        order: form.order ? form.order.toString() : "0",
    }
    const { data } = await insertPostTagAPI(req)

    if (data.code === ResponseCode.PostTagInsertSuccess) {
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
