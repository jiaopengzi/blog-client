<!--
 * FilePath    : blog-client-dev\src\components\common\media-edit\subtitles-info\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 字幕信息
-->

<template>
    <el-form
        :label-position="labelPosition"
        label-width="100px"
        ref="subtitlesFormRef"
        :model="subtitlesForm"
        :size="formSize"
        status-icon
        :rules="rulesSubtitlesForm"
    >
        <el-form-item v-if="subtitlesList.length" label="已有字幕">
            <div class="multi-btn">
                <el-button class="multi-btn-item" size="small" v-for="item in subtitlesList" :key="item" @click="getSubtitles(item)">{{
                    Language[item as keyof typeof Language]
                }}</el-button>
            </div>
        </el-form-item>

        <el-form-item label="字幕语言" prop="language">
            <el-select v-model="subtitlesForm.language" placeholder="选择语言">
                <el-option v-for="item in languageKeys" :key="item" :label="Language[item as keyof typeof Language]" :value="item" />
            </el-select>
        </el-form-item>
        <el-form-item label="字幕内容" prop="subtitles">
            <el-input v-model="subtitlesForm.subtitles" type="textarea" :rows="28" :placeholder="subtitlesPlaceholder" />
        </el-form-item>

        <div class="btn-submit">
            <el-form-item>
                <el-button type="primary" size="default" @click="saveSubtitles(subtitlesFormRef as FormInstance)">保存</el-button>
                <el-button type="danger" size="default" @click="delSubtitles">删除</el-button>
            </el-form-item>
        </div>
    </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, ref, useTemplateRef, watch } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import { deleteSubtitlesAPI, type DeleteSubtitlesRequest } from "@/api/video/deleteSubtitles"
import { getSubtitlesByAdminAPI } from "@/api/video/getSubtitlesByAdmin"
import { upsertSubtitlesAPI, type UpsertSubtitlesRequest } from "@/api/video/upsertSubtitles"
import { Language } from "@/components/player"
import { MessageUtil } from "@/utils/message"
import { isWebvtt } from "@/utils/vttParse"

import type { SubtitlesForm } from "./types"

// 定义组件名称
defineOptions({ name: "SubtitlesInfo" })

// props
const { fileId, hashId, subtitlesList } = defineProps<{
    fileId: string // 文件ID
    hashId: string
    subtitlesList: string[] // 字幕列表
}>()

// emits
const emit = defineEmits<{
    (event: "update-subtitles", language: string): void // 更新字幕
    (event: "delete-subtitles", language: string): void // 删除字幕
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// ref
const subtitlesFormRef = useTemplateRef<FormInstance>("subtitlesFormRef")

// 语言keys
const languageKeys = Object.keys(Language)

// 表单数据
const subtitlesForm = reactive<SubtitlesForm>({
    file_id: "", // 文件ID
    language: "", // 语言
    label: "", // 显示名称
    subtitles: "", // 字幕
})

const subtitlesPlaceholder = ref(`支持的字幕格式：.webvtt
示例如下：

WEBVTT

1
00:00:00.000 --> 00:00:03.000
这是一个字幕示例。

2
00:00:03.000 --> 00:00:06.000
请按照上面的格式输入字幕内容。
`)

// 检查别名是否可用
function isWebvttValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
    // 判断是否是 webvtt 格式
    const checkResult = isWebvtt(subtitlesForm.subtitles)
    if (checkResult[0]) {
        callback()
        return
    } else {
        callback(new Error(checkResult[1]))
    }
}

/**
 * @description: 表单校验规则
 * @return  FormRules<SubtitlesForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rulesSubtitlesForm = reactive<FormRules<SubtitlesForm>>({
    language: [{ required: true, message: "请选择语言", trigger: "change" }],
    subtitles: [
        { required: true, message: "请输入webvtt字幕内容", trigger: "blur" },
        { validator: isWebvttValidator, trigger: "blur" },
    ],
})

// 保存字幕
const saveSubtitles = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    // 如果校验不通过直接返回
    if (!(await formEl.validate())) return

    // 请求参数
    const params: UpsertSubtitlesRequest = {
        file_id: fileId,
        language: subtitlesForm.language,
        label: Language[subtitlesForm.language as keyof typeof Language],
        subtitles: subtitlesForm.subtitles || "WebVTT ",
    }

    const res = await upsertSubtitlesAPI(params)
    if (res.data.code === ResponseCode.SubtitlesUpsertSuccess) {
        emit("update-subtitles", subtitlesForm.language)
        MessageUtil.success("保存成功", 3000)
    } else {
        const errMsg = handleResErr(res, "保存失败")
        MessageUtil.error(errMsg)
    }
}

// 删除字幕
const delSubtitles = async () => {
    // 判断是否选择了语言
    if (!subtitlesForm.language) {
        MessageUtil.warning("请选择要删除的语言")
        return
    }

    // 请求参数
    const params: DeleteSubtitlesRequest = {
        file_id: fileId,
        language: subtitlesForm.language,
    }

    await deleteSubtitlesAPI(params).then((res) => {
        if (res.data.code === ResponseCode.SubtitlesDeleteSuccess) {
            emit("delete-subtitles", subtitlesForm.language)
            // 重置表单，不会触发校验
            subtitlesFormRef.value?.resetFields()
            MessageUtil.success("删除成功", 3000)
        } else {
            const errMsg = handleResErr(res, "删除失败")
            MessageUtil.error(errMsg)
        }
    })
}

// 获取字幕
const getSubtitles = async (language: string) => {
    await getSubtitlesByAdminAPI(hashId, language).then((res) => {
        if (res.data.code === ResponseCode.GetVideoSubtitlesSuccess) {
            subtitlesForm.language = language
            subtitlesForm.subtitles = res.data.data.subtitles
            subtitlesForm.label = res.data.data.label
        } else {
            const errMsg = handleResErr(res, "获取字幕失败")
            MessageUtil.error(errMsg)
        }
    })
}

// 监控 file_id 变化
watch(
    () => fileId,
    (newVal, oldVal) => {
        if (!oldVal) return
        if (oldVal !== newVal) {
            // 当查看不同文件时，重置表单，不会触发校验
            subtitlesFormRef.value?.resetFields()
        }
    },
)
</script>

<style lang="scss" scoped>
.btn-submit {
    display: flex;
    justify-content: center;
}
</style>
