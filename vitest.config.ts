/**
 * @FilePath     : \blog-client\vitest.config.ts
 * @Description  : vite 测试配置文件
 */
import { fileURLToPath } from "node:url"

import { configDefaults, defineConfig, mergeConfig } from "vitest/config"

import viteConfig from "./vite.config"

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
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
            ],
            root: fileURLToPath(new URL("./", import.meta.url)),
            server: {
                deps: {
                    inline: ["element-plus"],
                },
            },
        },
    }),
)
