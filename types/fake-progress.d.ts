/**
 * @Author       : jiaopengzi
 * @Date         : 2024-02-22 13:34:25
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-02-22 13:42:34
 * @FilePath     : \blog-client\types\fake-progress.d.ts
 * @Description  : fake-progress 进度条
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// fake-progress.d.ts

declare module 'fake-progress' {
  export default class FakeProgress {
    /**
     * 构造一个FakeProgress实例
     * @param options 可选配置参数
     */
    constructor(options?: FakeProgressOptions)

    timeConstant: number // 时间常数，单位为毫秒（请参考：https://en.wikipedia.org/wiki/Time_constant）
    progress: number // 当前的进度
    autoStart: boolean // 如果为true，则自动开始进度
    parent: FakeProgress | null // 父进度对象
    parentStart: number | null // 当前子进度在父进度中的起始值
    parentEnd: number | null // 当前子进度在父进度中的结束值

    /**
     * 启动FakeProgress实例
     */
    start(): void

    /**
     * 停止FakeProgress实例并将进度设置为1
     */
    end(): void

    /**
     * 停止FakeProgress实例
     */
    stop(): void

    /**
     * 在当前进度条下创建子进度条
     * @param options 子进度条的构造选项
     */
    createSubProgress(options: FakeProgressCreateSubOptions): FakeProgress

    /**
     * 设置FakeProgress实例的进度并更新父级进度
     * @param progress 需要设置的进度值
     */
    setProgress(progress: number): void
  }

  // FakeProgress可选配置参数接口
  export interface FakeProgressOptions {
    timeConstant?: number // 时间常数，单位为毫秒
    autoStart?: boolean // 如果为true，则自动开始进度
    parent?: FakeProgress // 父级进度对象
    parentStart?: number // 当前子进度在父级进度中的起始值
    parentEnd?: number // 当前子进度在父级进度中的结束值
  }

  // 创建子进度条时的可选配置参数接口
  export interface FakeProgressCreateSubOptions {
    timeConstant?: number // 时间常数，单位为毫秒
    autoStart?: boolean // 如果为true，则自动开始进度
    start?: number // 子进度在父级进度中的起始值
    end?: number // 子进度在父级进度中的结束值
  }
}
