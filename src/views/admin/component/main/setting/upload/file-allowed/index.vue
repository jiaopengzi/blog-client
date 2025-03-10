<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\upload\file-allowed\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 文件限制表单组件 
-->

<template>
    <div class="form-page">
        <el-form :label-position="labelPosition" ref="formRef" :model="formData" :rules="rules" class="form-content" :size="formSize" status-icon>
            <h2 class="title">文件上传限制</h2>
            <el-form-item v-for="(fItem, index) in formData" :key="index" class="form-row">
                <el-form-item label="类型" :prop="`[${index}].type`" :rules="rules.type">
                    <el-input v-model="fItem.type" placeholder="文件类型" clearable class="form-cell" />
                </el-form-item>
                <el-form-item label="拓展名" :prop="`[${index}].extension`" :rules="rules.extension" class="form-cell">
                    <el-input v-model="fItem.extension" placeholder="文件拓展名" clearable />
                </el-form-item>
                <el-form-item label="文件大小(Byte)" :prop="`[${index}].max_size`" :rules="rules.max_size" class="form-cell">
                    <el-input v-model="fItem.max_size" placeholder="文件大小(Byte)" clearable />
                </el-form-item>
                <el-form-item label="后端处理" :prop="`[${index}].is_server_process`" class="form-cell">
                    <el-checkbox v-model="fItem.is_server_process" />
                </el-form-item>
                <el-form-item label="视频 FFmpeg 处理" :prop="`[${index}].is_ffmpeg_process`" class="form-cell">
                    <el-checkbox v-model="fItem.is_ffmpeg_process" />
                </el-form-item>
                <el-button type="danger" @click="removeRule(index)" size="small" class="form-cell">删除</el-button>
            </el-form-item>
            <el-button type="primary" @click="addRule" size="small" class="form-row-add">增加</el-button>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { computed, reactive, ref, useTemplateRef, watch } from "vue"

import { type FileAllowed } from "@/api/setting/getUpload"
import { MessageUtil } from "@/utils/message"

defineOptions({ name: "SocialLoginConfig" })

const { data } = defineProps<{
    data: FileAllowed[]
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 表单实例
const formRef = useTemplateRef<FormInstance>("formRef")

// 表单数据
const formData = ref<FileAllowed[]>(data)

// 添加规则
const addRule = () => {
    formData.value.push({
        type: "",
        extension: "",
        max_size: 1,
        is_server_process: false,
        is_ffmpeg_process: false,
    })
}

// 删除规则
const removeRule = (index: number) => {
    // 确保至少有一条规则
    if (formData.value.length === 1) {
        MessageUtil.warning("至少需要一条上传规则")
        return
    }

    formData.value.splice(index, 1)
}

watch(
    () => data,
    (newVal) => {
        formData.value = newVal
    },
    {
        deep: true,
    },
)

// 结果数据
const formDataResult = computed<FileAllowed[]>(() => [...formData.value])

// 验证规则
const rules = reactive<FormRules<FileAllowed>>({
    type: [
        {
            required: true,
            message: "文件类型不能为空",
            trigger: "blur",
        },
    ],
    extension: [
        {
            required: true,
            message: "文件拓展名不能为空",
            trigger: "blur",
        },
    ],
    max_size: [
        {
            required: true,
            message: "文件大小不能为空",
            trigger: "blur",
        },
        {
            validator: (rule, value, callback) => {
                // 判断是否为正整数
                if (!/^[1-9]\d*$/.test(value.toString())) {
                    callback(new Error("文件大小必须为正整数"))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        },
    ],
})

defineExpose({
    formDataResult,
    validateForm: async (): Promise<boolean> => {
        if (formRef.value) {
            try {
                await formRef.value.validate()
                return true
            } catch {
                return false
            }
        }
        return false
    },
})
</script>

<style lang="scss" scoped>
.form-page {
    height: 100%;
    width: 100%;
    background-color: var(--jpz-bg-color-page);
}

.title {
    text-align: left;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--jpz-text-color-regular);
}

.form-content {
    width: 1080px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 5px;
    padding: 20px;
    box-shadow: var(--jpz-box-shadow-light);
    background-color: var(--jpz-bg-color);

    .form-row {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .form-cell {
            margin: 0 10px;
        }
    }

    .el-input {
        width: 140px;
    }
}
</style>
