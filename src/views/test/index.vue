<template>
  <div>
    <input type="file" @change="onFileChange" />
    <button @click="uploadFile">Upload</button>
    <p v-if="progress > 0">Upload Progress: {{ progress }}%</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'

const file = ref<File | null>(null)
const progress = ref<number>(0)

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  file.value = target.files?.[0] || null
}

const uploadFile = () => {
  if (!file.value) {
    console.error('No file selected')
    return
  }

  const signedUrl = 'https://jiaopengzi-image.oss-cn-chengdu.aliyuncs.com/2024/08/09/120-7f7c2971/6.png?x-oss-credential=LTAI5t8E6bUfAieYzkiYQKtH%2F20240809%2Fcn-chengdu%2Foss%2Faliyun_v4_request\u0026x-oss-date=20240809T005702Z\u0026x-oss-expires=60\u0026x-oss-signature=5453e0abcce42d388105b59a12605cd6b06be8076e84592c691dfb1818f41c6c\u0026x-oss-signature-version=OSS4-HMAC-SHA256' // 签名URL

  const reader = new FileReader()
  reader.readAsArrayBuffer(file.value)
  reader.onload = function (event) {
    const arrayBuffer = event.target?.result as ArrayBuffer | null

    if (arrayBuffer) {
      axios.put(signedUrl, arrayBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'x-oss-meta-user': 'jack',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log(percentCompleted)
            progress.value = percentCompleted
          }
        },
      })
        .then((response) => {
          console.log(response.data)
          // Reset the progress after the upload is completed
          progress.value = 0
        })
        .catch((error) => {
          console.error(error)
          // Reset the progress in case of an error
          progress.value = 0
        })
    }
  }
}
</script>