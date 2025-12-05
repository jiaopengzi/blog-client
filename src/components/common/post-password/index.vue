<!--
 * FilePath    : blog-client-dev\src\components\common\post-password\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 密码保护文章
-->
<template>
    <div>
        <el-card class="post-password-card" shadow="hover">
            <div class="post-password-card-content">
                <div class="post-password-card-title">该文章受密码保护，请输入查看密码。</div>
                <!-- 用form包裹密码输入, 参考如下 -->
                <!-- https://www.chromium.org/developers/design-documents/create-amazing-password-forms/ -->
                <form @submit.prevent="submitPassword" class="form-password">
                    <el-input v-model="password" type="password" placeholder="请输入文章密码" class="post-password-input" />
                    <el-button type="primary" @click="submitPassword" :loading="localIsSubmitting">提交</el-button>
                </form>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

import { MessageUtil } from "@/utils/message"

defineOptions({ name: "PostPassword" })

const { isSubmitting = false } = defineProps<{
    isSubmitting?: boolean // 是否显示loading
}>()

// 事件
const emit = defineEmits<{
    (event: "password", val: string): void
}>()

const password = ref<string>("")
const localIsSubmitting = computed(() => isSubmitting)

const checkPassword = () => {
    // 密码不能为空
    if (password.value.trim() === "") {
        MessageUtil.error("密码不能为空")
        return false
    }

    // 密码中不允许有空格
    if (/\s/.test(password.value)) {
        MessageUtil.error("密码中不允许有空格")
        return false
    }

    // 密码不能少于6位
    if (password.value.trim().length < 6) {
        MessageUtil.error("密码不能少于6位")
        return false
    }

    // 密码不能大约64位
    if (password.value.trim().length > 64) {
        MessageUtil.error("密码不能大于64位")
        return false
    }

    return true
}

const submitPassword = () => {
    if (!checkPassword()) {
        return
    }

    // 提交密码
    emit("password", password.value)
}
</script>
<style lang="scss" scoped>
.post-password-card {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;

    .post-password-card-content {
        display: flex;
        flex-direction: column;
        align-items: center;

        .post-password-card-title {
            font-size: 18px;
            margin-bottom: 20px;
        }

        .form-password {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .post-password-input {
                width: 100%;
                margin-bottom: 20px;
            }
        }
    }
}
// @include respond-to("pc") {
// }

// @include respond-to("pad") {
// }

@include respond-to("phone") {
    .post-password-card {
        margin: 20px;
    }
}
</style>
