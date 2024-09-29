/**
 * @FilePath     : \blog-client\src\utils\chunkUpload.ts
 */

import { EventEmitter } from '@/utils/eventEmitter'
import { Task, TaskQueue } from '@/utils/task'
import { type ConfirmBeforeUploadRequest } from '@/api/upload/confirmBeforeUpload'
import { type ChunkMetadataWithoutFileId } from '@/api/upload/chunk'
import { HashCalculator, HashAlgorithm } from '@/utils/hash'
import { UploadCode } from '@/api/responseCode'
import type { Res } from '@/api/responseCode'

// 分片元数据,包含文件二进制数据
export interface Chunk extends ChunkMetadataWithoutFileId {
  blob: Blob // 分片的二进制数据
}

// 分片文件类的相关事件
enum ChunkSplitorEvents {
  CHUNKS = 'chunks', // 一部分分片产生了
  WHOLE_HASH = 'wholeHash', // 整个文件的hash计算完成
  DRAIN = 'drain', // 所有分片处理完成
}

// 文件上传的相关事件
enum FileUploadEvents {
  CHUNKS = 'chunks', // 一部分分片产生了
}

// 上传进度 100
const UPLOAD_PROGRESS_100 = 100

// 上传控制器的相关事件
export enum UploadControllerEvents {
  START = 'start', // 上传开始
  CHECK_WHOLE_HASH = 'checkWholeHash', // 检查整个文件的hash,主要用在文件已经存在的情况,文件秒传。
  PROGRESS = 'progress', // 上传进度
  END = 'end', // 上传结束
  ERROR = 'error', // 上传错误
}

// 分片文件类
export abstract class ChunkSplitor extends EventEmitter<ChunkSplitorEvents> {
  chunkSize: number // 分片大小（单位字节）
  partNumbers: number // 分片数量
  chunks: Chunk[] // 分片列表
  uploadedpartIndexList: number[] // 已上传的分片序号列表
  wholeFileHash?: string // 整个文件的hash
  hashCalculator: HashCalculator // 哈希计算器
  protected file: File // 待分片的文件
  private processedChunkCount = 0 // 已计算 hash 的分片数量
  private hasSplited = false // 是否已经分片

  constructor(
    file: File,
    chunkSize: number = 1024 * 1024 * 10, // 默认分片大小为10MB
    algorithm: HashAlgorithm = HashAlgorithm.SHA256, // 默认哈希算法为SHA-256
    uploadedpartIndexList = [], // 已上传的分片序号列表
  ) {
    super()
    this.file = file // 文件
    this.chunkSize = chunkSize // 分片大小
    this.partNumbers = Math.ceil(file.size / chunkSize) // 计算分片数量
    this.hashCalculator = new HashCalculator(algorithm, chunkSize) // 创建哈希计算器

    // 获取分片数组
    const chunkCount = Math.ceil(this.file.size / this.chunkSize)

    // 创建分片不包含hash,能迅速的获取到分片的大小
    this.chunks = new Array(chunkCount)
      .fill(0)
      .map((_, index) => this.createChunkWithoutHash(index))
    this.uploadedpartIndexList = uploadedpartIndexList
  }

  // 创建一个不带hash的分片
  private createChunkWithoutHash = (index: number): Chunk => {
    // 计算分片数量
    const partNumbers = Math.ceil(this.file.size / this.chunkSize)
    // 判断 index 是否超出分片数量
    if (index >= partNumbers) {
      throw new Error(`Index ${index} is out of range. Part numbers is ${partNumbers}.`)
    }

    const start = index * this.chunkSize
    const end = Math.min((index + 1) * this.chunkSize, this.file.size)
    const blob = this.file.slice(start, end)
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

  // 分片文件
  split = () => {
    if (this.hasSplited) {
      return
    }
    this.hasSplited = true
    const emitter = new EventEmitter<FileUploadEvents>() // 用于分片计算 hash 的事件触发器

    // 监听chunks事件，计算每一个分片的hash
    const chunksHanlder = async (chunks: Chunk[]) => {
      this.emit(ChunkSplitorEvents.CHUNKS, chunks) // 触发chunks事件

      this.processedChunkCount += chunks.length // 计算已处理的分片数量

      if (this.processedChunkCount === this.chunks.length) {
        // 计算完成
        emitter.off(FileUploadEvents.CHUNKS, chunksHanlder) // 移除监听

        // // 按顺序增量更新哈希函数,本来可以在worker中计算hash的顺序是不固定的，所以需要在按照顺序读取文件块，计算hash
        // for (const chunk of this.chunks) {
        //   await this.hashCalculator.updateIncrementalHash(chunk.blob)
        // }
        // this.wholeFileHash = this.hashCalculator.getWholeFileHash() // 保存计算结果
        // this.emit(ChunkSplitorEvents.WHOLE_HASH, this.wholeFileHash) // 整个文件的hash

        this.emit(ChunkSplitorEvents.DRAIN) // 所有分片处理完成
      }
    }

    emitter.on(FileUploadEvents.CHUNKS, chunksHanlder) // 监听chunks事件
    this.calcHash(this.chunks, emitter) // 计算每一个分片的hash
  }

  // 计算每一个分片的hash
  abstract calcHash(chunks: Chunk[], emitter: EventEmitter<FileUploadEvents>): void

  // 分片完成后一些需要销毁的工作
  abstract dispose(): void
}

// 多线程分片 navigator.hardwareConcurrency || 4
export class MultiThreadSplitor extends ChunkSplitor {
  // 计算机CPU核心数 - 2 作为并发数 不能小于1 保证至少有一个线程 不能大于4 保证不会占用太多资源
  // 获取环境变量 import.meta.env.VITE_MAX_NAVIGATOR_HARDWARE_CONCURRENCY

  concurrency = Math.min(
    Math.max(navigator.hardwareConcurrency - 2, 1),
    import.meta.env.VITE_MAX_NAVIGATOR_HARDWARE_CONCURRENCY,
  )

  // 多线程Worker
  private workers: Worker[] = new Array(this.concurrency).fill(0).map(
    () =>
      new Worker(new URL('@/utils/splitWorker', import.meta.url), {
        type: 'module',
      }),
  )

  // 计算每一个分片的hash
  calcHash = async (chunks: Chunk[], emitter: EventEmitter<FileUploadEvents>): Promise<void> => {
    const workerSize = Math.ceil(chunks.length / this.workers.length) // 计算每个 Worker 处理的分片数量
    const promises: Promise<void>[] = [] // 用于保存每个 Worker 的 Promise
    for (let i = 0; i < this.workers.length; i++) {
      const worker = this.workers[i] // 获取 Worker
      const start = i * workerSize // 计算开始位置
      const end = Math.min((i + 1) * workerSize, chunks.length) // 计算结束位置
      const workerChunks = chunks.slice(start, end) // 获取当前 Worker 需要处理的分片

      // 向 Worker 发送消息
      worker.postMessage({
        chunks: workerChunks,
        algorithm: this.hashCalculator.getAlgorithm(), // 将算法名称传递给 Worker
      })

      // promise 用于保存 Worker 的处理结果
      const promise = new Promise<void>((resolve, reject) => {
        worker.onmessage = (e) => {
          emitter.emit(FileUploadEvents.CHUNKS, e.data)
          resolve()
        }
        worker.onerror = (e) => {
          reject(e)
        }
      })

      // 将 promise 添加到 promises 数组中
      promises.push(promise)
    }

    // 等待所有 Worker 处理完成
    await Promise.all(promises)
  }

  // 分片完成后一些需要销毁的工作
  dispose = (): void => {
    this.workers.forEach((worker) => worker.terminate())
  }
}

export interface UploadFileSuccessInfo {
  fileName: string // 文件名称
  fileUrl: string // 文件URL
}

// UploadFileInfo
// 上传文件信息
export interface UploadFileInfo {
  id?: string //文件ID 响应给前端为字符串
  hash_key?: string //哈希值
  first_chunk_hash_key: string //第一个分片 hash 值
  hash_algorithm: string //哈希算法
  file_name: string //文件名称
  file_size: number //文件大小
  file_type: string //文件类型
  file_chunk_size: number //分片大小
  part_numbers: number //分片数量
  sub_dir: string //存放子目录
  is_encrypt: boolean // 是否加密
  uploaded_part_number_list: number[] //已上传的分片序号
  upload_strategy: {
    signed_url?: string // 如果签名 URL 存在，直接使用签名URL上传，不使用分片上传
    signed_headers?: Record<string, string> // 请求头
  }
  error_msg?: string //错误信息
}

// 请求策略
export interface RequestStrategy {
  // 创建文件请求，返回文件token
  confirmBeforeUpload(req: ConfirmBeforeUploadRequest): Promise<UploadFileInfo>

  // 使用签名URL上传,不走分片上传
  uploadFileBySignedUrl(
    file: File,
    signedUrl: string,
    headers: Record<string, string>,
    onProgress: (percent: number) => void,
  ): Promise<any>

  confirmAfterUploadBySignedUrl(req: { file_id: string }): Promise<Res>
  // 分片上传请求
  uploadChunk(chunk: Chunk): Promise<Res>

  // 获取上传文件URL
  getUploadFileUrl(file_id: string): Promise<Res>
}

// 上传控制器
export class UploadController extends EventEmitter<UploadControllerEvents> {
  private requestStrategy: RequestStrategy // 请求策略，没有传递则使用默认策略
  private chunkSplitor: MultiThreadSplitor // 分片策略，没有传递则默认多线程分片
  private taskQueue: TaskQueue // 任务队列
  private file: File // 需要上传的文件
  private uploadFileInfo: UploadFileInfo | undefined // 询问上传前确认的返回信息
  private progressTrackers: Map<number, number> = new Map() // 添加一个 Map 来跟踪每个分片的上传进度

  constructor(file: File, requestStrategy: RequestStrategy, chunkSplitor: MultiThreadSplitor) {
    super()
    this.file = file
    this.requestStrategy = requestStrategy
    this.chunkSplitor = chunkSplitor
    this.taskQueue = new TaskQueue(this.chunkSplitor.concurrency)
  }

  // 初始化
  init = async (isEncrypt: boolean, isFree: boolean) => {
    // 上传前确认
    const req: ConfirmBeforeUploadRequest = {
      file_name: this.file.name,
      file_size: this.file.size,
      file_type: this.file.type,
      file_chunk_size: this.chunkSplitor.chunkSize,
      hash_algorithm: this.chunkSplitor.hashCalculator.getAlgorithm(),
      first_chunk_hash_key: await this.chunkSplitor.hashCalculator.getFirstChunkHash(this.file),
      part_numbers: this.chunkSplitor.partNumbers,
      is_encrypt: isEncrypt,
      is_Free: isFree,
    }

    this.uploadFileInfo = await this.requestStrategy.confirmBeforeUpload(req)

    // 如果没有获取到文件ID，抛出错误
    if (!this.uploadFileInfo.id) {
      throw new Error('Failed to get uploadFileInfo.')
    }

    // 如果整个文件Hash存在，说明文件存在,暂时不上传，等待验证整个Hash
    if (this.uploadFileInfo.hash_key) {
      // 按顺序增量更新哈希函数,本来可以在 worker 中计算 hash 的顺序是不固定的，所以需要在按照顺序读取文件块，计算hash
      this.emit(UploadControllerEvents.CHECK_WHOLE_HASH, this.uploadFileInfo.file_name) // 检查整个文件的hash
      this.emit(UploadControllerEvents.PROGRESS, 0) // 检查整个文件的hash
      for (const chunk of this.chunkSplitor.chunks) {
        await this.chunkSplitor.hashCalculator.updateIncrementalHash(chunk.blob)
      }

      // 得到整个文件的hash
      this.chunkSplitor.wholeFileHash = this.chunkSplitor.hashCalculator.getWholeFileHash()

      // 判断当前文件的hash是否和服务器的hash一致
      if (this.uploadFileInfo.hash_key === this.chunkSplitor.wholeFileHash) {
        this.emit(UploadControllerEvents.END, this.uploadFileInfo.file_name)
        return
      }
    }

    // 如果签名URL存在，直接使用签名URL上传，不使用分片上传
    if (this.uploadFileInfo.upload_strategy.signed_url) {
      this.requestStrategy
        .uploadFileBySignedUrl(
          this.file,
          this.uploadFileInfo.upload_strategy.signed_url,
          this.uploadFileInfo.upload_strategy.signed_headers || {},
          (percent) => {
            this.emit(UploadControllerEvents.PROGRESS, percent / UPLOAD_PROGRESS_100) // 上传进度
            if (percent === UPLOAD_PROGRESS_100) {
              this.requestStrategy
                .confirmAfterUploadBySignedUrl({
                  file_id: this.uploadFileInfo?.id?.toString() || '',
                })
                .then(async (res) => {
                  if (res.code === UploadCode.ConfirmAfterUploadBySignedUrlSuccess) {
                    // 上传完成
                    const info: UploadFileSuccessInfo = {
                      fileName: this.uploadFileInfo?.file_name || '',
                      fileUrl: '',
                    }

                    const res = await this.requestStrategy.getUploadFileUrl(
                      this.uploadFileInfo?.id || '',
                    )
                    if (res.code === UploadCode.GetUploadFileUrlSuccess) {
                      info.fileUrl = res.data
                      this.emit(UploadControllerEvents.END, info)
                    }

                    this.emit(UploadControllerEvents.END, info)
                  }
                })
            }
          },
        )
        .catch((error) => {
          this.emit(UploadControllerEvents.ERROR, error) // 上传错误
        })
      return
    }

    // 初始化 progressTrackers Map 对象
    // 如果 uploaded_part_number_list 不为空，说明有部分分片已经上传，需要将这些分片的进度添加到 Map 中 否则跳过
    if (this.uploadFileInfo.uploaded_part_number_list) {
      this.uploadFileInfo.uploaded_part_number_list.forEach((partIndex) => {
        const chunk = this.chunkSplitor.chunks[partIndex]
        if (chunk) {
          this.progressTrackers.set(chunk.part_index, chunk.end - chunk.start) // 添加分片的大小
        }
      })
    }

    // 分片事件监听
    this.chunkSplitor.on(ChunkSplitorEvents.CHUNKS, this.handleChunks.bind(this))
    // 开始分片
    this.chunkSplitor.split()
    this.emit(UploadControllerEvents.START)
  }

  // 处理分片
  private handleChunks = (chunks: Chunk[]) => {
    // 添加所有任务
    chunks.forEach((chunk) => {
      this.taskQueue.add(new Task(() => this.uploadChunk(chunk)))
    })

    // 开始执行任务
    this.taskQueue.start()
  }

  // 上传分片
  uploadChunk = async (chunk: Chunk) => {
    // 不在 uploaded_part_number_list 中的分片才需要上传, 即已经上传的分片不再上传.
    if (!this.uploadFileInfo?.uploaded_part_number_list?.includes(chunk.part_index)) {
      try {
        // this.requestStrategy.uploadChunk(chunk)
        const res = await this.requestStrategy.uploadChunk(chunk)
        if (res.code === UploadCode.Success) {
          // 当一个分片上传完成后，更新该分片在 Map 中的进度。分片的结束位置减去开始位置得到分片的大小。
          this.progressTrackers.set(chunk.part_index, chunk.blob.size)

          // 计算总的上传进度
          const progress = this.calculateProgress()
          this.emit(UploadControllerEvents.PROGRESS, progress)

          // 如果上传完成，触发 end 事件
          if (progress === 1) {
            // 上传完成
            const info: UploadFileSuccessInfo = {
              fileName: this.uploadFileInfo?.file_name || '',
              fileUrl: '',
            }

            const res = await this.requestStrategy.getUploadFileUrl(this.uploadFileInfo?.id || '')
            if (res.code === UploadCode.GetUploadFileUrlSuccess) {
              info.fileUrl = res.data
              this.emit(UploadControllerEvents.END, info)
            }

            this.emit(UploadControllerEvents.END, info)
            return
          }
        }
      } catch (error) {
        this.emit(UploadControllerEvents.ERROR, error)
      }
    }
  }

  // 计算上传进度
  private calculateProgress = () => {
    // 累加计算已上传的大小
    const uploadedSize = Array.from(this.progressTrackers.values()).reduce(
      (acc, size) => acc + size,
      0,
    )
    return uploadedSize / this.file.size
  }
}
