<!--
 * FilePath    : blog-client-dev\src\components\common\slide-verify-manage\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 滑动验证图片管理
-->

<template>
    <div class="form-page">
        <el-form :label-position="labelPosition" ref="formRef" :model="formData" :rules="rules" class="form-content" :size="formSize" status-icon>
            <el-form-item v-for="(fItem, index) in formData" :key="index" class="form-row">
                <el-form-item label="图片链接" :prop="`[${index}].imageUrl`" :rules="rules.imageUrl" class="form-cell">
                    <el-input v-model="fItem.imageUrl" placeholder="图片链接" clearable />
                    <!-- 预览效果 -->
                    <el-image class="img-preview" v-if="fItem.imageUrl" :src="fItem.imageUrl" alt="预览" fit="contain" />
                </el-form-item>
                <el-button type="danger" @click="remove(index)" size="small" class="form-cell">删除</el-button>
            </el-form-item>
            <el-button type="primary" @click="add" size="small" class="form-row-add">增加滑动验证图片</el-button>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { reactive, ref, toRaw, useTemplateRef, watch } from "vue"

import { type SlideVerifyImgItem } from "./types"

defineOptions({ name: "SlideVerifyManage" })

const { data = [] } = defineProps<{
    data?: SlideVerifyImgItem[]
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 表单实例
const formRef = useTemplateRef<FormInstance>("formRef")

// 表单数据
const formData = ref<SlideVerifyImgItem[]>(data)

// 添加
const add = () => {
    formData.value.push({
        imageUrl: "",
    })
}

// 删除
const remove = (index: number) => {
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

// 验证规则
const rules = reactive<FormRules<SlideVerifyImgItem>>({
    imageUrl: [
        { required: true, message: "请输入图片链接", trigger: "blur" },
        { type: "url", message: "请输入正确图片链接", trigger: "blur" },
    ],
})

defineExpose({
    get formDataResult() {
        return toRaw(formData.value) // 使用 toRaw 获取原始数据
    },
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
    margin: 40px 0;
}

.form-content {
    width: 100%;
    // border: 1px solid var(--jpz-border-color);
    // border-radius: 5px;
    // padding: 20px;
    // box-shadow: var(--jpz-box-shadow-light);
    background-color: var(--jpz-bg-color);

    .form-row {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .form-cell {
            margin: 0 10px;
            height: 32px;

            .img-preview {
                width: 86px;
                height: 32px;
                margin: 0 5px;
            }
        }
    }

    .el-input {
        width: 140px;
    }
}
</style>
