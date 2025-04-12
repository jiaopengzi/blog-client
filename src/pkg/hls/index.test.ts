import { describe, expect, it, vi } from "vitest"

// Mock unnecessary dependencies
vi.mock("src/components/common/icons/assets/iconfont.js", () => ({}))
vi.mock("src/components/common/icons/index.vue", () => ({}))

import { decryptData, reverseString } from "@/utils/encrypt"

import { playKeyDecryptAES2Bin } from "./index"

vi.mock("@/utils/encrypt", () => ({
    reverseString: vi.fn(),
    decryptData: vi.fn(),
}))

describe("playKeyDecryptAES2Bin", () => {
    it("should decrypt the encrypted play key and return a Uint8Array", () => {
        const playKeyEncrypt = "51e8bdb7f5bed6d7c8149e0c0767ecefeFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr56fbdd4fd665d8fa"
        const expectedOutput = new Uint8Array([63, 219, 19, 240, 217, 90, 85, 53, 28, 66, 214, 119, 240, 84, 89, 53])

        // Mock reverseString and decryptData behavior
        vi.mocked(reverseString).mockImplementation((str) => str.split("").reverse().join(""))
        vi.mocked(decryptData).mockImplementation(() => {
            return "3fdb13f0d95a55351c42d677f0545935" // Mocked decrypted hex string
        })

        const result = playKeyDecryptAES2Bin(playKeyEncrypt)

        expect(reverseString).toHaveBeenCalledWith("51e8bdb7f5bed6d7c8149e0c0767ecef")
        expect(reverseString).toHaveBeenCalledWith("56fbdd4fd665d8fa")
        expect(decryptData).toHaveBeenCalledWith(
            "eFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr",
            "fece7670c0e9418c7d6deb5f7b8de851",
            "af8d566d4fddb65f",
        )
        expect(result).toEqual(expectedOutput)
    })

    it("should throw an error if decryptData returns invalid data", () => {
        const playKeyEncrypt = "51e8bdb7f5bed6d7c8149e0c0767ecefeFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr56fbdd4fd665d8fa"

        // Mock reverseString and decryptData behavior
        vi.mocked(reverseString).mockImplementation((str) => str.split("").reverse().join(""))
        vi.mocked(decryptData).mockImplementation(() => {
            return "invalid_hex_string" // Mocked invalid hex string
        })

        expect(() => playKeyDecryptAES2Bin(playKeyEncrypt)).toThrowError()
    })
})
