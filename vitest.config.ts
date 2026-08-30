/*
 * FilePath    : blog-client-nuxt\vitest.config.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : vitest 测试配置(纯单测 + Nuxt 环境灰度, P1-6 nuxt4-good)
 */

/*
 * 补充说明:
 * 经 @nuxt/test-utils 的 defineVitestConfig 挂载 Nuxt vite 链(别名/auto-import/
 * 插件); DOM 统一使用 happy-dom(替换 jsdom: 更轻量更快, 与 test-utils 默认一致,
 * 消除两套 DOM 实现并存); *.nuxt.test.ts 后缀经 environmentMatchGlobs 走 nuxt
 * 环境(vitest-environment-nuxt, 真实运行时解析, 逐步替代 server-stubs);
 * element-plus 按需解析插件保留(nuxt.config 中 components:false, 测试仍需 el-* 解析)
 */

import { fileURLToPath, URL } from "node:url"

import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { defineVitestConfig } from "@nuxt/test-utils/config"

export default defineVitestConfig({
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
        environment: "happy-dom",
        // happy-dom 对外链 <script> 的文件加载默认禁用并抛 NotSupportedError 刷 stderr;
        // 测试内均以 mock load 事件/DOM 形态断言, 开启"按成功处理"贴合测试语义
        // 注意键名为 happyDOM(大写)——vitest 环境以 { happyDOM } 解构, 写成 happyDom 会被静默忽略
        environmentOptions: {
            happyDOM: {
                settings: {
                    handleDisabledFileLoadingAsSuccess: true,
                },
            },
        },
        // P1-6: nuxt 环境的 setupNuxt 需拉起完整应用(EP 内联/多模块), 本机首启超过默认 10s
        hookTimeout: 120000,
        // P1-6: Nuxt 环境灰度——仅 *.nuxt.test.ts 走真实 Nuxt 运行时
        environmentMatchGlobs: [["**/*.nuxt.test.ts", "nuxt"]],
        exclude: [
            "**/node_modules/**",
            "**/vue3-emoji-picker/**",
            "**/dist/**",
            "**/.nuxt/**",
            "**/.output/**",
            "**/icons/**",
        ],
        server: {
            deps: {
                inline: ["element-plus"],
            },
        },
    },
})
