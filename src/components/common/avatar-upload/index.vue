<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 17:31:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 09:12:44
 * @FilePath     : \blog-client\src\components\common\avatar-upload\index.vue
 * @Description  : 头像上传
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
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
            <input
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="onFileChange"
                style="display: none"
            />
            <!-- 选择后预览容器 -->
            <div ref="cropperContainer" class="cropper-container"></div>

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
import { ref, onUnmounted, useTemplateRef } from "vue"
import Cropper from "cropperjs"
import "cropperjs/dist/cropper.min.css"
import { ElButton, ElDialog } from "element-plus"
import { ShowMsgTip } from "@/utils/message"
import { uploadAvatar } from "./uploadAvatar"

defineOptions({ name: "AvatarUpload" })

// 数据
const props = defineProps({
    avatar_user_id: {
        type: String,
        default: undefined, // 如果不传递，则默认为 undefined
    },
})

const emit = defineEmits<{
    (event: "avatar-upload-url", value: string): void // 头像上传地址
}>()

const cropperVisible = ref(false)

const fileInput = useTemplateRef<HTMLInputElement | null>("fileInput")
const cropperContainer = useTemplateRef<HTMLDivElement | null>("cropperContainer")

let cropperInstance: Cropper | null = null

// 切换 cropperVisible 状态
const toggleCropperVisible = () => {
    cropperVisible.value = !cropperVisible.value
}

// 打开文件选择器
const openFileDialog = () => {
    fileInput.value?.click()
}

/**
 * @description: 打开裁剪器
 */
function openCropper() {
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
        ShowMsgTip(ShowMsgTip.MsgType.warning, "请选择小于 10MB 的图片")
        return
    }

    const url = URL.createObjectURL(file)
    initCropper(url)
}

// 初始化裁剪器
function initCropper(url: string) {
    if (cropperInstance) {
        cropperInstance.destroy() // 销毁之前的裁剪器
    }

    const imageWrapper = document.createElement("div") // 创建一个 div 用于包裹图片
    const image = new Image() // 创建一个图片元素

    // 图片加载完成后初始化裁剪器
    image.addEventListener("load", () => {
        cropperInstance = new Cropper(image, {
            aspectRatio: 1, // 裁剪框比例
            viewMode: 3, // 显示模式
            autoCropArea: 1, // 自动裁剪区域
            background: false, // 背景
        })
    })

    image.src = url // 设置图片地址
    imageWrapper.appendChild(image) // 将图片添加到包裹元素中

    // 将包裹元素添加到裁剪器容器中
    if (cropperContainer.value) {
        cropperContainer.value.innerHTML = ""
        cropperContainer.value.appendChild(imageWrapper)
    }

    cropperVisible.value = true // 显示裁剪器
}

// 上传图片
function uploadImage() {
    if (cropperInstance) {
        cropperInstance.getCroppedCanvas().toBlob(async (blob: Blob | null) => {
            if (!blob) {
                ShowMsgTip(ShowMsgTip.MsgType.error, "无法获取裁剪后的图像")
                return
            }

            const file = new File([blob], "avatar.png", { type: blob.type })
            const imageUrl = await uploadAvatar(file)

            // 上传成功后触发事件
            if (imageUrl) {
                emit("avatar-upload-url", imageUrl)
                cropperVisible.value = false
                ShowMsgTip(ShowMsgTip.MsgType.success, "上传成功")
            }
        })
    } else {
        ShowMsgTip(ShowMsgTip.MsgType.warning, "请先选择并裁剪图片")
    }
}

// 组件销毁时销毁裁剪器实例
onUnmounted(() => {
    if (cropperInstance) {
        cropperInstance.destroy()
    }
})

// 导出方法
defineExpose({
    openCropper,
    onFileChange,
    initCropper,
    uploadImage,
})
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

.cropper-container {
    margin-top: 20px;
    overflow: hidden;
    position: relative;
}

img {
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.button-group {
    display: flex;
    /* 居中显示 */
    justify-content: center;
    width: 100%;
    margin: 10px 0;
}

.my-el-upload {
    display: none;
}
</style>
