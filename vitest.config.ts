/**
 * FilePath    : blog-client\vitest.config.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : vitest 测试配置(Node 纯计算测试及 jsdom/Nuxt 测试分组)
 */

/**
 * 补充说明:
 * 经 @nuxt/test-utils 的 defineVitestConfig 挂载 Nuxt vite 链(别名/auto-import/
 * 插件); DOM 测试使用 jsdom, 纯计算测试使用独立 Node 项目; *.nuxt.test.ts 由 defineVitestConfig 分配到 nuxt
 * 环境(vitest-environment-nuxt, 真实运行时解析, 逐步替代 server-stubs);
 * element-plus 按需解析插件保留(nuxt.config 中 components:false, 测试仍需 el-* 解析)
 */

import { fileURLToPath, URL } from "node:url"

import type { ViteUserConfig } from "vitest/config"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { defineVitestConfig } from "@nuxt/test-utils/config"

const nodeTestPatterns = [
    "src/utils/{attribute,cssExample,cssValidator,dateTime,escape,obj,regexPatterns,slug,tagSort,unit,version}.test.ts",
    "src/pkg/codemirror/extension/mdlint/rule/__test__/*.test.ts",
]

const nuxtVitestConfig = defineVitestConfig({
    // element-plus 按需解析(仅 el-* resolver, 不扫描组件目录——与主应用 components:false
    // 哲学一致; 此前默认扫描 src/components 产生大量 "component xxx has naming conflicts"
    // 告警[Edit/Add/View/Header 等 flat 命名跨目录撞名], dirs:[] 后告警清零);
    // 注意不重复挂 @vitejs/plugin-vue——defineVitestConfig 的 nuxt vite 链已含 vue 插件,
    // 双插件叠加会对带 [...] 的路由文件产生空 SFC 解析错误
    plugins: [
        Components({
            dts: false,
            dirs: [],
            resolvers: [ElementPlusResolver()],
        }),
    ],
    test: {
        setupFiles: [fileURLToPath(new URL("./vitest.setup.ts", import.meta.url))],
        environment: "jsdom",
        environmentOptions: {
            nuxt: {
                domEnvironment: "jsdom",
            },
        },
        // P1-6: nuxt 环境的 setupNuxt 需拉起完整应用(EP 内联/多模块), 本机首启超过默认 10s
        hookTimeout: 120000,
        exclude: ["**/node_modules/**", "**/vue3-emoji-picker/**", "**/dist/**", "**/.nuxt/**", "**/.output/**", "**/icons/**", ...nodeTestPatterns],
        server: {
            deps: {
                inline: ["element-plus"],
            },
        },
    },
})

/**
 * 构建 Nuxt, jsdom 和纯计算 Node 测试项目.
 * @param environment - Vite 当前配置环境.
 * @returns 包含三个测试项目的配置.
 */
async function createVitestConfiguration(environment: Parameters<typeof nuxtVitestConfig>[0]): Promise<ViteUserConfig> {
    const config = (await nuxtVitestConfig(environment)) as ViteUserConfig
    config.test!.projects = [
        ...(config.test!.projects ?? []),
        {
            extends: false,
            resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
            test: { name: "node", environment: "node", include: nodeTestPatterns },
        },
    ]
    return config
}

export default createVitestConfiguration
