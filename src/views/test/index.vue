<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-27 20:39:43
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <el-upload v-model:file-list="fileList" drag class="upload-demo"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple :on-preview="handlePreview"
    :on-remove="handleRemove" :before-remove="beforeRemove" :limit="3" :on-exceed="handleExceed" :data="getData"
    :http-request="httpRequest">
    <Icon :name="IconKeys.UploadFilled" custom-class="icon-upload-filled" />
    <div class="el-upload__text">
      将文件拖放到此处或<em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        文件大小小于 500kb 的 jpg/png 文件。
      </div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { IconKeys } from '@/components/common/icons'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { uploadFile } from '@/api/utils/uploadFile'
import { ShowMsgTip } from '@/utils/message'
import { MsgType } from '@/components/common'
import { UploadCode } from '@/api/responseCode'
import { dataType } from 'element-plus/es/components/table-v2/src/common.mjs'

const fileList = ref<UploadUserFile[]>([
  {
    name: 'element-plus-logo.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
  {
    name: 'element-plus-logo2.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
])

const getData = (data) => {
  console.log("1", data)
}

const httpRequest = (data) => {
  console.log("2", data)
}
// function httpRequest(formData: FormData) {
//   // 调用 uploadAvatar 函数
//   uploadFile(formData)
//     .then((response) => {
//       if (response.data.code === UploadCode.Success) {
//         ShowMsgTip(MsgType.success, response.data.msg, 2000)
//         return
//       } else {
//         ShowMsgTip(MsgType.error, response.data.msg + '：' + response.data.data)
//         return
//       }
//     })
//     .catch(() => {
//       ShowMsgTip(MsgType.error, '上传失败，请重试')
//     })
// }



const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
    } totally`
  )
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
}
</script>
<style scoped lang="scss">
.icon-upload-filled {
  font-size: 6em;
  fill: $primary-color;
}
</style>
