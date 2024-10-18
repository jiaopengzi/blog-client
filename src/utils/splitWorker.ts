/**
 * @Author       : jiaopengzi
 * @Date         : 2024-07-23 15:28:35
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-02 14:25:47
 * @FilePath     : \blog-client\src\utils\splitWorker.ts
 * @Description  : 文件分片计算hash的web worker
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
        })
    }
}
