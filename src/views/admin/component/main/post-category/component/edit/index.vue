<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:47:08
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-09 15:24:59
 * @FilePath     : \blog-client\src\views\admin\component\main\post-category\component\edit\index.vue
 * @Description  : 编辑分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="edit-page">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="editFormRef"
            :model="editForm"
            :rules="rules"
            class="edit-form"
            :size="formSize"
            status-icon
        >
            <el-form-item label="ID" prop="id">
                <el-input v-model.trim="editForm.id" disabled />
            </el-form-item>
            <el-form-item label="分类" prop="name">
                <el-input v-model.trim="editForm.name" placeholder="请输入分类名称-必填" />
            </el-form-item>

            <el-form-item label="别名" prop="slug">
                <el-input v-model.trim="editForm.slug" placeholder="请输入分类别名-必填" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input
                    v-model.trim="editForm.description"
                    type="textarea"
                    placeholder="请输入分类描信息-选填"
                    :rows="5"
                />
            </el-form-item>
            <el-form-item label="图片" prop="thumbnail">
                <el-input
                    v-model.trim="editForm.thumbnail"
                    placeholder="请输入分类的图片URL-选填"
                />
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input
                    v-model="editForm.order"
                    type="number"
                    placeholder="请输入分类排序数字-选填"
                    min="0"
                />
            </el-form-item>
            <el-form-item label="父分类" prop="parent">
                <el-input
                    v-model="editForm.parent"
                    type="number"
                    placeholder="请输入父分类数字-选填"
                    min="0"
                />
            </el-form-item>

            <div class="btn-submit">
                <el-form-item>
                    <el-button type="primary" @click="submitForm(editFormRef as FormInstance)"
                        >更新</el-button
                    >
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, onBeforeMount, watch, useTemplateRef } from "vue"
import { ShowMsgTip } from "@/utils/message"
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { type UpdatePostCategoryRequest, updatePostCategoryAPI } from "@/api/postCategory/update"
import { ResponseCode } from "@/api/responseCode"
import type { EditForm } from "./index"
import { useFormValidation } from "../hooks"

defineOptions({ name: "EditCategory" })

const emit = defineEmits<{
    (event: "edit-status", value: boolean): void // 编辑用户状态
}>()

// props
const props = defineProps<{
    editData: EditForm // 需要编辑的用户ID
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("large")

// 表单实例
const editFormRef = useTemplateRef<FormInstance>("editFormRef")

// 表单数据
const editForm = reactive<EditForm>({
    id: "",
    name: "",
    slug: "", // 别名
    description: "", // 描述
    thumbnail: "", // 缩略图
    order: "", // 排序
    parent: "", // 父分类
})

const updateEditForm = (data: EditForm) => {
    editForm.id = data.id
    editForm.name = data.name
    editForm.slug = data.slug
    editForm.description = data.description
    editForm.thumbnail = data.thumbnail
    editForm.order = data.order
    editForm.parent = data.parent
}

// hooks
const { checkCategorySlugExcludingIDValidator, checkCategoryNameExcludingIDValidator } =
    useFormValidation({
        form: toRefs(editForm),
    })

/**
 * @description: 表单校验规则
 * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<EditForm>>({
    id: [{ required: true, message: "id 不能为空", trigger: "blur" }],
    name: [
        { required: true, message: "请输入分类名称", trigger: "blur" },
        { validator: checkCategoryNameExcludingIDValidator, trigger: "blur" },
    ],
    slug: [
        { required: true, message: "请输入别名", trigger: "blur" },
        { validator: checkCategorySlugExcludingIDValidator, trigger: "blur" },
    ],
    description: [{ message: "请输入分类描述信息", trigger: "blur" }],
    thumbnail: [{ message: "请输入分类的图片URL", trigger: "blur" }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    try {
        await formEl.validate(async (valid) => {
            if (valid) {
                const req: UpdatePostCategoryRequest = {
                    id: editForm.id.toString(),
                    name: editForm.name,
                    slug: editForm.slug,
                    description: editForm.description,
                    thumbnail: editForm.thumbnail,
                    order: editForm.order,
                    parent: editForm.parent,
                }
                const { data } = await updatePostCategoryAPI(req)

                if (data.code === ResponseCode.PostCategoryUpdateSuccess) {
                    // 添加成功提示
                    emit("edit-status", true)
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

// 监控 props.editData 变化 更新页面数据
watch(
    () => props.editData,
    (newVal) => {
        updateEditForm(newVal) // 更新表单数据
    },
    { deep: true }, // 深度观察 { deep: true } 选项
)

onBeforeMount(() => {
    updateEditForm(props.editData)
})
</script>

<style lang="scss" scoped>
.edit-page {
    display: flex;
    align-items: center;
}

.edit-form {
    width: 400px;
}

.edit-avatar-div {
    // border-top: 2px solid #ebebeb;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.edit-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 30px 10px 0;
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
