<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 16:21:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 11:14:04
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\add\index.vue
 * @Description  : 添加标签 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <View
        :view-data="addForm"
        :is-show-id="false"
        btn-submit-display="新增"
        @submit-data="submitData"
    />
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import { MessageUtil } from "@/utils/message"
import { type InsertPostTagRequest, insertPostTagAPI } from "@/api/postTag/insert"
import { ResponseCode } from "@/api/response"
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

const submitData = async (form: ViewForm) => {
    const req: InsertPostTagRequest = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        thumbnail: form.thumbnail,
        order: form.order,
    }
    console.log("req:", req)
    const { data } = await insertPostTagAPI(req)

    if (data.code === ResponseCode.PostTagInsertSuccess) {
        // 添加成功提示
        emit("add-status", true)
        MessageUtil.success(data.msg, 6000)
    } else {
        // 添加失败提示
        MessageUtil.error(data.msg, 0)
    }
    console.log("submit!")
}
</script>
