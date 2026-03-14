/**
 * @FilePath     : \blog-client\src\utils\message.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 消息提示 工具类
 */

import "element-plus/theme-chalk/el-message.css"

import { ElMessage } from "element-plus"

import { MsgType } from "@/components/common"

export class MessageUtil {
    // 静态变量记录上一条消息的状态
    private static lastMessage: {
        content: string
        type: MsgType
        timestamp: number
    } | null = null

    // 记录等待下一条消息时需要关闭的消息实例
    private static waitNextMessageInstance: ReturnType<typeof ElMessage> | null = null

    // 防抖时间窗口(毫秒), 可根据需要调整
    private static readonly DEBOUNCE_WINDOW = 1000

    /**
     * @description: 显示成功提示消息.
     * @param msgStr 提示内容.
     * @param duration 消息显示时长 (毫秒), 默认值为 3000.
     * @return void.
     */
    static success(msgStr: string, duration: number = 3000): void {
        this.showMessage(MsgType.success, msgStr, duration)
    }

    /**
     * @description: 显示成功提示, 并持续展示直到下一条通过 MessageUtil 发出的消息出现.
     * @param msgStr 提示内容.
     * @return void.
     */
    static successWaitNext(msgStr: string): void {
        this.showWaitNextMessage(MsgType.success, msgStr)
    }

    /**
     * @description: 显示信息提示消息.
     * @param msgStr 提示内容.
     * @param duration 消息显示时长 (毫秒), 默认值为 3000.
     * @return void.
     */
    static info(msgStr: string, duration: number = 3000): void {
        this.showMessage(MsgType.info, msgStr, duration)
    }

    /**
     * @description: 显示提示消息, 并持续展示直到下一条通过 MessageUtil 发出的消息出现.
     * @param msgStr 提示内容.
     * @return void.
     */
    static infoWaitNext(msgStr: string): void {
        this.showWaitNextMessage(MsgType.info, msgStr)
    }

    /**
     * @description: 显示警告提示消息.
     * @param msgStr 提示内容.
     * @param duration 消息显示时长 (毫秒), 默认值为 3000.
     * @return void.
     */
    static warning(msgStr: string, duration: number = 3000): void {
        this.showMessage(MsgType.warning, msgStr, duration)
    }

    /**
     * @description: 显示警告消息, 并持续展示直到下一条通过 MessageUtil 发出的消息出现.
     * @param msgStr 提示内容.
     * @return void.
     */
    static warningWaitNext(msgStr: string): void {
        this.showWaitNextMessage(MsgType.warning, msgStr)
    }

    /**
     * @description: 显示错误提示消息.
     * @param msgStr 提示内容.
     * @param duration 消息显示时长 (毫秒), 默认值为 6000.
     * @return void.
     */
    static error(msgStr: string, duration: number = 6000): void {
        this.showMessage(MsgType.error, msgStr, duration)
    }

    /**
     * @description: 显示错误消息, 并持续展示直到下一条通过 MessageUtil 发出的消息出现.
     * @param msgStr 提示内容.
     * @return void.
     */
    static errorWaitNext(msgStr: string): void {
        this.showWaitNextMessage(MsgType.error, msgStr)
    }

    private static showMessage(msgType: MsgType, msgStr: string, duration: number): void {
        const now = Date.now()

        // 检查是否在防抖时间窗口内且内容相同
        if (this.lastMessage && this.lastMessage.content === msgStr && now - this.lastMessage.timestamp < this.DEBOUNCE_WINDOW) {
            console.log("跳过重复消息:", msgStr)
            return
        }

        this.closeWaitNextMessage()

        // 更新最后一条消息记录
        this.lastMessage = {
            content: msgStr,
            type: msgType,
            timestamp: now,
        }

        ElMessage({
            showClose: true,
            message: msgStr,
            type: msgType,
            duration: duration,
        })
    }

    /**
     * @description: 显示一条需要等到下一条消息出现后才关闭的提示.
     * @param msgType 提示类型.
     * @param msgStr 提示内容.
     * @return void.
     */
    private static showWaitNextMessage(msgType: MsgType, msgStr: string): void {
        const now = Date.now()

        // 检查是否在防抖时间窗口内且内容相同
        if (this.lastMessage && this.lastMessage.content === msgStr && now - this.lastMessage.timestamp < this.DEBOUNCE_WINDOW) {
            console.log("跳过重复消息:", msgStr)
            return
        }

        this.closeWaitNextMessage()

        // 更新最后一条消息记录
        this.lastMessage = {
            content: msgStr,
            type: msgType,
            timestamp: now,
        }

        this.waitNextMessageInstance = ElMessage({
            showClose: true,
            message: msgStr,
            type: msgType,
            duration: 0,
        })
    }

    /**
     * @description: 关闭等待下一条消息时展示的持久提示, 并清空实例引用.
     * @return void.
     */
    private static closeWaitNextMessage(): void {
        this.waitNextMessageInstance?.close()
        this.waitNextMessageInstance = null
    }

    /**
     * @description: 重置上一条消息记录.
     * @return void.
     */
    static resetLastMessage(): void {
        this.lastMessage = null
        this.closeWaitNextMessage()
    }

    /**
     * @description: 获取当前防抖状态.
     * @return 当前防抖状态.
     */

    static getLastMessageState(): typeof MessageUtil.lastMessage {
        return this.lastMessage
    }
}

export default MessageUtil
