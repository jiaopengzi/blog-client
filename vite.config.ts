/*
 * @FilePath     : \blog-client\vite.config.ts
 * @Description  : vite 配置文件
 */

import { fileURLToPath, URL } from "node:url"

import terser from "@rollup/plugin-terser"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { type CommonServerOptions, defineConfig } from "vite"
import compression from "vite-plugin-compression"
import Inspect from "vite-plugin-inspect"
import tsconfigPaths from "vite-tsconfig-paths"

// 共享 dev server 和 preview server 配置
const commonServerOptions = (): CommonServerOptions => {
    return {
        host: "10.10.2.222",
        strictPort: true, // 端口被占用时直接退出，而不是尝试下一个可用端口
        port: 7364, // 项目运行端口(九宫格 peng 7364 的拼音键数字)

        // 设置代理
        proxy: {
            // dev Server.proxy 可以是一个指向开发环境 API 服务器的字符串
            "/api": {
                target: "http://10.10.2.222:5426",
                changeOrigin: true,
                // rewrite: (path:string) => path.replace(/^\/api/, 'my-admin'),
            },
            "/admin/raw-github": {
                target: "https://raw.githubusercontent.com",
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/admin\/raw-github/, ""),
            },
            "/admin/raw-gitee": {
                target: "https://gitee.com",
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/admin\/raw-gitee/, ""),
            },
        },
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths(), // tsconfig 路径别名
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

        // vite-plugin-inspect 查看编译后的文件
        Inspect(),

        // ------------------------------ gzip压缩 开始
        compression({
            verbose: true, // 是否在控制台输出压缩结果
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
        host: "10.10.2.222",
        strictPort: true, // 端口被占用时直接退出，而不是尝试下一个可用端口
        port: 7364, // 项目运行端口(九宫格 peng 7364 的拼音键数字)

        hmr: {
            protocol: "ws",
            host: "10.10.2.222",
            port: 7364,
        },

        // 设置代理
        proxy: {
            // dev Server.proxy 可以是一个指向开发环境 API 服务器的字符串
            "/api": {
                target: "http://10.10.2.222:5426",
                changeOrigin: true,
                // rewrite: (path:string) => path.replace(/^\/api/, 'my-admin'),
            },
            "/admin/raw-github": {
                target: "https://raw.githubusercontent.com",
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/admin\/raw-github/, ""),
            },
            "/admin/raw-gitee": {
                target: "https://gitee.com",
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/admin\/raw-gitee/, ""),
            },
        },
    },

    // 预览服务器配置
    preview: commonServerOptions(),

    // ------------------------------ 设置打包分块 开始
    build: {
        minify: true, //是否压缩编译后结果。
        chunkSizeWarningLimit: 500, // 打包警告阈值 单位 KB

        rollupOptions: {
            output: {
                manualChunks(id) {
                    // 打包策略
                    if (id.includes("node_modules")) {
                        // 将 'node_modules' 分割为名为 'vendor' 的代码块
                        const dirs = id.split("/")
                        const name = dirs[dirs.lastIndexOf("node_modules") + 1]

                        // // 过滤掉空包
                        // const emptyChunks = ["@floating-ui", "lodash-unified", "memoize-one", "vue"]
                        // if (emptyChunks.includes(name)) {
                        //     return
                        // }

                        return `vendor/${name}`
                    }
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
                inlineDynamicImports: false, // 将动态导入的模块内联到生成的代码中
            },
            plugins: [
                terser({
                    maxWorkers: 2, // 开启多进程压缩
                    compress: {
                        pure_funcs: ["console.log"], // 去除console.log, 保留其他 console
                        drop_debugger: true, // 去除debugger
                        passes: 3, // 压缩次数，默认为1，设置更高的值可以获得更好的压缩效果，但会增加构建时间
                    },
                    format: {
                        // 取消代码注释
                        comments: false,
                    },
                }),
            ],
        },
    },
    // ------------------------------ 设置打包分块 结束
})
