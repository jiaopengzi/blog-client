/**
 * FilePath    : blog-client\src\components\common\avatar-upload\avatarFileName.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 头像上传文件命名辅助单元测试
 */

import { describe, expect, it } from "vitest"

import { buildAvatarFileName, prepareAvatarUploadFile, sanitizeAvatarOwnerName } from "./avatarFileName"

describe("sanitizeAvatarOwnerName", () => {
    it("会将空白和非法字符清理为安全文件名片段", () => {
        expect(sanitizeAvatarOwnerName("  foo/bar baz  ")).toBe("foo-bar-baz")
    })

    it("会在用户名为空时回退到默认占位名", () => {
        expect(sanitizeAvatarOwnerName("   ")).toBe("user")
    })
})

describe("buildAvatarFileName", () => {
    it("会生成带 avatar 后缀的 png 文件名", () => {
        expect(buildAvatarFileName("张三")).toBe("avatar-张三.png")
    })
})

describe("prepareAvatarUploadFile", () => {
    it("会保留文件元信息并仅替换文件名", () => {
        const file = new File(["avatar"], "avatar.png", {
            type: "image/png",
            lastModified: 123,
        })

        const renamedFile = prepareAvatarUploadFile(file, "foo bar")

        expect(renamedFile.name).toBe("avatar-foo-bar.png")
        expect(renamedFile.type).toBe("image/png")
        expect(renamedFile.lastModified).toBe(123)
    })
})
