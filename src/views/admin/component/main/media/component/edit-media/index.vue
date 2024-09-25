<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 10:24:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-25 12:17:14
 * @FilePath     : \blog-client\src\views\admin\component\main\media\component\edit-media\index.vue
 * @Description  : 编辑媒体
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="edit-media-page">

        <div class="view">
            <img class="thumbnail-img" v-if="editMediaData.img?.url" :src="editMediaData.img.url"
                :style="imgStyle(editMediaData.img?.width, editMediaData.img?.height, editMediaData.img?.imgFit)" />
            <Icon v-else-if="editMediaData.img?.iconKeyName" :name="editMediaData.img?.iconKeyName"
                :style="iconStyle(editMediaData.img?.fontSize)" />
        </div>

        <el-form :label-position="labelPosition" label-width="100px" ref="editMediaFormRef" :model="editMediaForm"
            class="edit-media-form" :size="formSize" status-icon>

            <el-form-item label="文件ID" prop="file_ID">
                <el-input v-model.trim="editMediaForm.file_ID" disabled />
            </el-form-item>

            <el-form-item label="文件名" prop="file_name_display">
                <el-input v-model.trim="editMediaForm.file_name_display" />
            </el-form-item>

            <el-form-item label="视频免费" prop="is_free">
                <el-switch class="switch" v-model="editMediaForm.is_free" inline-prompt active-text="免费"
                    inactive-text="收费" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
            </el-form-item>


            <el-form-item label="文件别名" prop="slug">
                <el-input v-model="editMediaForm.slug" />
            </el-form-item>

            <el-form-item label="说明" prop="description">
                <el-input v-model="editMediaForm.description" type="textarea" placeholder="文件说明" />
            </el-form-item>

            <el-form-item label="视频字幕" prop="subtitles">
                <el-input v-model="editMediaForm.subtitles" type="textarea" :placeholder="subtitlesPlaceholder" />
            </el-form-item>

            <div class="btn-submit">
                <el-form-item>
                    <el-button type="primary" @click="submitForm(editMediaFormRef as FormInstance)">更新</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRef, onBeforeMount, watch, useTemplateRef } from 'vue'
import type { EditMediaProps, EditMediaForm } from '@/views/admin/component/main/media/component/edit-media'

import { imgStyle, iconStyle } from '@/utils/style'
import { ShowMsgTip } from '@/utils/message'
import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S
import { ResponseCode } from '@/api/responseCode'

import AvatarInitials from '@/components/common/avatar-initials'
import AvatarUpload from '@/components/common/avatar-upload'

defineOptions({ name: 'EditMedia' })

// props
const { editMediaData } = defineProps<{
    editMediaData: EditMediaProps // 编辑媒体数据
}>()


// emits
const emit = defineEmits<{
    (event: 'edit-media-status', value: boolean): void // 编辑Media状态
}>()


// 表单label位置 top | left | right
const labelPosition = ref('left')

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('large')

// 默认时间为当前日期
const defaultTime = new Date()


// 表单实例
const editMediaFormRef = useTemplateRef<FormInstance>("editMediaFormRef")


// 表单数据
const editMediaForm = reactive<EditMediaForm>({
    file_ID: "", // 文件ID
    file_name_display: "", // 显示名称
    description: "", // 描述
    slug: "", // 文件别名
    is_free: false, // 是否免费
    subtitles: "", // 字幕
})

const updateEditMediaForm = (data: EditMediaProps) => {
    editMediaForm.file_ID = data.file_ID
    editMediaForm.file_name_display = data.file_name_display
    editMediaForm.description = data.description
    editMediaForm.slug = data.slug
    editMediaForm.is_free = data.is_free
    editMediaForm.subtitles = data.subtitles
}


const subtitlesPlaceholder = ref(`支持的字幕格式：.webvtt
示例：
WEBVTT

1
00:00:00.000 --> 00:00:03.000
Hello, world!

2
00:00:03.000 --> 00:00:06.000
This is a WebVTT file.
`)


/**
 * @description: 提交表单
 * @param formEl 表单实例
 * @param fields 表单字段
 * @return  void
 */
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
}

// 监控 props.editUserData 变化 更新页面数据
watch(
    () => editMediaData,
    (newVal) => {
        updateEditMediaForm(newVal) // 更新表单数据
    },
    {
        // 立即执行
        immediate: true,

        deep: true
    }
)

onBeforeMount(() => {

})

</script>

<style lang="scss" scoped>
.edit-media-page {
    display: flex;
    align-items: center;
}

.edit-media-form {
    width: 400px;
}

.edit-avatar-div {
    // border-top: 2px solid #ebebeb;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.edit-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 30px 10px 0;
}

.generate-password {
    flex: 5;
}

.btn-generate-password {
    flex: 2;
}

.btn-generate-password {
    width: 120px;
    margin-left: 10px;
    padding: 0 10px;
    height: 40px;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    color: #333;
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}
</style>