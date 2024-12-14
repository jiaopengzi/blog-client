/**
 * @FilePath     : \blog-client\src\utils\task.ts
 * @Description  : 任务队列 参考袁老师 https://fe.duyiedu.com/p/t_pc/goods_pc_detail/goods_detail/course_2hzyLq1i84ydVnT200svNMYPFVH
 */

import { EventEmitter } from "@/utils/eventEmitter"

// 任务类
export class Task {
    private retryCount: number = 0 // 重试次数
    public maxRetryCount: number = 3 // 最大重试次数
    private taskFunc: () => Promise<void> // 任务函数

    constructor(taskFunc: () => Promise<void>) {
        this.taskFunc = taskFunc
    }

    async run() {
        try {
            await this.taskFunc()
        } catch (error) {
            // 任务执行失败，重试
            if (this.retryCount < this.maxRetryCount) {
                this.retryCount++
                throw error
            } else {
                console.error("Task failed after maximum retry count", error)
            }
        }
    }

    // 获取重试次数
    getRetryCount() {
        return this.retryCount
    }
}

// 任务队列事件
enum TaskQueueEvents {
    START = "start", // 任务开始
    PAUSE = "pause", // 任务暂停
    DRAIN = "drain", // 任务队列清空
}

// 任务状态
enum TaskStatus {
    PAUSED = "paused", // 暂停
    RUNNING = "running", // 运行中
}
// 可并发执行的任务队列
export class TaskQueue extends EventEmitter<TaskQueueEvents> {
    // 待执行的任务
    private tasks: Set<Task> = new Set()
    // 当前正在执行的任务数
    private currentCount = 0
    // 任务状态
    private status: TaskStatus = TaskStatus.PAUSED
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
        if (this.status === TaskStatus.RUNNING) {
            return // 任务正在进行中，结束
        }
        if (this.tasks.size === 0) {
            // 当前已无任务，触发drain事件
            this.emit(TaskQueueEvents.DRAIN)
            return
        }
        // 设置任务状态为running
        this.status = TaskStatus.RUNNING
        this.emit(TaskQueueEvents.START) // 触发start事件
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

    // 执行任务
    private runNext() {
        if (this.status !== TaskStatus.RUNNING) {
            return // 如果整体的任务状态不是running，结束
        }
        while (this.currentCount < this.concurrency) {
            // 如果并发数未满，继续执行任务
            const task = this.takeHeadTask()
            if (!task) {
                this.status = TaskStatus.PAUSED // 没有任务了，暂停执行
                this.emit(TaskQueueEvents.DRAIN) // 触发drain事件
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
    }

    // 暂停任务
    pause() {
        this.status = TaskStatus.PAUSED
        this.emit(TaskQueueEvents.PAUSE)
    }
}
