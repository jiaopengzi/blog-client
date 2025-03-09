<!--
 * @FilePath     : \blog-client\src\components\common\avatar-upload\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 头像上传
-->

<template>
    <div class="avatar-upload">
        <el-button type="primary" @click="toggleCropperVisible">编辑头像</el-button>

        <el-dialog v-model="cropperVisible" width="500px" content-class="dialog-content">
            <template #header>
                <h3>编辑头像</h3>
            </template>

            <!-- 图片选择 -->
            <el-button type="primary" @click="openFileDialog">选择文件</el-button>
            <input type="file" ref="fileInput" accept="image/*" @change="onFileChange" style="display: none" />
            <!-- 选择后预览容器 -->

            <!-- 文档参考1:https://fengyuanchen.github.io/cropperjs/zh/guide.html -->
            <!-- 文档参考2:https://fengyuanchen.github.io/cropperjs/zh/playground.html -->
            <div v-if="!imgURL" class="cropper-image-tip">请选择头像图片</div>
            <cropper-canvas v-if="imgURL" background class="cropper-canvas">
                <cropper-image :src="imgURL" alt="图片" rotatable scalable skewable translatable></cropper-image>
                <cropper-shade hidden></cropper-shade>
                <cropper-handle action="select" plain></cropper-handle>
                <cropper-selection ref="cropperSelectionRef" initial-coverage="0.5" movable resizable>
                    <cropper-grid role="grid" covered></cropper-grid>
                    <cropper-crosshair centered></cropper-crosshair>
                    <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
                    <cropper-handle action="n-resize"></cropper-handle>
                    <cropper-handle action="e-resize"></cropper-handle>
                    <cropper-handle action="s-resize"></cropper-handle>
                    <cropper-handle action="w-resize"></cropper-handle>
                    <cropper-handle action="ne-resize"></cropper-handle>
                    <cropper-handle action="nw-resize"></cropper-handle>
                    <cropper-handle action="se-resize"></cropper-handle>
                    <cropper-handle action="sw-resize"></cropper-handle>
                </cropper-selection>
            </cropper-canvas>

            <template #footer>
                <div class="button-group">
                    <el-button type="primary" @click="uploadImage">应用</el-button>
                    <el-button type="primary" @click="toggleCropperVisible">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import "cropperjs"

import { type CropperSelection } from "cropperjs"
import { ElButton, ElDialog } from "element-plus"
import { ref, useTemplateRef } from "vue"

import { MessageUtil } from "@/utils/message"

import { uploadAvatar } from "./uploadAvatar"

defineOptions({ name: "AvatarUpload" })

const emit = defineEmits<{
    (event: "avatar-upload-url", value: string): void // 头像上传地址
}>()

const imgURL = ref<string>("") // 图片地址

const cropperVisible = ref(false)

const fileInput = useTemplateRef<HTMLInputElement | null>("fileInput")
const cropperSelectionRef = useTemplateRef<CropperSelection | null>("cropperSelectionRef")

// 切换 cropperVisible 状态
const toggleCropperVisible = () => {
    cropperVisible.value = !cropperVisible.value
}

// 打开文件选择器
const openFileDialog = () => {
    fileInput.value?.click()
}

/**
 * @description: 选择文件后触发
 * @param e: Event 事件
 */
function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    // 检查文件大小
    const maxFileSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxFileSize) {
        MessageUtil.warning("请选择小于 10MB 的图片")
        return
    }

    const url = URL.createObjectURL(file)

    imgURL.value = url
}

// 上传图片
async function uploadImage() {
    if (!cropperSelectionRef.value) {
        MessageUtil.error("无法获取裁剪器")
        return
    }
    const canvas = await cropperSelectionRef.value.$toCanvas()
    canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) {
            MessageUtil.error("无法获取裁剪后的图像")
            return
        }

        const file = new File([blob], "avatar.png", { type: blob.type })
        const imageUrl = await uploadAvatar(file)

        // 上传成功后触发事件
        if (imageUrl) {
            emit("avatar-upload-url", imageUrl)
            cropperVisible.value = false
            MessageUtil.success("上传成功")
        }
    })
}
</script>

<style scoped lang="scss">
.avatar-upload {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
}

.dialog-content {
    display: flex;
    justify-content: center;
}

.cropper-canvas {
    margin: 20px 0;
    width: 100%;
    height: 400px;
    overflow: hidden;
    position: relative;
}

.cropper-image-tip {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 400px;
    font-size: 20px;
    color: var(--jpz-text-color-primary);
}

.button-group {
    display: flex;
    // 居中显示
    justify-content: center;
    width: 100%;
}
</style>
