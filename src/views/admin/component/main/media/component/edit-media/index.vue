<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 10:24:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-06 17:50:05
 * @FilePath     : \blog-client\src\views\admin\component\main\media\component\edit-media\index.vue
 * @Description  : 编辑媒体
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
-->

<template>
    <div class="edit-media-page">

        <div class="left">
            <img class="view" v-if="editMediaData.img?.url" :src="editMediaData.img.url" />
            <Icon class="view" v-else-if="editMediaData.img?.iconKeyName" :name="editMediaData.img?.iconKeyName" />
        </div>

        <div class="middle">

            <el-form :label-position="labelPosition" label-width="100px" ref="editMediaFormRef" :model="editMediaForm"
                class="edit-media-form" :size="formSize" status-icon :rules="rulesEditMedia">

                <el-form-item label="文件ID" prop="file_ID">
                    <el-input v-model.trim="editMediaForm.file_id" disabled />
                </el-form-item>

                <el-form-item label="文件名" prop="file_name_display">
                    <el-input v-model.trim="editMediaForm.file_name_display" :rows="5" type="textarea" />
                </el-form-item>

                <el-form-item label="视频免费" prop="is_free">
                    <el-switch class="switch" v-model="editMediaForm.is_free" inline-prompt active-text="免费"
                        inactive-text="收费" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                </el-form-item>


                <el-form-item label="文件别名" prop="slug">
                    <el-input v-model="editMediaForm.slug" />
                </el-form-item>

                <el-form-item label="说明" prop="description">
                    <el-input v-model="editMediaForm.description" type="textarea" :rows="10" placeholder="文件说明" />
                </el-form-item>

                <div class="btn-submit">

                    <el-button type="primary" @click="submitForm(editMediaFormRef as FormInstance)">更新</el-button>

                </div>
            </el-form>

        </div>

        <div class="right">
            <el-form :label-position="labelPosition" label-width="100px" ref="subtitlesFormRef" :model="subtitlesForm"
                class="edit-media-form" :size="formSize" status-icon>

                <el-form-item v-if="editMediaData.subtitles_language_list.length" label="已有字幕">
                    <div class="multi-btn">
                        <el-button class="multi-btn-item" size="small"
                            v-for="item in editMediaData.subtitles_language_list" :key="item"
                            @click="getSubtitles(item)">{{
                                Language[item as keyof typeof Language] }}</el-button>
                    </div>
                </el-form-item>

                <el-form-item label="字幕语言" prop="language">
                    <el-select v-model="subtitlesForm.language" placeholder="选择语言">
                        <el-option v-for="item in Object.keys(Language)" :key="item"
                            :label="Language[item as keyof typeof Language]" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="字幕内容" prop="subtitles">
                    <el-input v-model="subtitlesForm.subtitles" type="textarea" :rows="28"
                        :placeholder="subtitlesPlaceholder" />
                </el-form-item>
                <div class="btn-submit">
                    <el-form-item>
                        <el-button type="primary" size="default" @click="saveSubtitles">保存</el-button>
                        <el-button type="danger" size="default" @click="delSubtitles">删除</el-button>
                    </el-form-item>
                </div>
            </el-form>

        </div>

    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, useTemplateRef } from 'vue'
import type { EditMediaProps, EditMediaForm, SubtitlesForm } from '@/views/admin/component/main/media/component/edit-media'
import { ShowMsgTip } from '@/utils/message'
import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S
import { ResponseCode } from '@/api/responseCode'
import { getSubtitlesAPI } from '@/api/video/getSubtitles'
import { type UpsertSubtitlesRequest, upsertSubtitlesAPI } from '@/api/video/upsertSubtitles'
import { type DeleteSubtitlesRequest, deleteSubtitlesAPI } from '@/api/video/deleteSubtitles'
import { isWebvtt, Language } from '@/utils/vttParser'


defineOptions({ name: 'EditMedia' })

// props
const { editMediaData } = defineProps<{
    editMediaData: EditMediaProps // 编辑媒体数据
}>()


// emits
const emit = defineEmits<{
    (event: 'edit-media-status', value: boolean): void // 编辑Media状态
    (event: 'update-subtitles', language: string): void // 更新字幕
    (event: 'delete-subtitles', language: string): void // 删除字幕
}>()


// 表单label位置 top | left | right
const labelPosition = ref('left')

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('default')


// 表单实例
const editMediaFormRef = useTemplateRef<FormInstance>("editMediaFormRef")


// 表单数据
const editMediaForm = reactive<EditMediaForm>({
    file_id: "", // 文件ID
    file_name_display: "", // 显示名称
    description: "", // 描述
    slug: "", // 文件别名
    is_free: false, // 是否免费
})

// 表单数据
const subtitlesForm = reactive<SubtitlesForm>({
    file_id: "", // 文件ID
    language: "", // 语言
    label: "", // 显示名称
    subtitles: "", // 字幕
})


const updateForm = (data: EditMediaProps) => {
    editMediaForm.file_id = data.file_id
    editMediaForm.file_name_display = data.file_name_display
    editMediaForm.description = data.description
    editMediaForm.slug = data.slug
    editMediaForm.is_free = data.is_free

    subtitlesForm.file_id = data.file_id
}


const subtitlesPlaceholder = ref(`支持的字幕格式：.webvtt
示例如下：

WEBVTT

1
00:00:00.000 --> 00:00:03.000
Hello, world!

2
00:00:03.000 --> 00:00:06.000
This is a WebVTT file.
`)




/**
   * @description: 大于等于 -1 的整数 Validator (el-form-item 需要绑定对应的prop才能触发校验)
   * @param rule 校验规则
   * @param value 对应输入框的值
   * @param callback 回调函数
   */
function validateIntegerAroundMinusOne(
    rule: any,
    value: string,
    callback: (error?: string | Error | undefined) => void,
): void {
    // 大于等于0的整数
    if (!/^[0-9]\d*$/.test(value)) {
        callback(new Error('请输入大于等于 0 的整数'))
    } else {
        callback()
    }
}

/**
   * @description: 正整数 Validator (el-form-item 需要绑定对应的prop才能触发校验)
   * @param rule 校验规则
   * @param value 对应输入框的值
   * @param callback 回调函数
   */
function validatePositiveInteger(
    rule: any,
    value: string,
    callback: (error?: string | Error | undefined) => void,
): void {
    if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('请输入正整数'))
    } else {
        callback()
    }
}

/**
 * @description: 表单校验规则
 * @return  FormRules<PermissionRole> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rulesEditMedia = reactive<FormRules<EditMediaForm>>({
    slug: [
        { message: '请输入大于等于 0 的整数', trigger: 'blur' },
        // 用户查重
        { validator: validateIntegerAroundMinusOne, trigger: 'blur' },
    ],
})

// 保存字幕
const saveSubtitles = async () => {
    // 判断是否选择了语言
    if (!subtitlesForm.language) {
        ShowMsgTip(ShowMsgTip.MsgType.warning, "请选择字幕语言")
        return
    }

    // 判断是否是webvtt格式
    const checkResult = isWebvtt(subtitlesForm.subtitles || "")
    if (!checkResult[0]) {
        ShowMsgTip(ShowMsgTip.MsgType.warning, checkResult[1])
        return
    }

    // 请求参数
    const params: UpsertSubtitlesRequest = {
        file_id: editMediaData.file_id,
        language: subtitlesForm.language,
        label: Language[subtitlesForm.language as keyof typeof Language],
        subtitles: subtitlesForm.subtitles || "WebVTT "
    }

    const res = await upsertSubtitlesAPI(params)
    if (res.data.code === ResponseCode.SubtitlesUpsertSuccess) {
        emit('update-subtitles', subtitlesForm.language)
        ShowMsgTip(ShowMsgTip.MsgType.success, "保存成功", 3000)

    } else {
        let errMsg = res.data.msg || "保存失败"
        if (res.data.data) {
            errMsg = res.data.msg + "：" + res.data.data
        }
        ShowMsgTip(ShowMsgTip.MsgType.error, errMsg)
    }

}

// 删除字幕
const delSubtitles = async () => {

    // 判断是否选择了语言
    if (!subtitlesForm.language) {
        ShowMsgTip(ShowMsgTip.MsgType.warning, "请选择要删除的语言")
        return
    }

    // 请求参数
    const params: DeleteSubtitlesRequest = {
        file_id: editMediaData.file_id,
        language: subtitlesForm.language
    }

    await deleteSubtitlesAPI(params).then((res) => {
        if (res.data.code === ResponseCode.SubtitlesDeleteSuccess) {
            emit('delete-subtitles', subtitlesForm.language)
            // 将form清空
            subtitlesForm.language = ""
            subtitlesForm.label = ""
            subtitlesForm.subtitles = ""

            ShowMsgTip(ShowMsgTip.MsgType.success, "删除成功", 3000)
        } else {
            let errMsg = res.data.msg || "删除失败"
            if (res.data.data) {
                errMsg = res.data.msg + "：" + res.data.data
            }
            ShowMsgTip(ShowMsgTip.MsgType.error, errMsg)
        }
    })
}


const getSubtitles = async (language: string) => {

    const hashID = editMediaData.file_name.split(".")[0]

    await getSubtitlesAPI(hashID, language).then((res) => {
        if (res.data.code === ResponseCode.GetVideoSubtitlesSuccess) {
            subtitlesForm.language = language
            subtitlesForm.subtitles = res.data.data.subtitles
            subtitlesForm.label = res.data.data.label
        } else {
            let errMsg = res.data.msg || "获取字幕失败"
            if (res.data.data) {
                errMsg = res.data.msg + "：" + res.data.data
            }
            ShowMsgTip(ShowMsgTip.MsgType.error, errMsg)
        }
    })

}


// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
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
        deep: true
    }
)


</script>

<style lang="scss" scoped>
// 左中右布局
.edit-media-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;

    .left {
        width: 25%;
        display: flex;
        //    水平居中，垂直靠上
        justify-content: center;
        align-items: flex-start;

        .view {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .middle {
        width: 25%;
        position: relative;

        margin: 0 30px;

        // 前后竖线
        &::before,
        &::after {
            content: '';
            position: absolute;
            top: 0;
            width: 1px;
            height: 100%;
            background-color: #ccc;
        }

        &::before {
            left: -15px; // 调整位置
        }

        &::after {
            right: -15px; // 调整位置
        }

    }

    .right {
        width: 50%;

        .multi-btn {
            //   多行按钮
            display: flex;
            flex-wrap: wrap; // 换行
        }

        .multi-btn-item {
            margin: 5px;
            width: 80px; // 固定宽度
        }
    }

    .btn-submit {
        display: flex;
        justify-content: center
    }
}
</style>
