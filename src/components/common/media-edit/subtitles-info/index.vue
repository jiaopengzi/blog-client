<!--
 * FilePath    : blog-client-nuxt\src\components\common\media-edit\subtitles-info\index.vue
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

        <el-form-item>
            <el-button class="action-btn" type="primary" plain @click="insertDemo">插入示例</el-button>
            <el-button class="action-btn" type="primary" plain @click="triggerSelectFile">选择文件</el-button>
            <input ref="subtitlesFileInputRef" class="subtitles-file-input" type="file" accept=".vtt,.webvtt,text/vtt" @change="handleSelectFile" />
        </el-form-item>

        <el-form-item label="字幕内容" prop="subtitles">
            <el-input v-model="subtitlesForm.subtitles" type="textarea" :rows="28" :placeholder="subtitlesPlaceholder" />
        </el-form-item>

        <div class="btn-submit">
            <el-form-item>
                <el-button class="action-btn" type="primary" :loading="loading" @click="saveSubtitles(subtitlesFormRef as FormInstance)">保存</el-button>
                <el-button class="action-btn" type="danger" :loading="loading" @click="delSubtitles">删除</el-button>
            </el-form-item>
        </div>
    </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { reactive, ref, useTemplateRef, watch } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import { deleteSubtitlesAPI, type DeleteSubtitlesRequest } from "@/api/video/deleteSubtitles"
import { getSubtitlesByAdminAPI } from "@/api/video/getSubtitlesByAdmin"
import { upsertSubtitlesAPI, type UpsertSubtitlesRequest } from "@/api/video/upsertSubtitles"
import { Language } from "@/components/player"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"
import { isWebvtt } from "@/utils/vttParse"

import type { SubtitlesForm } from "./types"

defineOptions({ name: "SubtitlesInfo" })

const { fileId, hashId, subtitlesList } = defineProps<{
    fileId: string // 文件ID
    hashId: string
    subtitlesList: string[] // 字幕列表
}>()

const emit = defineEmits<{
    (event: "update-subtitles", language: string): void // 更新字幕
    (event: "delete-subtitles", language: string): void // 删除字幕
}>()

// 表单 label 位置 top | left | right
const labelPosition = ref<"top" | "left" | "right">("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref<"" | "default" | "large" | "small">("default")

const subtitlesFormRef = useTemplateRef<FormInstance>("subtitlesFormRef")

// 本地字幕文件选择框 ref
const subtitlesFileInputRef = useTemplateRef<HTMLInputElement>("subtitlesFileInputRef")

const loading = ref(false)

// 语言 keys
const languageKeys = Object.keys(Language)

// 表单数据
const subtitlesForm = reactive<SubtitlesForm>({
    file_id: "", // 文件ID
    language: "", // 语言
    label: "", // 显示名称
    subtitles: "", // 字幕
})

const subtitlesDemo = ref(`
WEBVTT

1
00:00:00.000 --> 00:00:03.000 line:88% position:50% align:center
这是一个字幕示例。

2
00:00:03.000 --> 00:00:06.000 line:88% position:50% align:center
这是另一个字幕示例。
`)

const subtitlesPlaceholder = ref(`支持的字幕格式：.webvtt
示例如下：
${subtitlesDemo.value}

注意事项：
- 每个字幕块以数字编号开始，后跟时间戳和字幕文本。
- 时间格式为小时:分钟:秒.毫秒
- 时间戳后，可以使用 line、position 和 align 属性来调整字幕显示位置，最佳实践是使用 line:88% position:50% align:center。
- 字幕块之间需要空行分隔。
`)

const insertDemo = () => {
    subtitlesForm.subtitles = subtitlesDemo.value.trim()
}

// 触发本地字幕文件选择
const triggerSelectFile = () => {
    subtitlesFileInputRef.value?.click()
}

/**
 * @description: 处理本地字幕文件选择, 仅接受 WebVTT 格式, 读取后写入字幕内容
 * @param event input change 事件
 * @return void
 */
const handleSelectFile = (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    // 无论成功与否都清空 input, 保证再次选择同一文件仍能触发 change
    input.value = ""

    if (!file) return

    // 校验扩展名, 仅允许 .vtt 或 .webvtt
    const isVttExtension = /\.(vtt|webvtt)$/i.test(file.name)
    if (!isVttExtension) {
        MessageUtil.warning("仅支持 WebVTT 格式 (.vtt / .webvtt) 的字幕文件")
        return
    }

    const reader = new FileReader()
    reader.addEventListener("load", () => {
        const content = typeof reader.result === "string" ? reader.result : ""

        // 校验文件内容是否为合法 WebVTT
        const [isValid, errMsg] = isWebvtt(content)
        if (!isValid) {
            MessageUtil.error(errMsg || "字幕文件内容不是合法的 WebVTT 格式")
            return
        }

        subtitlesForm.subtitles = content
        MessageUtil.success("字幕文件已导入", 3000)
    })
    reader.addEventListener("error", () => {
        MessageUtil.error("读取字幕文件失败")
    })
    reader.readAsText(file)
}

// webvtt 格式校验器
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
 * @return FormRules<SubtitlesForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
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

    loading.value = true

    // 请求参数
    const params: UpsertSubtitlesRequest = {
        file_id: fileId,
        language: subtitlesForm.language,
        label: Language[subtitlesForm.language as keyof typeof Language],
        subtitles: subtitlesForm.subtitles || "WebVTT ",
    }

    const res = await upsertSubtitlesAPI(params)
    if (res.data.code === ResponseCode.SubtitlesUpsertSuccess) {
        // 如果响应中包含 items, 则轮询获取状态
        if (res.data.data && res.data.data.stream_items) {
            await pollingGetStreamIDsStatus(res.data.data.stream_items)
        }
        loading.value = false

        emit("update-subtitles", subtitlesForm.language)
        MessageUtil.success("保存成功", 3000)
    } else {
        loading.value = false
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

    loading.value = true

    // 请求参数
    const params: DeleteSubtitlesRequest = {
        file_id: fileId,
        language: subtitlesForm.language,
    }

    await deleteSubtitlesAPI(params).then(async (res) => {
        if (res.data.code === ResponseCode.SubtitlesDeleteSuccess) {
            // 如果响应中包含 items, 则轮询获取状态
            await pollingGetStreamIDsStatus(res.data.data.stream_items)
            loading.value = false

            emit("delete-subtitles", subtitlesForm.language)
            // 重置表单, 不会触发校验
            subtitlesFormRef.value?.resetFields()
            MessageUtil.success("删除成功", 3000)
        } else {
            loading.value = false
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
            // 当查看不同文件时, 重置表单, 不会触发校验
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

// 统一媒体编辑区动作按钮尺寸, 保证不同文字长度的按钮宽度一致
.action-btn {
    min-width: 96px;
}

.subtitles-file-input {
    display: none;
}
</style>
