/**
 * @FilePath     : \blog-client\src\utils\hash.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 哈希计算器
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import crypto from "crypto-js"

// 算法枚举
export enum HashAlgorithm {
    SHA256 = "SHA-256",
    SHA384 = "SHA-384",
    SHA512 = "SHA-512",
}

//  哈希计算器类
export class HashCalculator {
    protected algorithm: HashAlgorithm // 存储哈希算法的名称
    protected hashFunction: any // hash函数
    protected chunkSize: number // 块大小

    constructor(algorithm: HashAlgorithm = HashAlgorithm.SHA256, chunkSize: number = 1024 * 1024) {
        this.algorithm = algorithm // 保存哈希算法 默认哈希算法为SHA-256
        this.chunkSize = chunkSize // 保存块大小 默认块大小为 1024 * 1024 字节即 1MB
        this.hashFunction = this.createHashFunction() // 创建hash函数
    }

    // 创建一个hash函数 用于计算整个文件的hash
    private createHashFunction = (): any => {
        switch (this.algorithm) {
            case HashAlgorithm.SHA256:
                return crypto.algo.SHA256.create()
            case HashAlgorithm.SHA384:
                return crypto.algo.SHA384.create()
            case HashAlgorithm.SHA512:
                return crypto.algo.SHA512.create()
            default:
                throw new Error(`Unsupported hash algorithm: ${this.algorithm},should be SHA-256,SHA-384,SHA-512`)
        }
    }

    /**
     * @description: 将data读取为ArrayBuffer
     * @param {Blob | File} data Blob或File对象
     * @return  ArrayBuffer
     */
    protected readFileAsArrayBuffer = (data: Blob | File): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader() // 创建文件读取器
            reader.onload = () => resolve(reader.result as ArrayBuffer) // 读取成功，返回结果
            reader.onerror = reject // 读取失败，抛出错误
            reader.readAsArrayBuffer(data) // 读取data为ArrayBuffer
        })
    }

    /**
     * @description: 增量计算文件块的哈希值
     * @param blob 文件块 Blob
     */
    updateIncrementalHash = async (blob: Blob) => {
        const arrayBuffer = await this.readFileAsArrayBuffer(blob) // 将文件块读取为ArrayBuffer
        const wordArray = crypto.lib.WordArray.create(arrayBuffer) // 创建WordArray
        this.hashFunction.update(wordArray) // 更新hash
    }

    // 获取整个文件的 hash 值
    getWholeFileHash = (): string => {
        const hash = this.hashFunction.finalize().toString() // 保存计算结果
        return hash // 保存计算结果
    }
    // 获取算法
    getAlgorithm = (): HashAlgorithm => {
        return this.algorithm
    }

    // 获取hash函数
    getHashFunction = (): any => {
        return this.hashFunction
    }

    /**
     * @description: 计算文件块的哈希值
     * @param data 文件块 Blob 或 File 对象
     * @param algorithm 哈希算法，可以是 'SHA-256', 'SHA-384', 'SHA-512'，默认是 'SHA-256'
     * @return 哈希值
     */
    calcHash = async (data: Blob | File): Promise<string> => {
        const arrayBuffer = await this.readFileAsArrayBuffer(data) // 将文件块读取为ArrayBuffer
        const wordArray = crypto.lib.WordArray.create(arrayBuffer) // 创建WordArray
        let chunkHash
        switch (this.algorithm) {
            case HashAlgorithm.SHA256:
                chunkHash = crypto.SHA256(wordArray)
                break
            case HashAlgorithm.SHA384:
                chunkHash = crypto.SHA384(wordArray)
                break
            case HashAlgorithm.SHA512:
                chunkHash = crypto.SHA512(wordArray)
                break
            default:
                throw new Error(`Unsupported hash algorithm: ${this.algorithm},should be SHA-256,SHA-384,SHA-512`)
        }

        return chunkHash.toString()
    }

    /**
     * @description: 计算文件的第一个块的哈希值
     * @param file 文件对象
     * @return  Promise<string>
     */
    getFirstChunkHash = async (file: File): Promise<string> => {
        const blob = file.slice(0, this.chunkSize)
        return this.calcHash(blob)
    }
}
