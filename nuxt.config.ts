/*
 * FilePath    : blog-client-nuxt\nuxt.config.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Nuxt 4 配置文件(SWR 水合快照一致性修复)
 */

/*
 * 补充说明:
 * 决策依据见 blog-client 仓库 .feat/client-260822-02-plan.md
 * D1 Nuxt 4.5 | D4 element-plus 按需导入 | D7 vite@8.2.1(内置 Rolldown)
 */

import { fileURLToPath, URL } from "node:url"
import fs from "node:fs"
import path from "node:path"

import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"

import vueJsx from "@vitejs/plugin-vue-jsx"

// element-plus 按需导入(D4): 与原项目 vite.config 相同的 resolver 配置(默认 css 样式导入)
const elementPlusAutoImport = AutoImport({
    dts: "auto-imports.d.ts",
    resolvers: [ElementPlusResolver()],
})

const elementPlusComponents = Components({
    dts: "components.d.ts",
    resolvers: [ElementPlusResolver()],
    directoryAsNamespace: true, // 解决组件名称重复问题 `component xxx has naming conflicts with other components, ignored.`
})

// ------------------------------ 旧 SPA vite.config.ts 移植(commonServerOptions / computeBaseUrl) 开始
// 说明: 以下按原 blog-client/vite.config.ts 移植, 仅保留与 Nuxt 不冲突的部分
// 明确不移植(与 Nuxt 内置机制冲突): strictPort、vendor 分包 groups、assetFileNames 目录规则、
// rolldown minify 定制(oxc minify 已是 Nuxt/Vite 8 默认)、resolve.tsconfigPaths(Nuxt 自行处理 TS 解析)、
// vueJsx(Nuxt 内置 JSX 支持)
const DEFAULT_HTTP_PORT = 80
const DEFAULT_HTTPS_PORT = 443
// Nuxt 迁移后固定 7364(旧 SPA 的 80/443 默认不再适用, 见 .env NITRO_PORT/PORT)
const NUXT_DEFAULT_PORT = 7364

// 判断字符串是否为 IPv4 地址(用于 devServer 监听地址判定: IP 直接绑定, 域名回退 0.0.0.0 全接口)
const isIpAddress = (value: string): boolean => /^\d{1,3}(\.\d{1,3}){3}$/.test(value)

/**
 * 解析端口字符串, 无效值返回 undefined(与旧 SPA 同名函数一致)
 */
const parsePort = (value?: string): number | undefined => {
    if (!value || value.trim() === "") {
        return undefined
    }

    const port = Number(value)
    return Number.isFinite(port) ? port : undefined
}

/**
 * 读取并标准化运行时环境变量, 支持 .env 与外部注入变量(Nuxt 惯例 NUXT_* 命名)
 */
const resolveRuntimeEnv = () => {
    const domain = process.env.NUXT_DOMAIN || "0.0.0.0"
    const httpsKey = process.env.NUXT_HTTPS_KEY || ""
    const httpsCert = process.env.NUXT_HTTPS_CERT || ""
    const clientHttpPort = parsePort(process.env.NUXT_CLIENT_HTTP_PORT)
    const clientHttpsPort = parsePort(process.env.NUXT_CLIENT_HTTPS_PORT)

    const httpsOptions =
        httpsKey && httpsCert
            ? {
                  // 与旧 SPA 一致读取证书文件内容(vite/listhen 均接受 PEM 内容)
                  key: fs.readFileSync(path.resolve(httpsKey)).toString(),
                  cert: fs.readFileSync(path.resolve(httpsCert)).toString(),
              }
            : undefined

    return {
        domain,
        httpsOptions,
        clientHttpPort,
        clientHttpsPort,
        baseUrl: process.env.NUXT_BASE_URL || "",
    }
}

const runtimeEnv = resolveRuntimeEnv()

// sitemap 同源反代基址: 与 /api 代理一致走后端(后端为主生成 sitemap, 见 routeRules)
const sitemapProxyBase = process.env.NUXT_API_BASE || "http://10.10.2.222:5426"

// 后端主机名(媒体/上传资源的实际来源, 缩略图等绝对 URL 由后端按站点可达地址生成,
// IPX 域名白名单需放行该主机, 否则 useImage 静默回退原图地址不做优化)
const backendHost = new URL(sitemapProxyBase).hostname

// dev/preview 实际使用端口(HTTPS 时取 https 端口, 否则 http 端口, 均回退 7364)
const devServerPort = runtimeEnv.httpsOptions ? runtimeEnv.clientHttpsPort || NUXT_DEFAULT_PORT : runtimeEnv.clientHttpPort || NUXT_DEFAULT_PORT

/**
 * 计算 NUXT_BASE_URL, 未显式配置时按 domain 与端口自动生成(与旧 SPA computeBaseUrl 一致)
 */
const computeBaseUrl = () => {
    // 已显式设置则保留
    if (runtimeEnv.baseUrl && runtimeEnv.baseUrl.trim() !== "") {
        return runtimeEnv.baseUrl
    }

    // 选择域名回退到 localhost(当 DOMAIN 为 0.0.0.0 时)
    const domain = runtimeEnv.domain === "0.0.0.0" ? "localhost" : runtimeEnv.domain

    if (runtimeEnv.httpsOptions) {
        const port = runtimeEnv.clientHttpsPort || NUXT_DEFAULT_PORT
        return port === DEFAULT_HTTPS_PORT ? `https://${domain}` : `https://${domain}:${port}`
    }

    const port = runtimeEnv.clientHttpPort || NUXT_DEFAULT_PORT
    return port === DEFAULT_HTTP_PORT ? `http://${domain}` : `http://${domain}:${port}`
}

export default defineNuxtConfig({
    compatibilityDate: "2026-08-22",

    // 降低 Nuxt CLI 构建日志噪音, 仅保留 warning 和 error.
    logLevel: "info",

    // P0-1(nuxt4-good): DevTools 仅开发态开启, 生产构建不注入; 迁移验收/性能分析用
    devtools: { enabled: true },

    srcDir: "src",

    // 移植自旧 SPA vite.config vue 插件选项: cropper- 自定义元素 + 删除模板注释
    vue: {
        compilerOptions: {
            isCustomElement: (tag: string) => tag.startsWith("cropper-"),
            comments: false,
        },
    },

    // 本地模块 set-env-version: 启动时生成 public/VERSION(原 scripts/set-env-version.js 前置脚本
    // 迁入 Nuxt 生命周期, 消灭 package.json 的 && 拼接, Windows 下 Ctrl+C 不再多进程信号分发)
    // P0-3(nuxt4-good): @nuxt/fonts 接管本地字体的 @font-face 生成(metadata/fallback 优化)
    modules: ["@pinia/nuxt", "@nuxt/fonts", "@nuxt/scripts", "@nuxt/image", "@/modules/set-env-version"],

    // P0-3(nuxt4-good): 字体全部自托管——禁用远程 provider(roboto 等系统栈名保持系统回退渲染,
    // 与 SPA 线上一致, 且构建不依赖外网); 两个业务字体沿用既有 family 名, 零改动 15+ 处引用;
    // 内容区字体不做全站 preload(代码块/海报按需加载), 由 fontaine 自动生成度量 fallback
    fonts: {
        providers: {
            adobe: false,
            bunny: false,
            fontshare: false,
            fontsource: false,
            google: false,
            googleicons: false,
            npm: false,
        },
        defaults: {
            preload: false,
        },
        families: [
            { name: "JBMonoWOFF2", src: "/fonts/JetBrainsMono-Medium.woff2", weight: 500 },
            { name: "SmileySans", src: "/fonts/SmileySans-Oblique.otf.woff2", weight: 500 },
        ],
    },

    // P0-5(nuxt4-good): 文章缩略图优化(IPX 服务端转换 png→webp). 缩略图为后端下发的
    // 站点同源绝对 URL(经 /api 反代上传目录), domains 需放行其携带的主机名:
    // dev 为内网 IP, 生产为站点域名; 当前项目 components:false 会禁用 NuxtImg 自动注册,
    // 缩略图组件经 useImage() composable 构建 /_ipx 地址(addImports 不受影响)
    image: {
        domains: [
            backendHost,
            // 实证: @nuxt/image 的域名校验对绝对 URL 按 host(含端口)匹配,
            // 缩略图 URL 携带 7364 端口, 需同时放行 host:port 形态
            `${backendHost}:${NUXT_DEFAULT_PORT}`,
            ...(runtimeEnv.domain && runtimeEnv.domain !== "0.0.0.0" ? [runtimeEnv.domain] : []),
            "localhost",
            "127.0.0.1",
            "10.10.2.222",
            "jiaopengzi.com",
            "www.jiaopengzi.com",
        ],
        format: ["webp"],
        quality: 80,
    },

    // @pinia/nuxt 默认把 src/stores 注册进 unimport 自动导入目录(扫描 defineStore 选项对象时
    // 会产出名为 "getters" 的重复导入告警); 本项目 store 全部显式导入, 关闭该扫描
    pinia: {
        storesDirs: [],
    },

    // 与原项目一致: 组件全部显式导入, 关闭 Nuxt 组件目录自动扫描,
    // 避免 icons/index.ts 与 index.vue 同名冲突(NUXT_B3011).
    // 2026-08-29 修正注释: 此前称 "unplugin-vue-components 仅负责 element-plus" 与事实不符——
    // 该插件仍扫描 src/components 全量组件并写入 components.d.ts(57KB, 235 个项目组件,
    // 按 directoryAsNamespace 拼名如 CommonAccountFormFooter); 运行时不受影响,
    // 因 components:false 已关闭 Nuxt 侧自动注册, 所有组件均为显式 import.
    components: false,

    // 与原项目一致: 工具/store/composable 全部显式导入,
    // 关闭目录自动导入扫描(避免 stores 目录被 unimport 扫描产生 Duplicated imports 告警)
    imports: {
        dirs: [],
    },

    css: [
        "element-plus/theme-chalk/dark/css-vars.css", // element-plus 暗黑主题 css 变量
        // 命令式 API(ElMessage/ElMessageBox) 不经过模板编译, unplugin-vue-components 不会为其
        // 注入样式; 显式引入对应组件样式(对齐 SPA 中 unplugin-auto-import 的样式注入行为),
        // 否则消息提示与确认弹窗在 Nuxt 下样式丢失
        "element-plus/theme-chalk/el-message.css",
        "element-plus/theme-chalk/el-message-box.css",
        "element-plus/theme-chalk/el-overlay.css",
        "@/assets/scss/main.scss", // 全局样式
    ],

    alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
    },

    runtimeConfig: {
        // 后端 API 地址(环境变量 NUXT_API_BASE 覆盖)
        apiBase: "",
        public: {
            // 正式站点地址, 用于 canonical 等: NUXT_PUBLIC_BASE_URL 显式优先,
            // 否则沿用旧 SPA computeBaseUrl 逻辑(NUXT_BASE_URL → NUXT_DOMAIN/端口推导)
            baseUrl: process.env.NUXT_PUBLIC_BASE_URL || computeBaseUrl(),
            // 分片哈希 Worker 并发上限(对齐 SPA 的 VITE_MAX_NAVIGATOR_HARDWARE_CONCURRENCY 语义;
            // Nuxt 惯例改用 NUXT_MAX_NAVIGATOR_HARDWARE_CONCURRENCY), 缺省回退 "4"
            maxNavigatorHardwareConcurrency: process.env.NUXT_MAX_NAVIGATOR_HARDWARE_CONCURRENCY || "4",
            // P1-7(nuxt4-good): gitTag/gitCommit/buildTime 已迁 app.config(构建期由
            // modules/set-env-version.ts 注入当日值); runtimeConfig 仅留环境敏感项
        },
    },

    // 移植自旧 SPA vite.config server: NUXT_DOMAIN / NUXT_CLIENT_HTTP_PORT / NUXT_HTTPS_*, 默认保持 7364
    devServer: {
        port: devServerPort,
        // 监听地址: NUXT_DOMAIN 为 IP(0.0.0.0/127.0.0.1 等) 时直接绑定该地址;
        // 为域名(如 jiaopengzi.com) 时绑定 0.0.0.0(全接口)——域名解析由本机 hosts/内网 DNS 负责,
        // 服务不依赖该域名能解析到本机即可启动. 若直接以公网域名做 host, get-port-please 会按
        // 公网 DNS 解析结果绑定外部 IP 而失败(EADDRNOTAVAIL → Unable to find an available port)
        host: isIpAddress(runtimeEnv.domain) ? runtimeEnv.domain : "0.0.0.0",
        https: runtimeEnv.httpsOptions,
    },

    // bug01(260901-04): SWR 首访保持 payload 内联, 避免缓存 HTML 与独立 _payload.json 分别
    // 渲染时实时字段(浏览量/点赞等)不一致而 hydration mismatch. "client" 模式仅在客户端
    // 路由跳转时抽离 payload, 兼顾首访快照一致与后续导航的独立缓存; renderJsonPayloads 仍由 Nuxt 4.5 默认开启.
    experimental: {
        payloadExtraction: "client",
    },

    // SSR HTML 瘦身(bug01 260829-02): 关闭 Nuxt 默认的组件样式内联(features.inlineStyles).
    // 默认 true 时 SSR 会在 head 内联全部已渲染组件的 <style>(实测: 首页 28 块/40KB, 文章页 32 块/62KB,
    // 其中 KaTeX 字体 @font-face 单块 29.7KB), 而同批样式的构建产物 css 分片仍以 <link rel="stylesheet">
    // 出现在同一 head 里——同一份 CSS "HTML 内联 + 外链" 双重下载, 且内联部分随 HTML 每次访问重复传输
    // (外链可被浏览器缓存跨页复用). 关闭后样式只走外链分片, 实测 HTML: 首页 -40KB / 文章页 -62KB /
    // page 页 -59KB; 样式加载语义与旧 SPA 一致(外链 css 阻塞渲染, 无闪白), 不影响水合.
    // 主题首帧所需的 id="theme-preset-style"(运行时 useHead 生成)与 app.vue 内联脚本不受本开关影响.
    features: {
        inlineStyles: false,
    },

    routeRules: {
        // D3: admin 走原来(纯 CSR), 公开页才走 SSR
        "/admin/**": { ssr: false },
        // 搜索展示页走纯 CSR(用户要求), 与旧 SPA 搜索交互一致
        "/s/**": { ssr: false },
        // Markdown 编辑页走纯 CSR(编辑器树含 customElements/CodeMirror 等浏览器依赖链, SSR 无法求值)
        "/md": { ssr: false },
        // 用户信息页走纯 CSR(用户要求, 与旧 SPA 行为一致)
        "/user-info": { ssr: false },
        // 结算支付页走纯 CSR(订单数据来自客户端支付流程, SSR 无意义)
        "/checkout": { ssr: false },
        // 系统初始化/数据库配置页走纯 CSR(表单与重启流程均为客户端语义, 与 SPA 行为一致)
        "/setup": { ssr: false },
        // 首页保持 SWR: payload 已内联于缓存 HTML, hydration 使用同一渲染快照.
        "/": { swr: 300 },
        "/category/**": { swr: 300 },
        "/tag/**": { swr: 300 },
        "/p/**": { swr: 3600 },
        // sitemap 由后端生成(阶段 5 补: 后端为主), 这里仅做同源反代——
        // 等价旧 SPA vite proxy["/sitemap"] 的 rewrite "/api/v1 + 原路径"(dev/preview/生产三态一致)
        // 生产若由 nginx 直接反代 /sitemap 到后端, 则本规则不会被命中(nginx 先拦截)
        "/sitemap.xml": { proxy: `${sitemapProxyBase}/api/v1/sitemap.xml` },
        "/sitemap/**": { proxy: `${sitemapProxyBase}/api/v1/sitemap/**` },
        // /api 同源反代: dev 由 nitro.devProxy 转发 /api, preview/生产(.output node-server) 无 devProxy,
        // 客户端相对路径 /api 请求会直接打到 nitro 而 Failed to fetch(侧边栏空、登录信息无法恢复)
        // 这里补 routeRules proxy, 使 /api/** 在 dev/preview/生产三态都转发到后端(与 sitemap 同机制,
        // nitro 按 _proxyStripBase 剥掉 /api 前缀后拼回 target, 等价 devProxy 的 httpxy 拼接语义)
        "/api/**": { proxy: `${sitemapProxyBase}/api/**` },
    },

    hooks: {
        // 归档路由扁平化: pages/year/[year].vue 与 pages/year/[year]/month/[month].vue
        // 会被文件路由生成为父子嵌套(/year/:year 成为 /year/:year/month/:month 的父级),
        // 导致月归档页挂载父级页面组件、点击年面包屑后不重挂载. 这里把 year-month
        // 从 year-only 的 children 中提升为平级路由, 并显式指定必选参数路径
        "pages:extend"(pages) {
            // 匹配依据用 path 而非 name(pages:extend 阶段 name 为文件派生名, definePageMeta 尚未生效)
            const yearParent = pages.find((page) => page.path === "/year/:year()" || page.path === "/year/:year")
            if (yearParent?.children) {
                const monthIndex = yearParent.children.findIndex((child) => child.path.startsWith("month/"))
                if (monthIndex >= 0) {
                    const [month] = yearParent.children.splice(monthIndex, 1)
                    if (month) {
                        month.path = "/year/:year/month/:month"
                        pages.push(month)
                    }
                }
            }
        },
    },

    nitro: {
        // 降低 Nuxt Nitro server built .output 构建日志.
        logLevel: 1,

        // 客户端相对路径 /api 请求在 dev 下转发到 dev 后端(SSR 直连走 NUXT_API_BASE)
        devProxy: {
            "/api": {
                // h3 app.use 会剥掉匹配前缀 "/api", httpxy 以 target.pathname + 剩余路径 拼接:
                // target 需自带 "/api", 且保持 prependPath 默认 true(显式 false 会丢弃 target 路径)
                target: "http://10.10.2.222:5426/api",
                changeOrigin: true,
            },
        },

        // P0-2(nuxt4-good): 公开资源预压缩统一由 nitro 官方机制承担, 已移除 SPA 遗产的
        // vite-plugin-compression(此前与 nitro 双重压缩)
        // brotli 刻意关闭(260831-01 问题02): 部署链路的 nginx 官方镜像(nginx:1.31.3-alpine)
        // 未编译 brotli 模块, .br 预压缩产物无任何消费者, 纯占运行镜像 ~2.6MB 体积;
        // gzip 保留, 由 nginx 的 gzip_static 直发预压缩文件
        compressPublicAssets: {
            gzip: true,
            brotli: false,
        },

        // element-plus 内联到服务端构建: resolver 注入的 theme-chalk css 副作用导入需要
        // vite-node/rolldown 处理(Node 原生 ESM 加载外部化依赖时无法解析 .css 会崩溃)
        externals: {
            inline: ["element-plus"],
        },

        alias: {
            // 计划 7.3: vue3-emoji-picker 顶层初始化 IndexedDB, 服务端指向空 stub
            "vue3-emoji-picker": fileURLToPath(new URL("./src/server-stubs/emoji-picker.ts", import.meta.url)),
        },
    },

    vite: {
        // 移植自旧 SPA vite.config plugins: element-plus 按需导入 + vueJsx
        // (P0-2: gzip 预压缩已移交 nitro.compressPublicAssets, vite-plugin-compression 移除)
        plugins: [elementPlusAutoImport, elementPlusComponents, vueJsx()],

        server: {
            // 移植自旧 SPA commonServerOptions.allowedHosts: 允许任何主机通过域名访问 dev server
            allowedHosts: true,
            watch: {
                // 移植自旧 SPA server.watch.ignored: 排除调试素材目录(文件短暂锁定 EBUSY 崩溃防护)
                // 2026-08-29 清理: 移除 **/.bug/** 与 **/.feat/**——两个目录磁盘上已不存在
                ignored: ["**/.debug/**", "**/.mimosa/**", "**/.spa2nuxt/**"],
            },
        },

        build: {
            minify: "oxc", // 使用 Vite 8 默认的 Oxc Minifier, 与 Rolldown 保持一致
            // 移植自旧 SPA build.chunkSizeWarningLimit
            chunkSizeWarningLimit: 500,

            // Rolldown 在 Nuxt 4 / Vite 8 下默认会输出插件耗时诊断; 当前告警仅用于性能剖析,
            // 不影响产物正确性. 关闭后保留真实构建告警, 避免 pnpm build 被性能提示刷屏
            rollupOptions: {
                checks: {
                    pluginTimings: false,
                },

                output: {
                    comments: false, // 取消产物中的注释
                    minify: {
                        compress: {
                            dropDebugger: true, // 去除 debugger
                            treeshake: {
                                manualPureFunctions: ["console.log"], // 将 console.log 视为纯函数, 以便在未使用返回值时移除
                            },
                        },
                        mangle: true,
                        codegen: {
                            removeWhitespace: true,
                        },
                    },
                },
            },
        },

        // dev 端 SSR 模块由 vite-node 处理: 强制 element-plus 不外部化,
        // resolver 注入的 theme-chalk css 副作用导入才能被 vite SSR 转换器吞掉
        // (否则 Node 原生 ESM 加载 .css 会报 Unknown file extension)
        ssr: {
            noExternal: ["element-plus"],
        },

        css: {
            preprocessorOptions: {
                scss: {
                    // 与原项目 vite.config 一致的全局 scss 变量注入
                    additionalData: `
                    @use "@/assets/scss/platform/_phone.scss" as phone;
                    @use "@/assets/scss/platform/_pad.scss" as pad;
                    @use "@/assets/scss/platform/_pc.scss" as pc;
                    @use "@/assets/scss/mixin.scss" as *;
                    `,
                },
            },
        },
    },
})
