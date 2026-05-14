/**
 * FilePath    : blog-client\src\utils\uploadFileName.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 上传文件命名通用工具单元测试
 */

import { describe, expect, it } from "vitest"

import { renameFilePreservingMetadata, sanitizeFileNameSegment } from "./uploadFileName"

describe("sanitizeFileNameSegment", () => {
    it("应清理非法字符并压缩空白与重复连字符", () => {
        expect(sanitizeFileNameSegment("  foo/bar   baz  ", "fallback")).toBe("foo-bar-baz")
    })

    it("清理后为空时应返回回退值", () => {
        expect(sanitizeFileNameSegment("   ", "fallback")).toBe("fallback")
    })
})

describe("renameFilePreservingMetadata", () => {
    it("应保留原始文件类型和修改时间, 仅替换文件名", () => {
        const file = new File(["content"], "origin.png", {
            type: "image/png",
            lastModified: 123,
        })

        const renamedFile = renameFilePreservingMetadata(file, "renamed.png")

        expect(renamedFile.name).toBe("renamed.png")
        expect(renamedFile.type).toBe("image/png")
        expect(renamedFile.lastModified).toBe(123)
    })

    it("原始文件缺失类型时应使用回退 MIME", () => {
        const file = new File(["content"], "origin.bin", {
            type: "",
            lastModified: 456,
        })

        const renamedFile = renameFilePreservingMetadata(file, "renamed.bin", "application/octet-stream")

        expect(renamedFile.type).toBe("application/octet-stream")
        expect(renamedFile.lastModified).toBe(456)
    })
})
