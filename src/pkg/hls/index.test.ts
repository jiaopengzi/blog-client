import { describe, expect, it, vi } from "vitest"

import { decryptData, reverseString } from "@/utils/encrypt"

import { playKeyDecryptAES2Bin } from "./index"

// Mock unnecessary dependencies
vi.mock("src/components/common/icons/assets/iconfont.js", () => ({
    getAttribute: vi.fn(() => "mocked-attribute"), // 提供 getAttribute 方法的模拟实现
}))
vi.mock("src/components/common/icons/index.vue", () => ({
    default: { template: "<div></div>" }, // 提供 Vue 组件的简单模板
}))

// Mock RouteNamesAdmin and adminMenuItemMapWithIndex
vi.mock("src/views/admin/component/aside/utils.ts", () => ({
    RouteNamesAdmin: {
        Dashboard: "Dashboard", // 提供 Dashboard 属性的模拟值
    },
    adminMenuItemMapWithIndex: {
        Dashboard: {
            text: "仪表板",
            icon: { name: "dashboard-icon" }, // 提供必要的属性
            children: [], // 确保 children 属性存在
        },
        Settings: {
            text: "设置",
            icon: { name: "settings-icon" },
            children: [], // 添加其他必要的菜单项
        },
    },
}))

// Mock routes
vi.mock("src/router/router.ts", () => ({
    routes: [
        {
            path: "/dashboard",
            name: "Dashboard",
            component: { template: "<div>Dashboard</div>" }, // 提供简单的组件模板
        },
        {
            path: "/settings",
            name: "Settings",
            component: { template: "<div>Settings</div>" },
        },
    ],
    router: {
        push: vi.fn(), // 模拟 router.push 方法
    },
}))

vi.mock("@/utils/encrypt", () => ({
    reverseString: vi.fn(),
    decryptData: vi.fn(),
}))

describe("playKeyDecryptAES2Bin", () => {
    it("应该解密加密的播放密钥并返回一个 Uint8Array", () => {
        const playKeyEncrypt = "51e8bdb7f5bed6d7c8149e0c0767ecefeFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr56fbdd4fd665d8fa"
        const expectedOutput = new Uint8Array([63, 219, 19, 240, 217, 90, 85, 53, 28, 66, 214, 119, 240, 84, 89, 53])

        // Mock reverseString and decryptData behavior
        vi.mocked(reverseString).mockImplementation((str) => str.split("").reverse().join(""))
        vi.mocked(decryptData).mockImplementation((data, key, iv) => {
            if (
                data === "eFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr" &&
                key === "fece7670c0e9418c7d6deb5f7bdb8e15" &&
                iv === "af8d566df4ddbf65"
            ) {
                return "3fdb13f0d95a55351c42d677f0545935" // Mocked decrypted hex string
            }
            throw new Error("Unexpected arguments")
        })

        const result = playKeyDecryptAES2Bin(playKeyEncrypt)

        expect(reverseString).toHaveBeenCalledWith("51e8bdb7f5bed6d7c8149e0c0767ecef")
        expect(reverseString).toHaveBeenCalledWith("56fbdd4fd665d8fa")
        expect(decryptData).toHaveBeenCalledWith(
            "eFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr",
            "fece7670c0e9418c7d6deb5f7bdb8e15",
            "af8d566df4ddbf65",
        )
        expect(result).toEqual(expectedOutput)
    })

    it("如果 decryptData 返回无效数据，则应该抛出错误", () => {
        const playKeyEncrypt = "51e8bdb7f5bed6d7c8149e0c0767ecefeFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr56fbdd4fd665d8fa"

        // Mock reverseString and decryptData behavior
        vi.mocked(reverseString).mockImplementation((str) => str.split("").reverse().join(""))
        vi.mocked(decryptData).mockImplementation(() => {
            return "invalid_hex_string" // Mocked invalid hex string
        })

        expect(() => playKeyDecryptAES2Bin(playKeyEncrypt)).toThrowError()
    })
})
