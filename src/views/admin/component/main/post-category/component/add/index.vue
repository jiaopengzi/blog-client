<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\post-category\component\add\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 添加分类
-->

<template>
    <View :view-data="addForm" :is-show-id="false" :btn-loading="btnLoading" btn-submit-display="新增" @submit-data="submitData" />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"

import { insertPostCategoryAPI, type InsertPostCategoryRequest } from "@/api/postCategory/insert"
import { ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "AddCategory" })

const emit = defineEmits<{
    (event: "add-status", value: boolean): void // 添加状态
}>()

// 表单数据
const addForm = reactive<ViewForm>({
    name: "", // tag名称
    slug: "", // 别名
})

const btnLoading = ref(false)

const submitData = async (form: ViewForm) => {
    btnLoading.value = true
    // 创建请求对象 加密内容
    const req: InsertPostCategoryRequest = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        thumbnail: form.thumbnail,
        order: form.order ? form.order.toString() : "0",
        parent: form.parent ? form.parent.toString() : "0",
    }

    const { data } = await insertPostCategoryAPI(req)

    if (data.code === ResponseCode.PostCategoryInsertSuccess) {
        // 轮询后端是否完成
        await pollingGetStreamIDsStatus(data.data.items)
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
