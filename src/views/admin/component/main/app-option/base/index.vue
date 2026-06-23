<!--
 * FilePath    : blog-client\src\views\admin\component\main\app-option\base\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 网站选项基础组件
-->

<template>
    <el-form
        label-position="left"
        :label-width="labelWidth ? `${labelWidth}px` : '100px'"
        ref="formRef"
        :model="formDataResult"
        :rules="rules"
        class="base-form"
        size="default"
        status-icon
        :scroll-to-error="true"
        :scroll-into-view-options="{ behavior: 'smooth', block: 'center' }"
        :style="{ width: formWidth ? `${formWidth}px` : '100%' }"
    >
        <h2 class="title">{{ title }}</h2>
        <template v-for="(item, index) in formItems" :key="index">
            <!-- 如果是分类标题，则使用 h4 显示在表单项外 -->
            <h4 v-if="item.isCategoryTitle" class="category-title">{{ item.label }}</h4>

            <!-- 在 v-for 中不能直接使用 useTemplateRef  -->
            <SlideVerifyManage
                v-else-if="item.isSlideVerifyManage"
                :ref="
                    (el) => {
                        if (el) setSlideVerifyManageRef(el as SlideVerifyManageFormRef)
                    }
                "
                :data="slideVerifyManageData"
            />

            <!-- 在 v-for 中不能直接使用 useTemplateRef  -->
            <CarouselManage
                v-else-if="item.isCarouselManage"
                :ref="
                    (el) => {
                        if (el) setCarouselRef(el as CarouselFormRef)
                    }
                "
                :data="carouselManageData"
            />

            <!-- 否则就是普通表单项 -->
            <el-form-item v-else :label="item.label" :prop="item.prop">
                <template v-if="item.isCheckbox">
                    <el-checkbox v-model="formDataResult[item.prop as keyof APPOptionForm]" />
                    <span v-if="item.isSitemapLink" class="sitemap-link">
                        <span class="sitemap-link__label">访问链接：</span>
                        <el-link :href="sitemapUrl" target="_blank" type="primary" :underline="false">
                            {{ sitemapUrl }}
                        </el-link>
                    </span>
                </template>

                <ImageInput
                    v-else-if="item.isImageInput"
                    v-model="formDataResult[item.prop as keyof APPOptionForm] as string"
                    :type="item.type"
                    :placeholder="item.placeholder"
                    clearable
                />

                <div class="editor" v-else-if="item.editor">
                    <el-button v-if="item.editor.type === 'css'" @click="insertCssExample(item.prop as keyof APPOptionForm)">插入 CSS 示例</el-button>
                    <EditorCodemirror
                        :ref="
                            (el) => {
                                if (el) setEditorRef(el as CodemirrorRef)
                            }
                        "
                        :create-setup="item.editor.createSetup"
                        :doc="(formDataResult[item.prop as keyof APPOptionForm] as string) || ''"
                        :height="editorHeightCalc(item)"
                        @update-editor-doc="(doc) => handleEditorUpdate(item.prop as keyof APPOptionForm, doc)"
                    />
                </div>

                <el-input
                    v-else
                    v-model="formDataResult[item.prop as keyof APPOptionForm]"
                    :type="item.type"
                    :placeholder="item.placeholder"
                    :rows="item.textareaRows"
                    :class="item.customClass"
                    clearable
                />
            </el-form-item>
        </template>
    </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { computed, reactive, type Ref, ref, useTemplateRef } from "vue"

import CarouselManage, { type CarouselFormRef } from "@/components/common/carousel-manage"
import ImageInput from "@/components/common/image-input"
import SlideVerifyManage, { type SlideVerifyManageFormRef } from "@/components/common/slide-verify-manage"
import EditorCodemirror, { type CodemirrorRef } from "@/components/editor/components/codemirror"
import { cssExample } from "@/utils/cssExample"

import type { APPOptionForm, FormItems } from "./types"

defineOptions({ name: "BaseForm" })

const { title, formData, rules, formItems, formWidth, labelWidth } = defineProps<{
    title: string
    formData: APPOptionForm
    rules: FormRules
    formItems: Array<FormItems>
    formWidth?: number
    labelWidth?: number
}>()

const formRef = useTemplateRef<FormInstance>("formRef")

// 通用的 ref 设置函数工厂
// 由于在 v-for 中不能直接使用 useTemplateRef, 所以通过函数赋值
function createRefSetter<T>(targetRef: Ref<T | null>) {
    return (el: T | null) => {
        targetRef.value = el
    }
}

// 轮播图组件引用
const carouselManageRef = ref<CarouselFormRef | null>(null)
const setCarouselRef = createRefSetter(carouselManageRef)

// 滑动验证组件引用
const slideVerifyManageRef = ref<SlideVerifyManageFormRef | null>(null)
const setSlideVerifyManageRef = createRefSetter(slideVerifyManageRef)
// 编辑器组件引用列表

// 编辑器组件引用
const editorRefs = ref<CodemirrorRef | null>(null)
const setEditorRef = createRefSetter(editorRefs)

// 站点地图访问链接（基于当前页面协议、域名、端口拼接）
const sitemapUrl = computed(() => `${window.location.origin}/sitemap.xml`)

// 结果数据
const formDataResult = reactive<APPOptionForm>(formData)

// 滑动验证数据
const slideVerifyManageData = computed(() => {
    if (formDataResult.slide_verify_imgs) {
        try {
            return JSON.parse(formDataResult.slide_verify_imgs)
        } catch {
            return []
        }
    }
    return []
})

// 轮播图数据
const carouselManageData = computed(() => {
    if (formDataResult.carousel_manage) {
        try {
            return JSON.parse(formDataResult.carousel_manage)
        } catch {
            return []
        }
    }
    return []
})

// 处理编辑器内容更新
const handleEditorUpdate = (prop: keyof APPOptionForm | undefined, editorDoc: string) => {
    if (prop) {
        ;(formDataResult[prop as keyof APPOptionForm] as unknown as string) = editorDoc
    }
}

// 插入 CSS 示例
const insertCssExample = (prop: keyof APPOptionForm | undefined) => {
    if (prop) {
        const oldDoc = (formDataResult[prop as keyof APPOptionForm] as string) || ""
        const newDoc = oldDoc + cssExample()
        // 同步到编辑器
        if (editorRefs.value) {
            editorRefs.value.insertContent(newDoc)
        }
    }
}

// 根据编辑器类型计算高度
const editorHeightCalc = (item: FormItems): string => {
    if (item.editor && item.editor.type === "css") {
        return "400"
    }
    if (item.editor && item.editor.type === "json") {
        return "160"
    }
    return "400"
}

defineExpose({
    formDataResult,
    validateForm: async (): Promise<boolean> => {
        let carouselValid = true
        let formValid = true

        // 如果 slideVerifyManage 存在, 则校验
        if (slideVerifyManageRef.value && slideVerifyManageRef.value.formDataResult && slideVerifyManageRef.value.formDataResult.length > 0) {
            const flag = await slideVerifyManageRef.value.validateForm()
            if (flag) {
                // 将结果数据同步到 formDataResult 中
                formDataResult.slide_verify_imgs = JSON.stringify(slideVerifyManageRef.value.formDataResult)
            } else {
                carouselValid = false
            }
        } else {
            formDataResult.slide_verify_imgs = "[]"
        }

        // 如果 carouselManage 存在, 则校验
        if (carouselManageRef.value && carouselManageRef.value.formDataResult && carouselManageRef.value.formDataResult.length > 0) {
            const flag = await carouselManageRef.value.validateForm()
            if (flag) {
                // 将结果数据同步到 formDataResult 中
                formDataResult.carousel_manage = JSON.stringify(carouselManageRef.value.formDataResult)
            } else {
                carouselValid = false
            }
        } else {
            formDataResult.carousel_manage = "[]"
        }

        // 校验 el-form
        if (formRef.value) {
            try {
                await formRef.value.validate()
            } catch {
                formValid = false
            }
        }

        // 只有两者都通过才返回 true
        return carouselValid && formValid
    },
})
</script>

<style lang="scss" scoped>
.base-form {
    width: 100%;
    // border-bottom: 1px solid var(--jpz-border-color);
    padding: 20px;
    background-color: var(--jpz-bg-color);
    // .el-input {
    //     --el-input-width: 220px;
    // }
    border-radius: 6px;
    box-shadow: var(--jpz-box-shadow-light);
}

.title {
    text-align: left;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--jpz-text-color-regular);
}

.category-title {
    font-size: 14px;
    font-weight: 700;
    margin-top: 40px;
    margin-bottom: 10px;
    color: var(--jpz-text-color-regular);
    // padding-bottom: 4px;
    // border-bottom: 1px solid var(--jpz-border-color);
}

.editor {
    display: grid;
    grid-template-columns: 1fr;
    border: 1px solid var(--jpz-border-color);
    border-radius: 2px;
    width: 100%;
    height: 100%;
}

.sitemap-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-left: 16px;

    &__label {
        color: var(--jpz-text-color-secondary);
        font-size: 14px;
    }
}
</style>
