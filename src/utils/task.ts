/**
 * @FilePath     : \blog-client\src\utils\Task.ts
 * @Description  : 任务队列 参考袁老师 https://fe.duyiedu.com/p/t_pc/goods_pc_detail/goods_detail/course_2hzyLq1i84ydVnT200svNMYPFVH
 */

import { EventEmitter } from '@/utils/eventEmitter'

// 任务构造器
export class Task {
  fn: Function // 任务关联的执行函数
  payload?: any // 任务关联的其他信息
  constructor(fn: Function, payload?: any) {
    this.fn = fn
    this.payload = payload
  }

  // 执行任务
  run() {
    return this.fn(this.payload)
  }
}

// 可并发执行的任务队列
export class TaskQueue extends EventEmitter<'start' | 'pause' | 'drain'> {
  // 待执行的任务
  private tasks: Set<Task> = new Set()
  // 当前正在执行的任务数
  private currentCount = 0
  // 任务状态 
  private status: 'paused' | 'running' = 'paused'
  // 最大并发数
  private concurrency: number = 4

  constructor(concurrency: number = 4) {
    super()
    this.concurrency = concurrency
  }

  // 添加任务
  add(...tasks: Task[]) {
    for (const t of tasks) {
      this.tasks.add(t)
    }
  }

  // 添加任务并启动执行
  addAndStart(...tasks: Task[]) {
    this.add(...tasks)
    this.start()
  }

  // 启动任务
  start() {
    if (this.status === 'running') {
      return // 任务正在进行中，结束
    }
    if (this.tasks.size === 0) {
      // 当前已无任务，触发drain事件
      this.emit('drain')
      return
    }
    // 设置任务状态为running
    this.status = 'running'
    this.emit('start') // 触发start事件
    this.runNext() // 开始执行下一个任务
  }

  // 取出第一个任务
  private takeHeadTask() {
    const task = this.tasks.values().next().value
    if (task) {
      this.tasks.delete(task)
    }
    return task
  }

  // 执行下一个任务
  private runNext() {
    if (this.status !== 'running') {
      return // 如果整体的任务状态不是running，结束
    }
    if (this.currentCount >= this.concurrency) {
      // 并发数已满，结束
      return
    }
    // 取出第一个任务
    const task = this.takeHeadTask()
    if (!task) {
      // 没有任务了
      this.status = 'paused' // 暂停执行
      this.emit('drain') // 触发drain事件
      return
    }
    this.currentCount++ // 当前任务数+1
    // 执行任务
    Promise.resolve(task.run()).finally(() => {
      // 任务执行完成后，当前任务数-1，继续执行下一个任务
      this.currentCount--
      this.runNext()
    })
  }

  // 暂停任务
  pause() {
    this.status = 'paused'
    this.emit('pause')
  }
}
