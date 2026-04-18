/**
 * @FilePath     : \blog-client\src\utils\splitWorker.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 文件分片计算 hash 的 web worker
 */

import { HashCalculator } from "@/utils/hash"

// 监听主线程发送的消息
onmessage = function (e) {
    const { chunks, algorithm } = e.data
    for (const chunk of chunks) {
        const { calcHash } = new HashCalculator(algorithm)
        calcHash(chunk.blob).then((hash) => {
            chunk.hash_key = hash
            chunk.hash_algorithm = algorithm
            postMessage([chunk])
        }).catch((err) => {
            postMessage({ error: err?.message || String(err) })
        })
    }
}
