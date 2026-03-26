import { afterEach, describe, expect, it, vi } from "vitest"

import * as encrypt from "@/utils/encrypt"

import { playKeyDecryptAES2Bin } from "./index"
afterEach(() => vi.restoreAllMocks())

describe("playKeyDecryptAES2Bin 函数", () => {
    it("应解密加密的播放密钥并返回 Uint8Array", () => {
        const playKeyEncrypt = "51e8bdb7f5bed6d7c8149e0c0767ecefeFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr56fbdd4fd665d8fa"
        const expectedOutput = new Uint8Array([63, 219, 19, 240, 217, 90, 85, 53, 28, 66, 214, 119, 240, 84, 89, 53])

        // 使用 spyOn 模拟 reverseString 和 decryptData 的行为
        // oxlint-disable-next-line unicorn/no-array-reverse
        vi.spyOn(encrypt, "reverseString").mockImplementation((str: string) => str.split("").reverse().join(""))
        vi.spyOn(encrypt, "decryptData").mockImplementation(() => {
            return "3fdb13f0d95a55351c42d677f0545935" // 模拟解密后的十六进制字符串
        })

        const result = playKeyDecryptAES2Bin(playKeyEncrypt)

        expect(encrypt.reverseString).toHaveBeenCalledWith("51e8bdb7f5bed6d7c8149e0c0767ecef")
        expect(encrypt.reverseString).toHaveBeenCalledWith("56fbdd4fd665d8fa")
        expect(encrypt.decryptData).toHaveBeenCalledWith(
            "eFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr",
            "fece7670c0e9418c7d6deb5f7bdb8e15",
            "af8d566df4ddbf65",
        )
        expect(result).toEqual(expectedOutput)
    })

    it("当 decryptData 返回无效数据时应抛出错误", () => {
        const playKeyEncrypt = "51e8bdb7f5bed6d7c8149e0c0767ecefeFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr56fbdd4fd665d8fa"

        // 使用 spyOn 模拟 reverseString 和 decryptData 的行为
        // oxlint-disable-next-line unicorn/no-array-reverse
        vi.spyOn(encrypt, "reverseString").mockImplementation((str: string) => str.split("").reverse().join(""))
        vi.spyOn(encrypt, "decryptData").mockImplementation(() => {
            return "invalid_hex_string" // 模拟无效的十六进制字符串
        })

        expect(() => playKeyDecryptAES2Bin(playKeyEncrypt)).toThrowError()

        // mocks 在每个测试后恢复
    })
})
