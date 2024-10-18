import { describe, it, expect } from "vitest"
import { playKeyDecryptAES2Bin } from "./index"

// 测试
describe("playKeyDecryptAES2Bin", () => {
    it("应该正确解密播放密钥", () => {
        const playKeyEncrypt =
            "51e8bdb7f5bed6d7c8149e0c0767ecefeFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr56fbdd4fd665d8fa"
        const expectedOutput = new Uint8Array([
            63, 219, 19, 240, 217, 90, 85, 53, 28, 66, 214, 119, 240, 84, 89, 53,
        ])

        const result = playKeyDecryptAES2Bin(playKeyEncrypt)

        expect(result).toEqual(expectedOutput) // 断言结果与预期输出相等
    })
})
