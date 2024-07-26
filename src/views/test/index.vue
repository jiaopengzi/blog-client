<template>
  <div>
    <input type="file" @change="onFileChange" />
    <p>{{ hash }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import crypto from 'crypto-js'

// 算法枚举
enum HashAlgorithm {
  SHA256 = 'SHA-256',
  SHA384 = 'SHA-384',
  SHA512 = 'SHA-512',
}

/**
 * @description: 将data读取为ArrayBuffer
 * @param data Blob或File对象
 * @return ArrayBuffer
 */
function readFileAsArrayBuffer(data: Blob | File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader() // 创建文件读取器
    reader.onload = () => resolve(reader.result as ArrayBuffer) // 读取成功，返回结果
    reader.onerror = reject // 读取失败，抛出错误
    reader.readAsArrayBuffer(data) // 读取data为ArrayBuffer
  })
}



const hash = ref('');

const onFileChange = async (event: any) => {
  const file = event.target.files[0];
  if (file) {
    // 将文件切片 5M 一片 增量计算哈希值

    // 计算分片数量
    const chunkSize = 5 * 1024 * 1024; // 5M
    const chunkCount = Math.ceil(file.size / chunkSize);

    // 使用 for 循环计算每个分片的哈希值
    const fileHash = crypto.algo.SHA256.create()



    for (let i = 0; i < chunkCount; i++) {
      const start = i * chunkSize;
      const end = Math.min((i + 1) * chunkSize, file.size);
      const chunk = file.slice(start, end);

      const arrayBuffer = await readFileAsArrayBuffer(chunk) // 将文件块读取为ArrayBuffer
      const wordArray = crypto.lib.WordArray.create(arrayBuffer) // 创建WordArray

      fileHash.update(wordArray)



    }



    hash.value = fileHash.finalize().toString()

  }
};
</script>
