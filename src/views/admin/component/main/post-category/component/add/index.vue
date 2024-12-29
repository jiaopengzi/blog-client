<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:47:08
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 10:47:56
 * @FilePath     : \blog-client\src\views\admin\component\main\post-category\component\add\index.vue
 * @Description  : 添加分类
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
import { type InsertPostCategoryRequest, insertPostCategoryAPI } from "@/api/postCategory/insert"
import { ResponseCode } from "@/api/response"
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

const submitData = async (form: ViewForm) => {
    // 创建请求对象 加密内容
    const req: InsertPostCategoryRequest = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        thumbnail: form.thumbnail,
        order: form.order,
        parent: form.parent,
    }

    const { data } = await insertPostCategoryAPI(req)

    if (data.code === ResponseCode.PostCategoryInsertSuccess) {
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
