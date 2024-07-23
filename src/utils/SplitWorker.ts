/**
 * @Author       : jiaopengzi
 * @Date         : 2024-07-23 15:28:35
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-07-23 19:09:03
 * @FilePath     : \blog-client\src\utils\SplitWorker.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import crypto from 'crypto-js'

/**
 * @description: 将data读取为ArrayBuffer
 * @param data Blob或File对象
 * @return ArrayBuffer
 */
export function readFileAsArrayBuffer(data: Blob | File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader() // 创建文件读取器
    reader.onload = () => resolve(reader.result as ArrayBuffer) // 读取成功，返回结果
    reader.onerror = reject // 读取失败，抛出错误
    reader.readAsArrayBuffer(data) // 读取data为ArrayBuffer
  })
}

/**
 * @description: 计算文件块的哈希值
 * @param data 文件块 Blob 或 File 对象
 * @param algorithm 哈希算法，可以是 'SHA-256', 'SHA-384', 'SHA-512'，默认是 'SHA-256'
 * @return 哈希值
 */
export async function calcHash(
  data: Blob | File,
  algorithm: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256',
): Promise<string> {
  const arrayBuffer = await readFileAsArrayBuffer(data) // 将文件块读取为ArrayBuffer
  const wordArray = crypto.lib.WordArray.create(arrayBuffer) // 创建WordArray
  let chunkHash
  switch (algorithm) {
    case 'SHA-256':
      chunkHash = crypto.SHA256(wordArray)
      break
    case 'SHA-384':
      chunkHash = crypto.SHA384(wordArray)
      break
    case 'SHA-512':
      chunkHash = crypto.SHA512(wordArray)
      break
    default:
      throw new Error(`Unsupported hash algorithm: ${algorithm}`)
  }
  return chunkHash.toString()
}

// 监听主线程发送的消息
onmessage = function (e) {
  const { chunks, algorithm } = e.data
  for (const chunk of chunks) {
    calcHash(chunk.blob, algorithm).then((hash) => {
      chunk.hash = hash
      postMessage([chunk])
    })
  }
}
