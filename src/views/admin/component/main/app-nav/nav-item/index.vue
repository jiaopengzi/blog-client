<!--
 * FilePath    : blog-client\src\views\admin\component\main\app-nav\nav-item\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 导航按钮
-->

<template>
    <el-form
        label-position="left"
        :label-width="labelWidth ? `${labelWidth}px` : '100px'"
        ref="formRef"
        :model="formDataResult"
        :rules="rules"
        class="nav-form"
        size="default"
        status-icon
        :scroll-to-error="true"
        :scroll-into-view-options="{ behavior: 'smooth', block: 'center' }"
        :style="{ width: formWidth ? `${formWidth}px` : '100%' }"
    >
        <el-form-item label="索引" prop="index">
            <el-input v-model="formDataResult.index" placeholder="导航按钮唯一索引，不可重复！" clearable disabled />
        </el-form-item>
        <el-form-item label="文字" prop="text">
            <el-input v-model="formDataResult.text" placeholder="导航按钮显示文字。" clearable />
        </el-form-item>
        <el-form-item label="文字样式" prop="text_style">
            <el-input v-model="formDataResult.text_style" placeholder="文字 css 样式。" type="textarea" clearable />
        </el-form-item>
        <el-form-item label="导航目标" prop="href">
            <el-input v-model="formDataResult.href" placeholder="导航目标链接或路径。" clearable />
        </el-form-item>
        <el-form-item label="target" prop="target">
            <el-input v-model="formDataResult.target" placeholder="target，可留空。" clearable />
        </el-form-item>
        <el-form-item label="父级索引" prop="parentIndex">
            <el-input v-model="formDataResult.parentIndex" placeholder="导航父级索引，可留空." clearable />
        </el-form-item>
        <el-form-item label="是否启用" prop="is_enabled">
            <el-checkbox v-model="formDataResult.is_enabled" />
        </el-form-item>
        <el-form-item>
            <span>【内置图标】和【自定义图标】在两者同时设置的情况，只会显示内置图标；若要设置自定义图标，请将内置图标留空。</span>
        </el-form-item>
        <el-form-item label="内置图标" prop="icon.name">
            <IconInput v-model="formDataResult.icon.name" placeholder="请选择内置图标。" clearable />
        </el-form-item>
        <el-form-item label="自定义图标" prop="icon.src">
            <ImageInput v-model="formDataResult.icon.src" :is-show-img="false" placeholder="使用自定义图标。" clearable />
        </el-form-item>
        <el-form-item label="alt" prop="icon.alt">
            <el-input v-model="formDataResult.icon.alt" placeholder="alt内容。" clearable />
        </el-form-item>
        <el-form-item label="图标样式" prop="icon.style">
            <el-input v-model="formDataResult.icon.style" placeholder="图标 css 样式。" type="textarea" clearable />
        </el-form-item>
        <el-form-item label="预览">
            <el-menu>
                <el-menu-item :index="formData.index">
                    <img
                        v-if="!isInnerIcon && formData.icon.src"
                        :src="formData.icon.src"
                        :alt="formData.icon.alt"
                        :style="formData.icon.style"
                        class="icon-img"
                    />
                    <j-icon v-if="isInnerIcon" :name="formData.icon.name" custom-class="icon-inner" :style="formData.icon.style" />
                    <template #title>
                        <span class="nav-text" :style="formData.text_style">{{ formData.text }}</span>
                    </template>
                </el-menu-item>
            </el-menu>
        </el-form-item>

        <div class="delete">
            <el-button class="delete-btn" type="danger" @click="handleDelete(formDataResult.index)">删除</el-button>
        </div>
    </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus"
import { computed, reactive, useTemplateRef } from "vue"

import IconInput from "@/components/common/icon-input"
import ImageInput from "@/components/common/image-input"

import { useNavItem } from "./hook"
import type { NavItemProps } from "./types"

defineOptions({ name: "NavItem" })

const { formData, formWidth, labelWidth } = defineProps<{
    formData: NavItemProps
    formWidth?: number
    labelWidth?: number
}>()

// 事件
const emit = defineEmits<{
    (event: "handle-delete", val: string): void // 删除
}>()

const formRef = useTemplateRef<FormInstance>("formRef")
const formDataResult = reactive<NavItemProps>(formData)

const { rules } = useNavItem(formDataResult)

// 如果 icon.name 有值，则使用内置图标，否则使用自定义图标
const isInnerIcon = computed(() => !!formDataResult.icon.name)

const handleDelete = (val: string) => {
    emit("handle-delete", val)
}

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
@use "@/components/layout/header-nav/style.module.scss";

.nav-form {
    width: 100%;
    // border-bottom: 1px solid var(--jpz-border-color);
    padding: 20px;
    background-color: var(--jpz-bg-color);
    // .el-input {
    //     --el-input-width: 220px;
    // }
    // border-radius: 6px;
    // box-shadow: var(--jpz-box-shadow-light);
}

.nav-text {
    margin-left: 6px;
    font-weight: 700;
    // 文字过长时，显示省略号
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.icon-inner {
    font-size: 24px;
}

.icon-img {
    width: 24px;
    height: 24px;
}

.delete {
    margin-top: 20px;
    text-align: right;
    .delete-btn {
        width: 50px;
    }
}
</style>
