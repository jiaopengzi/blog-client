/*
 * @FilePath     : \blog-client\vite.config.ts
 * @Description  : vite 配置文件
 */

import { fileURLToPath, URL } from "node:url"
import fs from "node:fs"
import path from "node:path"

import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { type CommonServerOptions, defineConfig, loadEnv } from "vite"
import compression from "vite-plugin-compression"
// import { DevTools } from "@vitejs/devtools"
// import Inspect from "vite-plugin-inspect"

const DEFAULT_HTTP_PORT = 80
const DEFAULT_HTTPS_PORT = 443

/**
 * 解析端口字符串, 无效值返回 undefined.
 */
const parsePort = (value?: string): number | undefined => {
    if (!value || value.trim() === "") {
        return undefined
    }

    const port = Number(value)
    return Number.isFinite(port) ? port : undefined
}

/**
 * 分包策略: 将 node_modules 中的依赖按包名分组到 vendor 目录下, 例如 node_modules/lodash 会被分到 vendor/lodash.js
 * 这样做的好处是:
 * 1. 更清晰的包结构, 便于分析和调试
 * 2. 依赖更新时只会影响对应的包, 而不是整个 vendor 文件, 可以更好地利用浏览器缓存
 * 3. 避免单一 vendor 文件过大导致的性能问题
 * 4. 与现代浏览器的 HTTP/2 多路复用特性更好地配合, 允许同时加载多个较小的文件而不是一个大的文件
 * 5. 未来可以根据需要对特定包进行单独优化或处理, 而不影响其他依赖
 */
const resolveVendorChunkGroupName = (moduleId: string): string | null => {
    if (!moduleId.includes("node_modules")) {
        return null
    }

    const pathSegments = moduleId.split(/[\\/]/)
    const nodeModulesIndex = pathSegments.lastIndexOf("node_modules")
    const packageName = pathSegments[nodeModulesIndex + 1]

    return packageName ? `vendor/${packageName}` : null
}

/**
 * 读取并标准化运行时环境变量, 支持 .env 与外部注入变量.
 */
const resolveRuntimeEnv = (mode: string) => {
    const env = loadEnv(mode, process.cwd(), "")

    const domain = env.VITE_DOMAIN || "0.0.0.0"
    const httpsKey = env.VITE_HTTPS_KEY || ""
    const httpsCert = env.VITE_HTTPS_CERT || ""
    const clientHttpPort = parsePort(env.VITE_CLIENT_HTTP_PORT)
    const clientHttpsPort = parsePort(env.VITE_CLIENT_HTTPS_PORT)

    const httpsOptions =
        httpsKey && httpsCert
            ? {
                  key: fs.readFileSync(path.resolve(httpsKey)),
                  cert: fs.readFileSync(path.resolve(httpsCert)),
              }
            : undefined

    return {
        domain,
        httpsOptions,
        clientHttpPort,
        clientHttpsPort,
        baseUrl: env.VITE_BASE_URL || "",
    }
}

/**
 * 共享 dev server 和 preview server 配置.
 */
const commonServerOptions = (runtimeEnv: ReturnType<typeof resolveRuntimeEnv>): CommonServerOptions => {
    return {
        allowedHosts: true, // 允许任何主机通过域名访问 dev server
        strictPort: true, // 端口被占用时直接退出，而不是尝试下一个可用端口
        port: runtimeEnv.httpsOptions ? runtimeEnv.clientHttpsPort || DEFAULT_HTTPS_PORT : runtimeEnv.clientHttpPort || DEFAULT_HTTP_PORT, // 项目运行端口，默认 443/80

        // 设置代理
        proxy: {
            // dev Server.proxy 可以是一个指向开发环境 API 服务器的字符串
            "/api": {
                target: "http://10.10.2.222:5426",
                changeOrigin: true,
                // rewrite: (path:string) => path.replace(/^\/api/, 'my-admin'),
            },

            "/sitemap": {
                target: "http://10.10.2.222:5426",
                changeOrigin: true,
                rewrite: (requestPath) => {
                    return `/api/v1${requestPath}`
                },
            },
        },
    }
}

// https://vitejs.dev/config/
// 如果未在 .env 中显式设置 VITE_BASE_URL，则根据 DOMAIN/端口自动构造
/**
 * 计算 VITE_BASE_URL, 未显式配置时按 domain 与端口自动生成.
 */
function computeBaseUrl(runtimeEnv: ReturnType<typeof resolveRuntimeEnv>) {
    // 已显式设置则保留
    if (runtimeEnv.baseUrl && runtimeEnv.baseUrl.trim() !== "") {
        return runtimeEnv.baseUrl
    }

    // 选择域名回退到 localhost（当 DOMAIN 为 0.0.0.0 时）
    const domain = runtimeEnv.domain === "0.0.0.0" ? "localhost" : runtimeEnv.domain

    if (runtimeEnv.httpsOptions) {
        const port = runtimeEnv.clientHttpsPort || DEFAULT_HTTPS_PORT
        return port === 443 ? `https://${domain}` : `https://${domain}:${port}`
    }

    const port = runtimeEnv.clientHttpPort || DEFAULT_HTTP_PORT
    return port === 80 ? `http://${domain}` : `http://${domain}:${port}`
}

export default defineConfig(({ mode }) => {
    const runtimeEnv = resolveRuntimeEnv(mode)

    // 在 Vite 配置阶段设置环境变量，供应用通过 import.meta.env.VITE_BASE_URL 使用
    process.env.VITE_BASE_URL = computeBaseUrl(runtimeEnv)

    return {
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        isCustomElement: (tag) => {
                            return tag.startsWith("cropper-")
                        }, // 处理自定义元素警告 [Vue warn]: Failed to resolve component
                        comments: false, // 删除模板中的注释
                    },
                },
            }),
            vueJsx(),

            // ------------------------------element-plus 自动导入 开始
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver({ importStyle: "sass" })], //scss需要添加 { importStyle: 'sass' } 留空默认为css

                directoryAsNamespace: true, // 解决组件名称重复问题 `component xxx has naming conflicts with other components, ignored.`
            }),
            // ------------------------------element-plus 自动导入 结束

            // // vite-plugin-inspect 查看编译后的文件
            // Inspect(),
            // DevTools(),

            // ------------------------------ gzip压缩 开始
            compression({
                verbose: false, // 保留 .gz 预压缩产物, 但不输出逐文件压缩日志
                disable: false, // 是否禁用压缩
                threshold: 1024, // 只有大于该值的文件会被压缩 (单位：字节)
                algorithm: "gzip", // 压缩算法, 可选 ['gzip', 'brotliCompress', 'deflate', 'deflateRaw']
                ext: ".gz", // 生成的压缩文件后缀
                deleteOriginFile: false, // 是否删除原文件
                filter: (file) => {
                    return /\.(js|mjs|json|css|html|svg)$/.test(file)
                },
            }),
            // ------------------------------ gzip压缩 结束
        ],

        resolve: {
            tsconfigPaths: true,
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        // ------------------------------ scss全局变量生效 开始
        css: {
            preprocessorOptions: {
                scss: {
                    // 多个scss文件变量生效
                    additionalData: `
                    @use '@/assets/scss/platform/_phone.scss' as phone;
                    @use '@/assets/scss/platform/_pad.scss' as pad;
                    @use '@/assets/scss/platform/_pc.scss' as pc;
                    @use '@/assets/scss/mixin.scss' as *;
                    `,
                },
                // devSourceMap: true, // 开发环境下是否生成 sourceMap
            },
        },

        // 开发服务器配置
        server: {
            ...commonServerOptions(runtimeEnv),
            host: runtimeEnv.domain,
            // 如果提供了证书则启用 https
            https: runtimeEnv.httpsOptions,
        },

        // 预览服务器配置
        preview: {
            ...commonServerOptions(runtimeEnv),
            host: runtimeEnv.domain,
            https: runtimeEnv.httpsOptions,
        },

        // ------------------------------ 设置打包分块 开始
        build: {
            minify: "oxc", // 使用 Vite 8 默认的 Oxc Minifier, 与 Rolldown 保持一致
            chunkSizeWarningLimit: 500, // 打包警告阈值 单位 KB

            rolldownOptions: {
                // devtools: {}, // enable devtools mode
                checks: {
                    pluginTimings: false,
                },
                output: {
                    codeSplitting: {
                        groups: [
                            {
                                test: /node_modules[\\/]/,
                                name: resolveVendorChunkGroupName,
                            },
                        ],
                    },
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
                    // ------------------------------ 将打包文件按照类型目录分类 开始

                    // 静态资源需要文件名 开发模式下
                    chunkFileNames: "static/js/[name]-[hash].js",
                    entryFileNames: "static/js/[name]-[hash].js",
                    assetFileNames: "static/[ext]/[name]-[hash].[ext]",

                    // 静态资源不需要文件名 更加简洁 生产模式下
                    // chunkFileNames: 'static/js/[hash].js',
                    // entryFileNames: 'static/js/[hash].js',
                    // assetFileNames: 'static/[ext]/[hash].[ext]',

                    // ------------------------------ 将打包文件按照类型目录分类 结束
                },
            },
        },
        // ------------------------------ 设置打包分块 结束
    }
})
