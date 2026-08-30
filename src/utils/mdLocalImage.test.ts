/*
 * FilePath    : blog-client-nuxt\src\utils\mdLocalImage.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页本地图片工具单测(注册表/引用提取/渲染替换/配额策略/引用剥离, 不覆盖 IndexedDB IO)
 */

import { afterEach, describe, expect, it } from "vitest"

import {
    applyLocalImageRefs,
    checkLocalImagePolicy,
    clearLocalImageUrls,
    extractLocalImageIds,
    formatLocalImageBytes,
    MAX_LOCAL_IMAGE_COUNT,
    MAX_LOCAL_IMAGE_SINGLE_BYTES,
    MAX_LOCAL_IMAGE_TOTAL_BYTES,
    registerLocalImageUrl,
    resolveLocalImageUrl,
    stripLocalImageRefs,
} from "@/utils/mdLocalImage"

const IMAGE_ID_A = "0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d"
const IMAGE_ID_B = "12345678-90ab-4cde-8f01-234567890abc"

// 每个用例结束后清理注册表, 避免用例间通过模块级 Map 相互污染
afterEach(() => {
    clearLocalImageUrls()
})

describe("mdLocalImage 本地图片引用", () => {
    it("1. extractLocalImageIds 提取 markdown 中的本地图片 id", () => {
        const src = `# 标题\n\n![](md-img:${IMAGE_ID_A})\n\n正文\n\n![](md-img:${IMAGE_ID_B})\n\n![外链](https://example.com/a.png)`
        expect(extractLocalImageIds(src)).toEqual([IMAGE_ID_A, IMAGE_ID_B])
    })

    it("2. extractLocalImageIds 无本地引用时返回空数组", () => {
        expect(extractLocalImageIds("![外链](https://example.com/a.png)")).toEqual([])
        expect(extractLocalImageIds("")).toEqual([])
    })

    it("3. 注册表: register 后 resolve 可查询, clear 后释放", () => {
        registerLocalImageUrl(IMAGE_ID_A, "blob:http://127.0.0.1:7364/fake-a")
        expect(resolveLocalImageUrl(IMAGE_ID_A)).toBe("blob:http://127.0.0.1:7364/fake-a")
        expect(resolveLocalImageUrl(IMAGE_ID_B)).toBeUndefined()

        clearLocalImageUrls()
        expect(resolveLocalImageUrl(IMAGE_ID_A)).toBeUndefined()
    })

    it("4. applyLocalImageRefs 已注册的引用替换为 blob URL", () => {
        registerLocalImageUrl(IMAGE_ID_A, "blob:http://127.0.0.1:7364/fake-a")
        const html = `<figure><img src="md-img:${IMAGE_ID_A}" alt="" /></figure>`
        expect(applyLocalImageRefs(html)).toContain(`src="blob:http://127.0.0.1:7364/fake-a"`)
    })

    it("5. applyLocalImageRefs 未注册的引用替换为透明占位并保留 id 标记", () => {
        const html = `<figure><img src="md-img:${IMAGE_ID_B}" alt="" /></figure>`
        const result = applyLocalImageRefs(html)
        expect(result).toContain("data:image/gif;base64,")
        expect(result).toContain(`data-jpz-local-image="${IMAGE_ID_B}"`)
        expect(result).not.toContain(`src="md-img:`)
    })

    it("6. applyLocalImageRefs 无本地引用时原样返回", () => {
        const html = '<figure><img src="https://example.com/a.png" alt="" /></figure>'
        expect(applyLocalImageRefs(html)).toBe(html)
    })

    it("7. checkLocalImagePolicy 单图超限被拒绝", () => {
        const rejection = checkLocalImagePolicy(MAX_LOCAL_IMAGE_SINGLE_BYTES + 1, { count: 0, totalBytes: 0 })
        expect(rejection).toContain("单张图片不能超过")
    })

    it("8. checkLocalImagePolicy 数量达上限被拒绝", () => {
        const rejection = checkLocalImagePolicy(1024, { count: MAX_LOCAL_IMAGE_COUNT, totalBytes: 0 })
        expect(rejection).toContain("数量已达上限")
    })

    it("9. checkLocalImagePolicy 总量达上限被拒绝", () => {
        const rejection = checkLocalImagePolicy(1024, { count: 1, totalBytes: MAX_LOCAL_IMAGE_TOTAL_BYTES })
        expect(rejection).toContain("总大小已达上限")
    })

    it("10. checkLocalImagePolicy 配额内返回 null 放行", () => {
        expect(checkLocalImagePolicy(1024, { count: 0, totalBytes: 0 })).toBeNull()
        expect(
            checkLocalImagePolicy(MAX_LOCAL_IMAGE_SINGLE_BYTES, {
                count: MAX_LOCAL_IMAGE_COUNT - 1,
                totalBytes: MAX_LOCAL_IMAGE_TOTAL_BYTES - MAX_LOCAL_IMAGE_SINGLE_BYTES,
            }),
        ).toBeNull()
    })

    it("11. stripLocalImageRefs 整行引用删除并收敛空行, 行内引用仅移除标记", () => {
        const src = `# 标题\n\n![](md-img:${IMAGE_ID_A})\n\n前文 ![](md-img:${IMAGE_ID_B}) 后文\n\n![外链](https://example.com/a.png)`
        const result = stripLocalImageRefs(src)
        expect(result).not.toContain("md-img:")
        expect(result).toContain("# 标题")
        expect(result).toContain("前文  后文")
        expect(result).toContain("![外链](https://example.com/a.png)")
        expect(result).not.toMatch(/\n{3,}/)
    })

    it("12. stripLocalImageRefs 无本地引用时原样返回", () => {
        const src = "# 标题\n\n正文"
        expect(stripLocalImageRefs(src)).toBe(src)
    })

    it("13. formatLocalImageBytes 输出 KB / MB 文本", () => {
        expect(formatLocalImageBytes(512 * 1024)).toBe("512.0 KB")
        expect(formatLocalImageBytes(5 * 1024 * 1024)).toBe("5.0 MB")
    })
})
