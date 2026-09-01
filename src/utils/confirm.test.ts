/*
 * FilePath    : blog-client-nuxt\src\utils\confirm.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 确认框工具的遮罩类配置测试
 */

import { describe, expect, it, vi } from "vitest"

import { confirmCommon } from "./confirm"

const { confirmMock } = vi.hoisted(() => ({
    confirmMock: vi.fn().mockResolvedValue(void 0),
}))

vi.mock("element-plus", () => ({
    ElMessage: vi.fn(),
    ElMessageBox: { confirm: confirmMock },
}))

vi.mock("@/components/common", () => ({
    MsgTitle: { warning: "警告" },
    MsgType: { warning: "warning" },
}))

describe("confirmCommon", () => {
    it("应将调用方指定的遮罩类传给确认框", async () => {
        const onConfirm = vi.fn()
        const onCancel = vi.fn()

        await confirmCommon("确认清空", onConfirm, onCancel, { modalClass: "md-page-local-image-clear-confirm" })

        expect(confirmMock).toHaveBeenCalledWith("确认清空", "警告", expect.objectContaining({ modalClass: "md-page-local-image-clear-confirm" }))
        expect(onConfirm).toHaveBeenCalledOnce()
        expect(onCancel).not.toHaveBeenCalled()
    })
})
