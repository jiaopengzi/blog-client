/**
 * @FilePath     : \blog-client\vitest.config.ts
 * @Description  : vite 测试配置文件
 */
import { fileURLToPath } from "node:url"

import type { UserConfig as ViteUserConfig } from "vite"
import { configDefaults, defineConfig, mergeConfig } from "vitest/config"

import viteConfig from "./vite.config"

/**
 * @description: 解析 vite.config 的导出结果, 兼容对象式与函数式配置, 以便 Vitest 安全合并。
 * @param configEnv Vite 配置环境。
 * @returns 返回可供 mergeConfig 使用的普通 Vite 配置对象。
 */
const resolveViteConfig = async (configEnv: Parameters<Exclude<typeof viteConfig, ViteUserConfig>>[0]): Promise<ViteUserConfig> => {
    if (typeof viteConfig === "function") {
        return viteConfig(configEnv)
    }

    return viteConfig
}

export default defineConfig(async (configEnv) => {
    const baseConfig = await resolveViteConfig(configEnv)

    return mergeConfig(baseConfig, {
        test: {
            setupFiles: [fileURLToPath(new URL("./vitest.setup.ts", import.meta.url))],
            environment: "jsdom",
            exclude: [
                ...configDefaults.exclude,
                "e2e/**",
                "**/node_modules/**", // 排除所有 node_modules 中的测试
                "**/vue3-emoji-picker/**", // 排除特定包的测试
                "**/dist/**",
                "**/.vscode/**",
                "**/.VSCodeCounter/**",
                "**/vite-plugin-inspect/**",
                "**/icons/**",
            ],
            root: fileURLToPath(new URL("./", import.meta.url)),
            server: {
                deps: {
                    inline: ["element-plus"],
                },
            },
        },
    })
})
