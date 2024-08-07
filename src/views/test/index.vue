<template>
  <div>
    <input type="file" @change="onFileChange" />
    <button @click="uploadFile">Upload</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'

const file = ref(null)

const onFileChange = (e: any) => {
  file.value = e.target.files[0]
}

const uploadFile = () => {
  if (!file.value) {
    console.error('No file selected')
    return
  }

  const signedUrl = 'https://jiaopengzi-image.oss-cn-chengdu.aliyuncs.com/blog/uploads/6.png?x-oss-credential=LTAI5tERcFBucGpvadG8jktr%2F20240807%2Fcn-chengdu%2Foss%2Faliyun_v4_request&x-oss-date=20240807T123915Z&x-oss-expires=6000&x-oss-signature=e53f214ce97aca2e6a0c21bf9f38676f51c4058e4d9d45b39ad5a81475137bfe&x-oss-signature-version=OSS4-HMAC-SHA256' // 签名URL

  const reader = new FileReader()
  reader.readAsArrayBuffer(file.value)
  reader.onload = function (event) {
    const arrayBuffer = reader.result

    axios.put(signedUrl, arrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'x-oss-meta-user': 'jack',
      },
    })
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error))
  }
}
</script>

<style scoped lang="scss">
/* Add your styles here */
</style>
