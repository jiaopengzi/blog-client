/*
 * FilePath    : blog-client-nuxt\src\utils\message.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 消息提示工具的消息类配置测试
 */

import { beforeEach, describe, expect, it, vi } from "vitest"

import { resetLastMessage, success } from "./message"

const { messageMock } = vi.hoisted(() => ({
    messageMock: vi.fn(),
}))

vi.mock("element-plus", () => ({
    ElMessage: messageMock,
}))

vi.mock("@/components/common", () => ({
    MsgType: { success: "success" },
}))

describe("MessageUtil", () => {
    beforeEach(() => {
        messageMock.mockReset()
        resetLastMessage()
    })

    it("应将调用方指定的消息类传给消息组件", () => {
        success("已清空", 3000, { customClass: "md-page-customizer-feedback" })

        expect(messageMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "已清空",
                customClass: "md-page-customizer-feedback",
            }),
        )
    })
})
