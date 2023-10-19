<template>
    <div class="avatar-upload">
        <el-button type="primary" @click="cropperVisible = true">选择并上传头像</el-button>

        <el-dialog v-model="cropperVisible" width="500px" content-class="dialog-content">
            <input type="file" ref="fileInput" accept="image/*" @change="onFileChange" />
            <div ref="cropperContainer" class="cropper-container"></div>

            <template #footer>
                <div class="button-group">
                    <el-button type="primary" @click="uploadImage">应用</el-button>
                    <el-button type="primary" @click="cropperVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  
<script lang="ts">
import { ref, onUnmounted } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import { ElButton, ElDialog } from 'element-plus';
import { useUserStore } from '@/stores/user'
import { uploadAvatar } from '@/api/utils/UploadAvatar';
import { ShowMsgTip } from '@/utils/Message'
import { MsgType } from '@/components/common/index'
import { UploadCode } from '@/api/responseCode'

export default {
    components: {
        ElButton,
        ElDialog,
    },
    setup() {
        const userStore = useUserStore();
        const fileInput = ref<HTMLInputElement | null>(null);
        const imageSrc = ref('');
        const cropperVisible = ref(false);
        const cropperContainer = ref<HTMLDivElement | null>(null);
        let cropperInstance: Cropper | null = null;

        onUnmounted(() => {
            if (cropperInstance) {
                cropperInstance.destroy();
            }
        });

        function openCropper() {
            fileInput.value?.click();
        }

        function onFileChange(e: Event) {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;

            const url = URL.createObjectURL(file);
            initCropper(url);
        }

        function initCropper(url: string) {
            if (cropperInstance) {
                cropperInstance.destroy();
            }

            const imageWrapper = document.createElement('div');
            const image = new Image();
            image.addEventListener('load', () => {
                cropperInstance = new Cropper(image, {
                    aspectRatio: 1,
                    viewMode: 3,
                    autoCropArea: 1,
                    background: false,
                });
            });
            image.src = url;
            imageWrapper.appendChild(image);

            if (cropperContainer.value) {
                cropperContainer.value.innerHTML = '';
                cropperContainer.value.appendChild(imageWrapper);
            }

            cropperVisible.value = true;
        }
        function uploadImage() {
            if (cropperInstance) {
                cropperInstance.getCroppedCanvas().toBlob((blob: Blob | null) => {
                    if (!blob) {
                        ShowMsgTip(MsgType.error, '无法获取裁剪后的图像')
                        return;
                    }

                    const formData = new FormData();
                    formData.append('avatar', blob, 'avatar.png');
                    // 调用 uploadAvatar 函数
                    uploadAvatar(formData)
                        .then(response => {
                            if (response.data.code === UploadCode.AvatarSuccess) {
                                cropperVisible.value = false;
                                // 处理返回数据，并更新头像等信息
                                userStore.getUserInfoByToken(true) // 强制更新用户信息
                                ShowMsgTip(MsgType.success, response.data.msg, 2000)
                                return;
                            } else {
                                ShowMsgTip(MsgType.error, response.data.msg)
                                return;
                            }

                        })
                        .catch(() => {
                            ShowMsgTip(MsgType.error, "上传失败，请重试")
                        });
                });
            } else {
                ShowMsgTip(MsgType.warning, "请先选择并裁剪图片")
            }
        }



        return { fileInput, imageSrc, cropperVisible, cropperContainer, openCropper, onFileChange, uploadImage };
    },
};
</script>
  
<style scoped>
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
</style>