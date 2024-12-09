/*
 * @FilePath     : \blog-client\vite.config.ts
 * @Description  : vite 配置文件
 */

import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import terser from "@rollup/plugin-terser" // 会报错 没有调用签名。 但是不影响使用
import Inspect from "vite-plugin-inspect"
import tsconfigPaths from "vite-tsconfig-paths"
// ------------------------------element-plus 按需自动导入 开始
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
// ------------------------------element-plus 按需自动导入 结束

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths(), // tsconfig 路径别名
        vue(),
        vueJsx(),
        Inspect(), // vite-plugin-inspect 查看编译后的文件
        // ------------------------------element-plus 自动导入 开始
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver({ importStyle: "sass" })], //scss需要添加 { importStyle: 'sass' } 留空默认为css

            directoryAsNamespace: true, // 解决组件名称重复问题 `component xxx has naming conflicts with other components, ignored.`
        }),
        // ------------------------------element-plus 自动导入 结束
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
                // TODO 暂时消除警告，部署前再处理 参考https://sass-lang.com/documentation/breaking-changes/legacy-js-api/
                silenceDeprecations: ["legacy-js-api"],
                // 多个scss文件变量生效
                additionalData: `
                    @use "@/assets/scss/themes/index.scss" as *;
                    @use '@/assets/scss/platform/phone.scss' as phone;
                    @use '@/assets/scss/platform/pad.scss' as pad;
                    @use '@/assets/scss/platform/pc.scss' as pc;
                    @use '@/assets/scss/mixin.scss' as *;
                    `,
            },
            // devSourceMap: true, // 开发环境下是否生成 sourceMap
        },
    },
    // ------------------------------ scss全局变量生效 结束
    // ------------------------------ 设置代理 开始
    server: {
        host: "localhost",
        port: 7364, // 项目运行端口(九宫格 peng 的拼音键数字)
        proxy: {
            // dev Server.proxy 可以是一个指向开发环境 API 服务器的字符串
            "/api": {
                target: "http://10.10.2.222:5426",
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, 'my-admin'),
            },
        },
    },
    // ------------------------------ 设置代理 结束
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
                        // TODO 去除console.log,保留其他console
                        // pure_funcs: ['console.log'], // 去除console.log,保留其他console
                        // drop_debugger: true // 去除debugger
                    },
                }),
            ],
        },
    },
    // ------------------------------ 设置打包分块 结束
})
