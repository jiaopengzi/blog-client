/**
 * @FilePath     : \blog-client\src\utils\chunkUpload.ts
 */

import crypto from 'crypto-js'
import { EventEmitter } from '@/utils/eventEmitter'
import { Task, TaskQueue } from '@/utils/task'
import { HashAlgorithm, getFirstChunkHash } from '@/utils/splitWorker'
import { type ConfirmBeforeUploadRequest } from '@/api/upload/confirmBeforeUpload'
import { type ChunkMetadataWithoutFileId } from '@/api/upload/chunk'
import { readFileAsArrayBuffer } from '@/utils/splitWorker'

export interface Chunk extends ChunkMetadataWithoutFileId {
  blob: Blob // 分片的二进制数据
}

// 分片的相关事件
// chunks: 一部分分片产生了
// wholeHash: 整个文件的hash计算完成
// drain: 所有分片处理完成
export type ChunkSplitorEvents = 'chunks' | 'wholeHash' | 'drain'

// 创建一个不带hash的分片
function createChunkWithoutHash(file: File, index: number, chunkSize: number): Chunk {
  // 计算分片数量
  const partNumbers = Math.ceil(file.size / chunkSize)
  // 判断 index 是否超出分片数量
  if (index >= partNumbers) {
    throw new Error(`Index ${index} is out of range. Part numbers is ${partNumbers}.`)
  }

  const start = index * chunkSize
  const end = Math.min((index + 1) * chunkSize, file.size)
  const blob = file.slice(start, end)
  return {
    blob,
    start,
    end,
    hash_key: '',
    part_index: index,
    hash_algorithm: '',
    part_numbers: partNumbers,
  }
}

// 分片文件哈希计算类
export abstract class ChunkSplitor extends EventEmitter<ChunkSplitorEvents> {
  public chunkSize: number // 分片大小（单位字节）
  public algorithm: HashAlgorithm // 存储哈希算法的名称
  public partNumbers: number // 分片数量
  protected file: File // 待分片的文件
  protected fileHash?: string // 整个文件的hash
  protected chunks: Chunk[] // 分片列表
  private hashFunction: any // hash函数
  private handleChunkCount = 0 // 已计算hash的分片数量
  private hasSplited = false // 是否已经分片

  constructor(
    file: File,
    chunkSize: number = 1024 * 1024 * 10, // 默认分片大小为10MB
    algorithm: HashAlgorithm = HashAlgorithm.SHA256, // 默认哈希算法为SHA-256
  ) {
    super()
    this.file = file
    this.chunkSize = chunkSize
    this.algorithm = algorithm
    this.partNumbers = Math.ceil(file.size / chunkSize)

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
      case HashAlgorithm.SHA256:
        return crypto.algo.SHA256.create()
      case HashAlgorithm.SHA384:
        return crypto.algo.SHA384.create()
      case HashAlgorithm.SHA512:
        return crypto.algo.SHA512.create()
      default:
        throw new Error(
          `Unsupported hash algorithm: ${this.algorithm},shuold be SHA-256,SHA-384,SHA-512`,
        )
    }
  }

  protected async updateIncrementalHash(chunk: Chunk) {
    const arrayBuffer = await readFileAsArrayBuffer(chunk.blob) // 将文件块读取为ArrayBuffer
    const wordArray = crypto.lib.WordArray.create(arrayBuffer) // 创建WordArray
    this.hashFunction.update(wordArray) // 更新hash
  }

  // 分片文件
  split() {
    if (this.hasSplited) {
      return
    }
    this.hasSplited = true
    const emitter = new EventEmitter<'chunks'>() // 用于分片计算hash的事件触发器

    // 监听chunks事件，计算每一个分片的hash
    const chunksHanlder = async (chunks: Chunk[]) => {
      this.emit('chunks', chunks)

      this.handleChunkCount += chunks.length

      if (this.handleChunkCount === this.chunks.length) {
        // 计算完成
        emitter.off('chunks', chunksHanlder) // 移除监听

        // 按顺序增量更新哈希函数
        for (const chunk of this.chunks) {
          await this.updateIncrementalHash(chunk)
        }

        this.fileHash = this.hashFunction.finalize().toString() // 保存计算结果
        this.emit('wholeHash', this.fileHash) // 整个文件的hash
        this.emit('drain') // 所有分片处理完成
      }
    }

    emitter.on('chunks', chunksHanlder) // 监听chunks事件
    this.calcHash(this.chunks, emitter) // 计算每一个分片的hash
  }

  // 计算每一个分片的hash
  abstract calcHash(chunks: Chunk[], emitter: EventEmitter<'chunks'>): void

  // 分片完成后一些需要销毁的工作
  abstract dispose(): void
}

// 多线程分片
export class MultiThreadSplitor extends ChunkSplitor {
  private workers: Worker[] = new Array(navigator.hardwareConcurrency || 4).fill(0).map(
    () =>
      new Worker(new URL('@/utils/splitWorker', import.meta.url), {
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

// UploadFileInfo
// 上传文件信息
export interface UploadFileInfo {
  id: string //文件ID 响应给前端为字符串
  hash_key: string //哈希值
  first_chunk_hash_key: string //第一个分片 hash 值
  hash_algorithm: string //哈希算法
  file_name: string //文件名称
  file_size: number //文件大小
  file_type: string //文件类型
  file_chunk_size: number //分片大小
  part_numbers: number //分片数量
  sub_dir: string //存放子目录
  uploaded_part_number_list: number[] //已上传的分片序号
}

// HashExists
// hash是否存在
export interface HashExists {
  exists: boolean //是否存在
  file_id?: string //文件ID
}
// 请求策略
export interface RequestStrategy {
  // 创建文件请求，返回文件token
  confirmBeforeUpload(req: ConfirmBeforeUploadRequest): Promise<UploadFileInfo>
  // 分片上传请求
  uploadChunk(chunk: Chunk): Promise<void>
  // hash校验请求
  hashExists<T extends 'file' | 'chunk'>(hash: string, upload_content_type: T): Promise<HashExists>
}

export class UploadController extends EventEmitter<'start' | 'progress' | 'end' | 'error'> {
  private requestStrategy: RequestStrategy // 请求策略，没有传递则使用默认策略
  private chunkSplitor: ChunkSplitor // 分片策略，没有传递则默认多线程分片
  private taskQueue: TaskQueue // 任务队列
  private file: File // 需要上传的文件
  private uploadFileInfo: UploadFileInfo | undefined // 文件token

  constructor(file: File, requestStrategy: RequestStrategy, chunkSplitor: ChunkSplitor) {
    super()
    this.file = file
    this.requestStrategy = requestStrategy
    this.chunkSplitor = chunkSplitor
    this.taskQueue = new TaskQueue()
  }

  // 初始化
  async init() {
    // 上传前确认
    const req: ConfirmBeforeUploadRequest = {
      file_name: this.file.name,
      file_size: this.file.size,
      file_type: this.file.type,
      file_chunk_size: this.chunkSplitor.chunkSize,
      hash_algorithm: this.chunkSplitor.algorithm,
      first_chunk_hash_key: await getFirstChunkHash(
        this.file,
        this.chunkSplitor.algorithm,
        this.chunkSplitor.chunkSize,
      ),
      part_numbers: this.chunkSplitor.partNumbers,
    }

    this.uploadFileInfo = await this.requestStrategy.confirmBeforeUpload(req)
    if (!this.uploadFileInfo.id) {
      throw new Error('Failed to get uploadFileInfo.')
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
    const resp = await this.requestStrategy.hashExists(chunk.hash_key, 'chunk')
    if (resp.exists) {
      // 文件已存在
      this.emit('end')
      return
    }

    // 分片上传
    await this.requestStrategy.uploadChunk(chunk)
    this.emit('progress', chunk.end / this.file.size)
  }

  // 整体hash事件处理
  private async handleWholeHash(hash: string) {
    // hash校验
    const resp = await this.requestStrategy.hashExists(hash, 'file')
    if (resp.exists && resp.file_id) {
      // 文件已存在
      this.emit('end', resp.file_id)
      return
    }
  }
}
