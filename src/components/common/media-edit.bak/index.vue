<!--
 * @FilePath     : \blog-client\src\components\common\media-edit\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 编辑媒体
-->

<template>
    <!-- 参考:https://github.com/element-plus/element-plus/blob/dev/packages/components/image/src/image.vue -->
    <el-image-viewer v-if="isShowElImageViewer" @close="closeElImageViewer" :url-list="imgUrls" />
    <div :class="layoutClass">
        <div class="left" ref="leftRef" @click="handleDelegateClick">
            <img class="view-img" v-if="editMediaData.img?.url && !isVideoFile" :src="editMediaData.img.url" />
            <j-icon custom-class="view-icon" v-else-if="editMediaData.img?.iconKeyName && !isVideoFile" :name="editMediaData.img?.iconKeyName" />
            <VideoPlayer v-if="isVideoFile && editMediaData.editDialogVisible" :player-state="playerState" />
        </div>

        <div class="middle">
            <el-form
                :label-position="labelPosition"
                label-width="100px"
                ref="editMediaFormRef"
                :model="editMediaForm"
                class="edit-media-form"
                :size="formSize"
                status-icon
                :rules="rulesEditMedia"
            >
                <el-form-item label="文件ID" prop="file_ID">
                    <el-input v-model="editMediaForm.file_id" disabled />
                </el-form-item>

                <el-form-item label="是否为HLS" prop="is_generate_hls">
                    <el-input v-model="editMediaForm.is_generate_hls" disabled />
                </el-form-item>

                <el-form-item label="文件名" prop="file_name_display">
                    <el-input v-model="editMediaForm.file_name_display" :rows="5" type="textarea" />
                </el-form-item>

                <el-form-item v-if="isVideoFile" label="视频免费" prop="is_free">
                    <el-switch
                        class="switch"
                        v-model="editMediaForm.is_free"
                        :disabled="!editMediaForm.is_generate_hls"
                        inline-prompt
                        active-text="免费"
                        inactive-text="收费"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    />
                </el-form-item>

                <el-form-item label="文件ID哈希" prop="file_id_hash">
                    <el-input v-model="editMediaForm.file_id_hash" />
                </el-form-item>

                <el-form-item label="文件URL" prop="file_url">
                    <el-input v-model="editMediaForm.file_url" />
                </el-form-item>

                <el-form-item label="说明" prop="description">
                    <el-input v-model="editMediaForm.description" type="textarea" :rows="10" placeholder="文件说明" />
                </el-form-item>

                <div class="btn-submit">
                    <el-button type="primary" :loading="loadingEditMedia" @click="submitForm(editMediaFormRef as FormInstance)">更新</el-button>
                </div>
            </el-form>
        </div>

        <div class="right" v-if="isVideoFile">
            <el-form
                :label-position="labelPosition"
                label-width="100px"
                ref="subtitlesFormRef"
                :model="subtitlesForm"
                class="edit-media-form"
                :size="formSize"
                status-icon
                :rules="rulesSubtitlesForm"
            >
                <el-form-item v-if="editMediaData.subtitles_language_list.length" label="已有字幕">
                    <div class="multi-btn">
                        <el-button
                            class="multi-btn-item"
                            size="small"
                            v-for="item in editMediaData.subtitles_language_list"
                            :key="item"
                            @click="getSubtitles(item)"
                            >{{ Language[item as keyof typeof Language] }}</el-button
                        >
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
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { computed, reactive, ref, useTemplateRef, watch } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import { updateFileAPI, type UpdateFileRequest } from "@/api/upload/updateFile"
import { deleteSubtitlesAPI, type DeleteSubtitlesRequest } from "@/api/video/deleteSubtitles"
import { getSubtitlesByAdminAPI } from "@/api/video/getSubtitlesByAdmin"
import { upsertSubtitlesAPI, type UpsertSubtitlesRequest } from "@/api/video/upsertSubtitles"
import VideoPlayer from "@/components/player"
import { Language, MediaTypes, type PlayerState, PlayerStateManager } from "@/components/player"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { isVideo } from "@/utils/isVideo"
import { MessageUtil } from "@/utils/message"
import { isWebvtt } from "@/utils/vttParse"

import type { EditMediaForm, EditMediaProps, SubtitlesForm } from "./types"

// 定义组件名称
defineOptions({ name: "EditMedia" })

// props
const { editMediaData } = defineProps<{
    editMediaData: EditMediaProps // 编辑媒体数据
}>()

// emits
const emit = defineEmits<{
    (event: "edit-media-status", value: boolean): void // 编辑Media状态
    (event: "update-subtitles", language: string): void // 更新字幕
    (event: "delete-subtitles", language: string): void // 删除字幕
}>()

const playerStateManager = new PlayerStateManager()

// 设置播放器状态
playerStateManager.setShortcutKey(false) // 禁用快捷键
playerStateManager.setIsAdmin(true) // 管理员模式

let playerState: PlayerState = playerStateManager.getState()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// ref
const editMediaFormRef = useTemplateRef<FormInstance>("editMediaFormRef")
const subtitlesFormRef = useTemplateRef<FormInstance>("subtitlesFormRef")
const leftRef = useTemplateRef<HTMLDivElement>("leftRef")

// 语言keys
const languageKeys = Object.keys(Language)

const hashID = ref("")

// 表单数据
const editMediaForm = reactive<EditMediaForm>({
    file_id: "", // 文件ID
    is_generate_hls: false, // 是否生成 HLS
    file_name_display: "", // 显示名称
    description: "", // 描述
    file_id_hash: "", // 文件id哈希
    file_url: "", // 文件地址
    is_free: false, // 是否免费
})

// 表单数据
const subtitlesForm = reactive<SubtitlesForm>({
    file_id: "", // 文件ID
    language: "", // 语言
    label: "", // 显示名称
    subtitles: "", // 字幕
})

// 更新表单数据
const updateForm = (data: EditMediaProps) => {
    editMediaForm.file_id = data.file_id
    editMediaForm.is_generate_hls = data.is_generate_hls
    editMediaForm.file_name_display = data.file_name_display
    editMediaForm.description = data.description
    editMediaForm.file_id_hash = data.file_id_hash
    editMediaForm.file_url = data.file_url
    editMediaForm.is_free = data.is_free

    isVideoFile.value = isVideo(data.file_type)
    hashID.value = editMediaData.file_name.split(".")[0]!
}

// 是否是视频文件
const isVideoFile = ref(isVideo(editMediaData.file_type))

// 计算属性：根据 isVideoFile 的值设置布局样式
const layoutClass = computed(() => {
    return isVideoFile.value ? "edit-media-page video-layout" : "edit-media-page no-video-layout"
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
        file_id: editMediaData.file_id,
        language: subtitlesForm.language,
        label: Language[subtitlesForm.language as keyof typeof Language],
        subtitles: subtitlesForm.subtitles || "WebVTT ",
    }

    const res = await upsertSubtitlesAPI(params)
    if (res.data.code === ResponseCode.SubtitlesUpsertSuccess) {
        emit("update-subtitles", subtitlesForm.language)
        playerStateManager.setSubtitlesByVideoHashIdAuto() // 更新字幕
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
        file_id: editMediaData.file_id,
        language: subtitlesForm.language,
    }

    await deleteSubtitlesAPI(params).then((res) => {
        if (res.data.code === ResponseCode.SubtitlesDeleteSuccess) {
            emit("delete-subtitles", subtitlesForm.language)
            playerStateManager.setSubtitlesByVideoHashIdAuto() // 更新字幕
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
    await getSubtitlesByAdminAPI(hashID.value, language).then((res) => {
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

/**
 * @description: 表单校验规则
 * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rulesEditMedia = reactive<FormRules<EditMediaForm>>({
    file_name_display: [{ required: true, message: "请输入文件名", trigger: "blur" }],
})

const loadingEditMedia = ref(false)

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    // 如果校验不通过直接返回
    if (!(await formEl.validate())) return

    // 请求参数
    const params: UpdateFileRequest = {
        file_id: editMediaData.file_id,
        is_generate_hls: editMediaForm.is_generate_hls,
        file_name_display: editMediaForm.file_name_display,
        description: editMediaForm.description,
        is_free: editMediaForm.is_free,
        is_video: isVideoFile.value,
    }

    loadingEditMedia.value = true
    // 调用后端接口
    await updateFileAPI(params).then(async (res) => {
        if (res.data.code === ResponseCode.UpdateFileSuccess) {
            // 保证有数据且包含 stream_items 字段才进行轮询
            if (res.data.data && res.data.data.stream_items) {
                await pollingGetStreamIDsStatus(res.data.data.stream_items)
            }
            loadingEditMedia.value = false

            emit("edit-media-status", true)
            MessageUtil.success("更新成功", 3000)
        } else {
            loadingEditMedia.value = false
            const errMsg = handleResErr(res, "更新失败")
            MessageUtil.error(errMsg)
        }
    })
}

// 监控 props.editUserData 变化 更新页面数据
watch(
    () => editMediaData,
    (newVal) => {
        updateForm(newVal) // 更新表单数据
    },
    {
        // 立即执行
        immediate: true,
        deep: true,
    },
)

// 监控 file_id 变化
watch(
    () => editMediaData.file_id,
    (newVal, oldVal) => {
        if (!oldVal) return
        if (oldVal !== newVal) {
            // 当查看不同文件时，重置表单，不会触发校验
            subtitlesFormRef.value?.resetFields()
        }
    },
)

// 视频宽度
const videoWidth = ref(480)

// 设置播放器
watch(
    () => [isVideoFile.value, editMediaData.editDialogVisible],
    ([isVideoFileVal, editDialogVisibleVal]) => {
        if (isVideoFileVal && editDialogVisibleVal) {
            // 设置视频宽度
            // nextTick(() => {
            //     if (leftRef.value) {
            //         videoWidth.value = leftRef.value.clientWidth
            //     }
            // })

            playerStateManager.setSize(videoWidth.value, (videoWidth.value * 9) / 16) // 16:9
            playerStateManager.setVideoID(hashID.value) // 设置视频hashID

            if (!editMediaData.is_generate_hls) {
                playerStateManager.setMediaType(MediaTypes.MP4) // 设置视频类型
                playerStateManager.setSrc(editMediaData.file_url) // 设置视频地址
            }

            playerState = playerStateManager.getState()
        }
    },
    { immediate: true },
)

// 图片预览
const isShowElImageViewer = ref(false)
const imgUrls = ref<string[]>([])

// 关闭图片预览
const closeElImageViewer = () => {
    isShowElImageViewer.value = false
    document.body.style.overflow = "auto"
}

// 点击事件委托,图片预览.
const handleDelegateClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.tagName.toLowerCase() === "img" && "src" in target) {
        // img 图片
        const imgElement = target as HTMLImageElement // 断言 img 元素
        isShowElImageViewer.value = true // 显示图片预览
        imgUrls.value = [imgElement.src] // 图片地址
        document.body.style.overflow = "hidden" // 隐藏滚动条
    }
}
</script>

<style lang="scss" scoped>
.edit-media-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;

    .left {
        cursor: pointer;
        width: 30%;
        display: flex;
        justify-content: center;
        align-items: flex-start;

        .view-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .view-icon {
            font-size: 15em;
            fill: var(--jpz-color-primary);
        }
    }

    .middle {
        width: 25%;
        position: relative;
        margin: 0 30px;

        &::before,
        &::after {
            content: "";
            position: absolute;
            top: 0;
            width: 1px;
            height: 100%;
            background-color: #ccc;
        }

        &::before {
            left: -15px;
        }

        &::after {
            right: -15px;
        }
    }

    .right {
        width: 45%;

        .multi-btn {
            display: flex;
            flex-wrap: wrap;
        }

        .multi-btn-item {
            margin: 5px;
            width: 80px;
        }
    }

    .btn-submit {
        display: flex;
        justify-content: center;
    }
}

// 当没有视频文件时的布局样式
.no-video-layout {
    .left {
        width: 40%;
    }

    .middle {
        width: 60%;
        margin: 0, 20px;

        &::after {
            display: none;
        }
    }
}
</style>
