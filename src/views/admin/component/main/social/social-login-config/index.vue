<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\social\social-login-config\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 社交登录表单组件
-->

<template>
    <div class="form-page">
        <el-form
            :label-position="labelPosition"
            label-width="120px"
            ref="formRef"
            :model="formData"
            :rules="rules"
            class="form-content"
            :size="formSize"
            status-icon
        >
            <h2 class="title">社交登录配置{{ platformDisplay }}</h2>
            <!-- 说明内容插槽 -->
            <slot name="description"></slot>
            <el-form-item label="启用" prop="is_enabled">
                <el-checkbox v-model="formData.is_enabled" />
            </el-form-item>
            <el-form-item label="app_id" prop="app_id">
                <el-input v-model="formData.app_id" placeholder="请输入 app_id" clearable />
            </el-form-item>
            <el-form-item label="app_key" prop="app_key">
                <el-input v-model="formData.app_key" placeholder="请输入 app_key" clearable show-password type="password" />
            </el-form-item>
            <el-form-item label="根URL" prop="base_url">
                <el-input v-model="formData.base_url" placeholder="请输入社交登录绑定的根URL,默认为当前网站根URL。" clearable />
            </el-form-item>

            <el-form-item label="登录回调域" v-if="isShowCallback">
                <p>{{ loginCallback }}</p>
            </el-form-item>
            <el-form-item label="绑定回调域" v-if="isShowCallback">
                <p>{{ bindCallback }}</p>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { computed, reactive, ref, useTemplateRef, watch } from "vue"

import { SocialLoginDisplay, SocialLoginType } from "@/api/common"
import { type LoginConfig } from "@/api/setting/getSocialLogin"

defineOptions({ name: "SocialLoginConfig" })

const { platform, config } = defineProps<{
    platform: SocialLoginType
    config: LoginConfig
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 表单实例
const formRef = useTemplateRef<FormInstance>("formRef")

// 表单数据
const formData = ref<LoginConfig>(config)

watch(
    () => config,
    (newVal) => {
        formData.value = newVal
    },
)

const platformDisplay = computed(() => `-${SocialLoginDisplay[platform]}`)

// 构造登录回调和绑定回调
const loginCallback = computed(() => (formData.value.base_url ? `${formData.value.base_url}/social/${platform.toLowerCase()}/login/callback` : ""))
const bindCallback = computed(() => (formData.value.base_url ? `${formData.value.base_url}/social/${platform.toLowerCase()}/bind/callback` : ""))
const isShowCallback = computed(() => formData.value.app_id && formData.value.app_key && formData.value.base_url)

// 结果数据
const formDataResult = computed<LoginConfig>(() => {
    return {
        ...formData.value,
        redirect_uri: loginCallback.value,
        redirect_uri_bind: bindCallback.value,
    }
})

const rules: FormRules<LoginConfig> = reactive<FormRules<LoginConfig>>({
    app_id: [
        {
            validator: (rule, value, callback) => {
                if (formData.value.is_enabled && !value) {
                    callback(new Error("app_id 是必填项"))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        },
    ],
    app_key: [
        {
            validator: (rule, value, callback) => {
                if (formData.value.is_enabled && !value) {
                    callback(new Error("app_key 是必填项"))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        },
    ],
    base_url: [
        {
            validator: (rule, value, callback) => {
                if (formData.value.is_enabled && !value) {
                    callback(new Error("根 URL 是必填项"))
                    return
                }

                // 结尾不能有斜杠
                if (value.endsWith("/")) {
                    callback(new Error("根 URL 不能以斜杠 '/' 结尾"))
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
    width: 660px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 5px;
    padding: 20px;
    box-shadow: var(--jpz-box-shadow-light);
    background-color: var(--jpz-bg-color);
}
</style>
