/**
 * @FilePath     : \blog-client\src\utils\chunkUpload.ts
 */

import crypto from 'crypto-js'
import { EventEmitter } from '@/utils/eventEmitter'
import { Task, TaskQueue } from '@/utils/task'

export interface Chunk {
  blob: Blob // 分片的二进制数据
  start: number // 分片的起始位置
  end: number // 分片的结束位置
  hash: string // 分片的hash值
  index: number // 分片在文件中的索引
}

// 分片的相关事件
// chunks: 一部分分片产生了
// wholeHash: 整个文件的hash计算完成
// drain: 所有分片处理完成
export type ChunkSplitorEvents = 'chunks' | 'wholeHash' | 'drain'

// 创建一个不带hash的分片
function createChunkWithoutHash(file: File, index: number, chunkSize: number): Chunk {
  const start = index * chunkSize
  const end = Math.min((index + 1) * chunkSize, file.size)
  const blob = file.slice(start, end)
  return {
    blob,
    start,
    end,
    hash: '',
    index,
  }
}

// 分片文件哈希计算类
export abstract class ChunkSplitor extends EventEmitter<ChunkSplitorEvents> {
  protected chunkSize: number // 分片大小（单位字节）
  protected file: File // 待分片的文件
  protected fileHash?: string // 整个文件的hash
  protected chunks: Chunk[] // 分片列表
  private hashFunction: any // hash函数
  private handleChunkCount = 0 // 已计算hash的分片数量
  private hasSplited = false // 是否已经分片
  protected algorithm: 'SHA-256' | 'SHA-384' | 'SHA-512' // 存储哈希算法的名称
  constructor(
    file: File,
    chunkSize: number = 1024 * 1024 * 5,
    algorithm: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256',
  ) {
    super()
    this.file = file
    this.chunkSize = chunkSize
    this.algorithm = algorithm
    // 获取分片数组
    const chunkCount = Math.ceil(this.file.size / this.chunkSize)
    this.chunks = new Array(chunkCount)
      .fill(0)
      .map((_, index) => createChunkWithoutHash(this.file, index, this.chunkSize))
    this.hashFunction = this.createHashFunction()
  }

  // 创建一个hash函数 用于计算整个文件的hash
  private createHashFunction() {
    switch (this.algorithm) {
      case 'SHA-256':
        console.log('algorithm1', this.algorithm)
        return crypto.algo.SHA256.create()
      case 'SHA-384':
        console.log('algorithm2', this.algorithm)
        return crypto.algo.SHA384.create()

      case 'SHA-512':
        console.log('algorithm3', this.algorithm)
        return crypto.algo.SHA512.create()
      default:
        console.log('algorithm4', this.algorithm)
        throw new Error(`Unsupported hash algorithm: ${this.algorithm}`)
    }
  }

  split() {
    if (this.hasSplited) {
      return
    }
    this.hasSplited = true
    const emitter = new EventEmitter<'chunks'>()
    const chunksHanlder = (chunks: Chunk[]) => {
      this.emit('chunks', chunks)
      chunks.forEach((chunk) => {
        this.hashFunction.update(chunk.hash)
      })
      this.handleChunkCount += chunks.length
      if (this.handleChunkCount === this.chunks.length) {
        // 计算完成
        emitter.off('chunks', chunksHanlder)
        this.emit('wholeHash', this.hashFunction.finalize().toString())
        this.emit('drain')
      }
    }
    emitter.on('chunks', chunksHanlder)
    this.calcHash(this.chunks, emitter)
  }

  // 计算每一个分片的hash
  abstract calcHash(chunks: Chunk[], emitter: EventEmitter<'chunks'>): void

  // 分片完成后一些需要销毁的工作
  abstract dispose(): void
}

export class MultiThreadSplitor extends ChunkSplitor {
  private workers: Worker[] = new Array(navigator.hardwareConcurrency || 4).fill(0).map(
    () =>
      new Worker(new URL('./SplitWorker.ts', import.meta.url), {
        type: 'module',
      }),
  )

  async calcHash(chunks: Chunk[], emitter: EventEmitter<'chunks'>): Promise<void> {
    const workerSize = Math.ceil(chunks.length / this.workers.length)
    const promises: Promise<void>[] = []
    for (let i = 0; i < this.workers.length; i++) {
      const worker = this.workers[i]
      const start = i * workerSize
      const end = Math.min((i + 1) * workerSize, chunks.length)
      const workerChunks = chunks.slice(start, end)

      worker.postMessage({
        chunks: workerChunks,
        algorithm: this.algorithm, // 将算法名称传递给 Worker
      })

      const promise = new Promise<void>((resolve, reject) => {
        worker.onmessage = (e) => {
          emitter.emit('chunks', e.data)
          resolve()
        }
        worker.onerror = (e) => {
          reject(e)
        }
      })

      promises.push(promise)
    }
    await Promise.all(promises)
  }

  dispose(): void {
    this.workers.forEach((worker) => worker.terminate())
  }
}

// 请求策略
export interface RequestStrategy {
  // 文件创建请求，返回token
  createFile(file: File): Promise<string>
  // 分片上传请求
  uploadChunk(chunk: Chunk): Promise<void>
  // 文件合并请求，返回文件url
  mergeFile(token: string): Promise<string>
  // hash校验请求
  patchHash<T extends 'file' | 'chunk'>(
    token: string,
    hash: string,
    type: T,
  ): Promise<
    T extends 'file' ? { hasFile: boolean } : { hasFile: boolean; rest: number[]; url: string }
  >
}

export class UploadController extends EventEmitter<'start' | 'progress' | 'end' | 'error'> {
  private requestStrategy: RequestStrategy // 请求策略，没有传递则使用默认策略
  private chunkSplitor: ChunkSplitor // 分片策略，没有传递则默认多线程分片
  private taskQueue: TaskQueue // 任务队列
  private file: File // 需要上传的文件
  private token: string | undefined // 文件token

  constructor(file: File, requestStrategy: RequestStrategy, chunkSplitor: ChunkSplitor) {
    super()
    this.file = file
    this.requestStrategy = requestStrategy
    this.chunkSplitor = chunkSplitor
    this.taskQueue = new TaskQueue()
  }

  // 初始化
  async init() {
    // 获取文件token
    this.token = await this.requestStrategy.createFile(this.file)
    if (!this.token) {
      throw new Error('Failed to get token.')
    }
    // 分片事件监听
    this.chunkSplitor.on('chunks', this.handleChunks.bind(this))
    this.chunkSplitor.on('wholeHash', this.handleWholeHash.bind(this))
    // 开始分片
    this.chunkSplitor.split()
    this.emit('start')
  }

  // 分片事件处理
  private handleChunks(chunks: Chunk[]) {
    // 分片上传任务加入队列
    chunks.forEach((chunk) => {
      this.taskQueue.addAndStart(new Task(this.uploadChunk.bind(this), chunk))
    })
  }

  async uploadChunk(chunk: Chunk) {
    // hash校验
    const resp = await this.requestStrategy.patchHash(this.token!, chunk.hash, 'chunk')
    if (resp.hasFile) {
      // 文件已存在
      this.emit('end', resp.url)
      return
    }
    // 分片上传
    await this.requestStrategy.uploadChunk(chunk)
    this.emit('progress', chunk.end / this.file.size)
  }

  // 整体hash事件处理
  private async handleWholeHash(hash: string) {
    // hash校验
    console.log('hash==============>', hash)
    const resp = await this.requestStrategy.patchHash(this.token!, hash, 'file')
    if (resp.hasFile) {
      // 文件已存在
      if ('url' in resp) {
        this.emit('end', resp.url)
      } else {
        // TODO: Handle the case where url is not defined
        console.error('URL is not defined')
      }
      return
    }
    // 文件合并
    const url = await this.requestStrategy.mergeFile(this.token!)
    this.emit('end', url)
  }
}
