import { describe, expect, it } from "vitest"

import {
    buildPostImageAlt,
    buildPostImageFileName,
    getNextPostImageIndex,
    preparePostImageUploadFile,
    sanitizePostImageTitle,
    shouldRequirePostTitleBeforePasteUpload,
} from "./imageUpload"

describe("sanitizePostImageTitle", () => {
    it("应去除文件名非法字符并压缩空白", () => {
        expect(sanitizePostImageTitle("  编辑器 / 上传 : 方案  ")).toBe("编辑器-上传-方案")
    })

    it("标题为空时应回退到默认标题", () => {
        expect(sanitizePostImageTitle("   ")).toBe("未命名文章")
    })
})

describe("buildPostImageFileName", () => {
    it("应生成标题加序号和扩展名的文件名", () => {
        expect(buildPostImageFileName("文章标题", 3, "png")).toBe("文章标题-3.png")
    })
})

describe("buildPostImageAlt", () => {
    it("应直接使用图片序号作为 alt 文本", () => {
        expect(buildPostImageAlt(12)).toBe("12")
    })
})

describe("getNextPostImageIndex", () => {
    it("应基于 imgUrls 数量返回下一张图片序号", () => {
        expect(getNextPostImageIndex(["1.png", "2.png"])).toBe(3)
    })
})

describe("shouldRequirePostTitleBeforePasteUpload", () => {
    it("截图上传且标题为空时应要求先填写标题", () => {
        expect(shouldRequirePostTitleBeforePasteUpload("   ", "paste")).toBe(true)
    })

    it("拖拽上传不应强制要求标题", () => {
        expect(shouldRequirePostTitleBeforePasteUpload("   ", "drop")).toBe(false)
    })
})

describe("preparePostImageUploadFile", () => {
    it("截图上传时应仅重命名为标题映射文件名", () => {
        const file = new File(["image"], "image.png", { type: "image/png", lastModified: 123 })

        const preparedFile = preparePostImageUploadFile(file, "paste", "文章标题", 2)

        expect(preparedFile).not.toBe(file)
        expect(preparedFile.name).toBe("文章标题-2.png")
        expect(preparedFile.type).toBe("image/png")
        expect(preparedFile.lastModified).toBe(123)
    })

    it("拖拽上传时应保持原始文件对象不变", () => {
        const file = new File(["image"], "origin.webp", { type: "image/webp" })

        const preparedFile = preparePostImageUploadFile(file, "drop", "文章标题", 2)

        expect(preparedFile).toBe(file)
        expect(preparedFile.name).toBe("origin.webp")
    })
})
