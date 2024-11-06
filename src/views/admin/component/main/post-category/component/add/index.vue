<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:47:08
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-06 15:22:34
 * @FilePath     : \blog-client\src\views\admin\component\main\post-category\component\add\index.vue
 * @Description  : 添加分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="add-page">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="addFormRef"
            :model="addForm"
            :rules="rules"
            class="add-form"
            :size="formSize"
            status-icon
        >
            <el-form-item label="分类" prop="name">
                <el-input v-model="addForm.name" placeholder="请输入分类名称-必填" />
            </el-form-item>

            <el-form-item label="别名" prop="slug">
                <el-input v-model.trim="addForm.slug" placeholder="请输入分类别名-必填" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input
                    v-model.trim="addForm.description"
                    type="textarea"
                    placeholder="请输入分类描信息-选填"
                    :rows="5"
                />
            </el-form-item>
            <el-form-item label="图片" prop="thumbnail">
                <el-input v-model.trim="addForm.thumbnail" placeholder="请输入分类的图片URL-选填" />
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input
                    v-model="addForm.order"
                    type="number"
                    placeholder="请输入分类排序数字-选填"
                    min="0"
                />
            </el-form-item>
            <el-form-item label="父分类" prop="parent">
                <el-input
                    v-model="addForm.parent"
                    type="number"
                    placeholder="请输入父分类数字-选填"
                    min="0"
                />
            </el-form-item>

            <div class="btn-submit">
                <el-form-item>
                    <el-button type="primary" @click="submitForm(addFormRef as FormInstance)"
                        >新增分类</el-button
                    >
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, useTemplateRef, toRefs } from "vue"
import { ShowMsgTip } from "@/utils/message"
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { type InsertCategoryRequest, insertCategoryAPI } from "@/api/category/insert"
import { ResponseCode } from "@/api/responseCode"
import type { AddForm } from "./index"
import { useFormValidation } from "../hooks"

defineOptions({ name: "AddCategory" })

const emit = defineEmits<{
    (event: "add-status", value: boolean): void // 添加用户状态
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("large")

// 表单实例
const addFormRef = useTemplateRef<FormInstance>("addFormRef")

// 表单数据
const addForm = reactive<AddForm>({
    name: "", // tag名称
    slug: "", // 别名
})

// hooks
const { checkCategorySlugValidator, checkCategoryNameValidator } = useFormValidation({
    form: toRefs(addForm),
})

/**
 * @description: 表单校验规则
 * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<AddForm>>({
    name: [
        { required: true, message: "请输入分类名称", trigger: "blur" },
        { validator: checkCategoryNameValidator, trigger: "blur" },
    ],
    slug: [
        { required: true, message: "请输入别名", trigger: "blur" },
        { validator: checkCategorySlugValidator, trigger: "blur" },
    ],
    description: [{ message: "请输入分类描述信息", trigger: "blur" }],
    thumbnail: [{ message: "请输入分类的图片URL", trigger: "blur" }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    try {
        await formEl.validate(async (valid) => {
            if (valid) {
                // 创建请求对象 加密内容
                const req: InsertCategoryRequest = {
                    name: addForm.name,
                    slug: addForm.slug,
                    description: addForm.description,
                    thumbnail: addForm.thumbnail,
                    order: Number(addForm.order),
                    parent: Number(addForm.parent),
                }
                console.log("req:", req)
                const { data } = await insertCategoryAPI(req)

                if (data.code === ResponseCode.CategoryInsertSuccess) {
                    // 添加成功提示
                    emit("add-status", true)
                    ShowMsgTip(ShowMsgTip.MsgType.success, data.msg, 6000)
                } else {
                    // 添加失败提示
                    ShowMsgTip(ShowMsgTip.MsgType.error, data.msg, 0)
                }
                console.log("submit!")
            }
        })
    } catch (error) {
        return
    }
}
</script>

<style lang="scss" scoped>
.add-page {
    display: flex;
    align-items: center;
}

.add-form {
    width: 400px;
}

.generate-password {
    flex: 5;
}

.btn-generate-password {
    flex: 2;
}

.btn-generate-password {
    width: 120px;
    margin-left: 10px;
    padding: 0 10px;
    height: 40px;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    color: #333;
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}
</style>
