<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 10:04:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-12 17:36:38
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 写文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <el-form
        ref="formRef"
        class="post-info"
        label-position="top"
        label-width="200px"
        :model="postInfoForm"
        :rules="rules"
        :scroll-to-error="true"
    >
        <el-form-item label="标题1" prop="test1">
            <el-input v-model="postInfoForm.test1" placeholder="添加标题1" />
        </el-form-item>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <div>我是中间很多的内容</div>
        <el-form-item label="标题2" prop="test1">
            <el-input v-model="postInfoForm.test2" placeholder="添加标题2" />
        </el-form-item>
        <el-form-item label="标题3" prop="test1">
            <el-input v-model="postInfoForm.test3" placeholder="添加标题3" />
        </el-form-item>
        <el-form-item label="标题4" prop="test1">
            <el-input v-model="postInfoForm.test4" placeholder="添加标题4" />
        </el-form-item>
        <el-form-item label="标题5" prop="test1">
            <el-input v-model="postInfoForm.test5" placeholder="添加标题5" />
        </el-form-item>
        <el-form-item label="标题6" prop="test1">
            <el-input v-model="postInfoForm.test6" placeholder="添加标题6" />
        </el-form-item>
        <el-form-item label="标题7" prop="test1">
            <el-input v-model="postInfoForm.test7" placeholder="添加标题7" />
        </el-form-item>
        <el-form-item label="标题8" prop="test1">
            <el-input v-model="postInfoForm.test8" placeholder="添加标题8" />
        </el-form-item>

        <el-button type="primary" @click="submitForm(formRef as FormInstance)">提交</el-button>
    </el-form>
</template>
<script lang="ts" setup>
import { reactive, useTemplateRef } from "vue"

import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S

interface PostInfoForm {
    test1: string
    test2: string
    test3: string
    test4: string
    test5: string
    test6: string
    test7: string
    test8: string
}

const formRef = useTemplateRef<FormInstance>("formRef")

const postInfoForm = reactive<PostInfoForm>({
    test1: "",
    test2: "",
    test3: "",
    test4: "",
    test5: "",
    test6: "",
    test7: "",
    test8: "",
})

/**
 * @description: 表单校验规则
 * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<PostInfoForm>>({
    test1: [
        { required: true, message: "标题不能为空", trigger: "blur" },
        { min: 1, max: 100, message: "标题长度在 1 到 100 个字符", trigger: "blur" },
    ],
    test2: [
        { required: true, message: "标题不能为空", trigger: "blur" },
        { min: 1, max: 100, message: "标题长度在 1 到 100 个字符", trigger: "blur" },
    ],
    test3: [
        { required: true, message: "标题不能为空", trigger: "blur" },
        { min: 1, max: 100, message: "标题长度在 1 到 100 个字符", trigger: "blur" },
    ],
    test4: [
        { required: true, message: "标题不能为空", trigger: "blur" },
        { min: 1, max: 100, message: "标题长度在 1 到 100 个字符", trigger: "blur" },
    ],
    test5: [
        { required: true, message: "标题不能为空", trigger: "blur" },
        { min: 1, max: 100, message: "标题长度在 1 到 100 个字符", trigger: "blur" },
    ],
    test6: [
        { required: true, message: "标题不能为空", trigger: "blur" },
        { min: 1, max: 100, message: "标题长度在 1 到 100 个字符", trigger: "blur" },
    ],
    test7: [
        { required: true, message: "标题不能为空", trigger: "blur" },
        { min: 1, max: 100, message: "标题长度在 1 到 100 个字符", trigger: "blur" },
    ],
    test8: [
        { required: true, message: "标题不能为空", trigger: "blur" },
        { min: 1, max: 100, message: "标题长度在 1 到 100 个字符", trigger: "blur" },
    ],
})

const submitForm = async (formEl: FormInstance | null) => {
    if (!formEl) {
        return
    }

    try {
        await formEl.validate((valid, fields) => {
            if (valid) {
                console.log("校验成功")
            } else {
                console.log("校验失败", fields)
            }
        })
    } catch (error) {
        console.error("submitForm error", error)
        return
    }
}
</script>
