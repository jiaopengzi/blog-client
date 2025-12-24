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

    // 防抖时间窗口(毫秒), 可根据需要调整
    private static readonly DEBOUNCE_WINDOW = 1000

    static success(msgStr: string, duration: number = 3000): void {
        this.showMessage(MsgType.success, msgStr, duration)
    }

    static info(msgStr: string, duration: number = 3000): void {
        this.showMessage(MsgType.info, msgStr, duration)
    }

    static warning(msgStr: string, duration: number = 3000): void {
        this.showMessage(MsgType.warning, msgStr, duration)
    }

    static error(msgStr: string, duration: number = 6000): void {
        this.showMessage(MsgType.error, msgStr, duration)
    }

    private static showMessage(msgType: MsgType, msgStr: string, duration: number): void {
        const now = Date.now()

        // 检查是否在防抖时间窗口内且内容相同
        if (this.lastMessage && this.lastMessage.content === msgStr && now - this.lastMessage.timestamp < this.DEBOUNCE_WINDOW) {
            console.log("跳过重复消息:", msgStr)
            return
        }

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

    // 重置方法, 用于特殊场景
    static resetLastMessage(): void {
        this.lastMessage = null
    }

    // 获取当前防抖状态
    static getLastMessageState(): typeof MessageUtil.lastMessage {
        return this.lastMessage
    }
}

export default MessageUtil
