// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Desktop/blog-client/node_modules/.pnpm/vite@5.4.11_@types+node@20.17.6_sass-embedded@1.81.0_sass@1.80.6_terser@5.36.0/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.4.11_@types+node@20.17.6_sass-embedded@1.81.0_sass@1.80.6_ter_a3w5hphun2vutsga4wyxx6rlrm/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.4.11_@types+node@20.17.6_sass-embedded@1.81.0_sass@1.80.6_pdaroppoj25zufa7ey3x6e375i/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import terser from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@rollup+plugin-terser@0.4.4_rollup@4.25.0/node_modules/@rollup/plugin-terser/dist/es/index.js";
import Inspect from "file:///C:/Desktop/blog-client/node_modules/.pnpm/vite-plugin-inspect@0.8.7_rollup@4.25.0_vite@5.4.11_@types+node@20.17.6_sass-embedded@1.81.0_sass@1.80.6_terser@5.36.0_/node_modules/vite-plugin-inspect/dist/index.mjs";
import tsconfigPaths from "file:///C:/Desktop/blog-client/node_modules/.pnpm/vite-tsconfig-paths@5.1.3_typescript@5.6.3_vite@5.4.11_@types+node@20.17.6_sass-embedded@1.81_45o7oc3wwr76ndvxl25adnlkpa/node_modules/vite-tsconfig-paths/dist/index.js";
import AutoImport from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.1_vue@3.5.12_typescript@5.6.3___rollup@4.25.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.26.2_rollup@4.25.0_vue@3.5.12_typescript@5.6.3_/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.26.2_rollup@4.25.0_vue@3.5.12_typescript@5.6.3_/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_import_meta_url = "file:///C:/Desktop/blog-client/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    tsconfigPaths(),
    // tsconfig 路径别名
    vue(),
    vueJsx(),
    Inspect(),
    // vite-plugin-inspect 查看编译后的文件
    // ------------------------------element-plus 自动导入 开始
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: "sass" })],
      //scss需要添加 { importStyle: 'sass' } 留空默认为css
      directoryAsNamespace: true
      // 解决组件名称重复问题 `component xxx has naming conflicts with other components, ignored.`
    })
    // ------------------------------element-plus 自动导入 结束
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
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
        @use '@/assets/scss/platform/pc.scss' as pc;
        @use '@/assets/scss/mixin.scss' as *;
        `
      }
      // devSourceMap: true, // 开发环境下是否生成 sourceMap
    }
  },
  // ------------------------------ scss全局变量生效 结束
  // ------------------------------ 设置代理 开始
  server: {
    host: "localhost",
    port: 7364,
    // 项目运行端口(九宫格 peng 的拼音键数字)
    proxy: {
      // dev Server.proxy 可以是一个指向开发环境 API 服务器的字符串
      "/api": {
        target: "http://10.10.2.222:5426",
        changeOrigin: true
        // rewrite: (path) => path.replace(/^\/api/, 'my-admin'),
      }
    }
  },
  // ------------------------------ 设置代理 结束
  // ------------------------------ 设置打包分块 开始
  build: {
    minify: true,
    //是否压缩编译后结果。
    chunkSizeWarningLimit: 500,
    // 打包警告阈值 单位 KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const dirs = id.split("/");
            const name = dirs[dirs.lastIndexOf("node_modules") + 1];
            return `vendor/${name}`;
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
        inlineDynamicImports: false
        // 将动态导入的模块内联到生成的代码中
      },
      plugins: [
        terser({
          maxWorkers: 2,
          // 开启多进程压缩
          compress: {
            // TODO 去除console.log,保留其他console
            // pure_funcs: ['console.log'], // 去除console.log,保留其他console
            // drop_debugger: true // 去除debugger
          }
        })
      ]
    }
  }
  // ------------------------------ 设置打包分块 结束
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxEZXNrdG9wXFxcXGJsb2ctY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxEZXNrdG9wXFxcXGJsb2ctY2xpZW50XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9EZXNrdG9wL2Jsb2ctY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7LypcclxuICogQEZpbGVQYXRoICAgICA6IFxcYmxvZy1jbGllbnRcXHZpdGUuY29uZmlnLnRzXHJcbiAqIEBEZXNjcmlwdGlvbiAgOiB2aXRlIFx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gXCJub2RlOnVybFwiXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCJcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCJcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiXHJcbmltcG9ydCB0ZXJzZXIgZnJvbSBcIkByb2xsdXAvcGx1Z2luLXRlcnNlclwiIC8vIFx1NEYxQVx1NjJBNVx1OTUxOSBcdTZDQTFcdTY3MDlcdThDMDNcdTc1MjhcdTdCN0VcdTU0MERcdTMwMDIgXHU0RjQ2XHU2NjJGXHU0RTBEXHU1RjcxXHU1NENEXHU0RjdGXHU3NTI4XHJcbmltcG9ydCBJbnNwZWN0IGZyb20gXCJ2aXRlLXBsdWdpbi1pbnNwZWN0XCJcclxuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIlxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1lbGVtZW50LXBsdXMgXHU2MzA5XHU5NzAwXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFx1NUYwMFx1NTlDQlxyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCJcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIlxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1lbGVtZW50LXBsdXMgXHU2MzA5XHU5NzAwXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFx1N0VEM1x1Njc1RlxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB0c2NvbmZpZ1BhdGhzKCksIC8vIHRzY29uZmlnIFx1OERFRlx1NUY4NFx1NTIyQlx1NTQwRFxyXG4gICAgICAgIHZ1ZSgpLFxyXG4gICAgICAgIHZ1ZUpzeCgpLFxyXG4gICAgICAgIEluc3BlY3QoKSwgLy8gdml0ZS1wbHVnaW4taW5zcGVjdCBcdTY3RTVcdTc3MEJcdTdGMTZcdThCRDFcdTU0MEVcdTc2ODRcdTY1ODdcdTRFRjZcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1lbGVtZW50LXBsdXMgXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFx1NUYwMFx1NTlDQlxyXG4gICAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKHsgaW1wb3J0U3R5bGU6IFwic2Fzc1wiIH0pXSwgLy9zY3NzXHU5NzAwXHU4OTgxXHU2REZCXHU1MkEwIHsgaW1wb3J0U3R5bGU6ICdzYXNzJyB9IFx1NzU1OVx1N0E3QVx1OUVEOFx1OEJBNFx1NEUzQWNzc1xyXG5cclxuICAgICAgICAgICAgZGlyZWN0b3J5QXNOYW1lc3BhY2U6IHRydWUsIC8vIFx1ODlFM1x1NTFCM1x1N0VDNFx1NEVGNlx1NTQwRFx1NzlGMFx1OTFDRFx1NTkwRFx1OTVFRVx1OTg5OCBgY29tcG9uZW50IHh4eCBoYXMgbmFtaW5nIGNvbmZsaWN0cyB3aXRoIG90aGVyIGNvbXBvbmVudHMsIGlnbm9yZWQuYFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWVsZW1lbnQtcGx1cyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgXHU3RUQzXHU2NzVGXHJcbiAgICBdLFxyXG5cclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICBcIkBcIjogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmNcIiwgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gc2Nzc1x1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1NzUxRlx1NjU0OCBcdTVGMDBcdTU5Q0JcclxuICAgIGNzczoge1xyXG4gICAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETyBcdTY2ODJcdTY1RjZcdTZEODhcdTk2NjRcdThCNjZcdTU0NEFcdUZGMENcdTkwRThcdTdGNzJcdTUyNERcdTUxOERcdTU5MDRcdTc0MDYgXHU1M0MyXHU4MDAzaHR0cHM6Ly9zYXNzLWxhbmcuY29tL2RvY3VtZW50YXRpb24vYnJlYWtpbmctY2hhbmdlcy9sZWdhY3ktanMtYXBpL1xyXG4gICAgICAgICAgICAgICAgc2lsZW5jZURlcHJlY2F0aW9uczogW1wibGVnYWN5LWpzLWFwaVwiXSxcclxuICAgICAgICAgICAgICAgIC8vIFx1NTkxQVx1NEUyQXNjc3NcdTY1ODdcdTRFRjZcdTUzRDhcdTkxQ0ZcdTc1MUZcdTY1NDhcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgXHJcbiAgICAgICAgQHVzZSBcIkAvYXNzZXRzL3Njc3MvdGhlbWVzL2luZGV4LnNjc3NcIiBhcyAqO1xyXG4gICAgICAgIEB1c2UgJ0AvYXNzZXRzL3Njc3MvcGxhdGZvcm0vcGhvbmUuc2NzcycgYXMgcGhvbmU7XHJcbiAgICAgICAgQHVzZSAnQC9hc3NldHMvc2Nzcy9wbGF0Zm9ybS9wYy5zY3NzJyBhcyBwYztcclxuICAgICAgICBAdXNlICdAL2Fzc2V0cy9zY3NzL21peGluLnNjc3MnIGFzICo7XHJcbiAgICAgICAgYCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gZGV2U291cmNlTWFwOiB0cnVlLCAvLyBcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMEJcdTY2MkZcdTU0MjZcdTc1MUZcdTYyMTAgc291cmNlTWFwXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gc2Nzc1x1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1NzUxRlx1NjU0OCBcdTdFRDNcdTY3NUZcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcdThCQkVcdTdGNkVcdTRFRTNcdTc0MDYgXHU1RjAwXHU1OUNCXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBob3N0OiBcImxvY2FsaG9zdFwiLFxyXG4gICAgICAgIHBvcnQ6IDczNjQsIC8vIFx1OTg3OVx1NzZFRVx1OEZEMFx1ODg0Q1x1N0FFRlx1NTNFMyhcdTRFNURcdTVCQUJcdTY4M0MgcGVuZyBcdTc2ODRcdTYyRkNcdTk3RjNcdTk1MkVcdTY1NzBcdTVCNTcpXHJcbiAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICAgLy8gZGV2IFNlcnZlci5wcm94eSBcdTUzRUZcdTRFRTVcdTY2MkZcdTRFMDBcdTRFMkFcdTYzMDdcdTU0MTFcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODMgQVBJIFx1NjcwRFx1NTJBMVx1NTY2OFx1NzY4NFx1NUI1N1x1N0IyNlx1NEUzMlxyXG4gICAgICAgICAgICBcIi9hcGlcIjoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xMC4xMC4yLjIyMjo1NDI2XCIsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAvLyByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJ215LWFkbWluJyksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHU4QkJFXHU3RjZFXHU0RUUzXHU3NDA2IFx1N0VEM1x1Njc1RlxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFx1OEJCRVx1N0Y2RVx1NjI1M1x1NTMwNVx1NTIwNlx1NTc1NyBcdTVGMDBcdTU5Q0JcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgbWluaWZ5OiB0cnVlLCAvL1x1NjYyRlx1NTQyNlx1NTM4Qlx1N0YyOVx1N0YxNlx1OEJEMVx1NTQwRVx1N0VEM1x1Njc5Q1x1MzAwMlxyXG4gICAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLCAvLyBcdTYyNTNcdTUzMDVcdThCNjZcdTU0NEFcdTk2MDhcdTUwM0MgXHU1MzU1XHU0RjREIEtCXHJcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFx1NjI1M1x1NTMwNVx1N0I1Nlx1NzU2NVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBcdTVDMDYgJ25vZGVfbW9kdWxlcycgXHU1MjA2XHU1MjcyXHU0RTNBXHU1NDBEXHU0RTNBICd2ZW5kb3InIFx1NzY4NFx1NEVFM1x1NzgwMVx1NTc1N1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXJzID0gaWQuc3BsaXQoXCIvXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBkaXJzW2RpcnMubGFzdEluZGV4T2YoXCJub2RlX21vZHVsZXNcIikgKyAxXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYHZlbmRvci8ke25hbWV9YFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHU1QzA2XHU2MjUzXHU1MzA1XHU2NTg3XHU0RUY2XHU2MzA5XHU3MTY3XHU3QzdCXHU1NzhCXHU3NkVFXHU1RjU1XHU1MjA2XHU3QzdCIFx1NUYwMFx1NTlDQlxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1OTcwMFx1ODk4MVx1NjU4N1x1NEVGNlx1NTQwRCBcdTVGMDBcdTUzRDFcdTZBMjFcdTVGMEZcdTRFMEJcclxuICAgICAgICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiBcInN0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzXCIsXHJcbiAgICAgICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qc1wiLFxyXG4gICAgICAgICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IFwic3RhdGljL1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF1cIixcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdTRFMERcdTk3MDBcdTg5ODFcdTY1ODdcdTRFRjZcdTU0MEQgXHU2NkY0XHU1MkEwXHU3QjgwXHU2RDAxIFx1NzUxRlx1NEVBN1x1NkEyMVx1NUYwRlx1NEUwQlxyXG4gICAgICAgICAgICAgICAgLy8gY2h1bmtGaWxlTmFtZXM6ICdzdGF0aWMvanMvW2hhc2hdLmpzJyxcclxuICAgICAgICAgICAgICAgIC8vIGVudHJ5RmlsZU5hbWVzOiAnc3RhdGljL2pzL1toYXNoXS5qcycsXHJcbiAgICAgICAgICAgICAgICAvLyBhc3NldEZpbGVOYW1lczogJ3N0YXRpYy9bZXh0XS9baGFzaF0uW2V4dF0nLFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcdTVDMDZcdTYyNTNcdTUzMDVcdTY1ODdcdTRFRjZcdTYzMDlcdTcxNjdcdTdDN0JcdTU3OEJcdTc2RUVcdTVGNTVcdTUyMDZcdTdDN0IgXHU3RUQzXHU2NzVGXHJcbiAgICAgICAgICAgICAgICBpbmxpbmVEeW5hbWljSW1wb3J0czogZmFsc2UsIC8vIFx1NUMwNlx1NTJBOFx1NjAwMVx1NUJGQ1x1NTE2NVx1NzY4NFx1NkEyMVx1NTc1N1x1NTE4NVx1ODA1NFx1NTIzMFx1NzUxRlx1NjIxMFx1NzY4NFx1NEVFM1x1NzgwMVx1NEUyRFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICAgICAgICB0ZXJzZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1heFdvcmtlcnM6IDIsIC8vIFx1NUYwMFx1NTQyRlx1NTkxQVx1OEZEQlx1N0EwQlx1NTM4Qlx1N0YyOVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gXHU1M0JCXHU5NjY0Y29uc29sZS5sb2csXHU0RkREXHU3NTU5XHU1MTc2XHU0RUQ2Y29uc29sZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJ10sIC8vIFx1NTNCQlx1OTY2NGNvbnNvbGUubG9nLFx1NEZERFx1NzU1OVx1NTE3Nlx1NEVENmNvbnNvbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZHJvcF9kZWJ1Z2dlcjogdHJ1ZSAvLyBcdTUzQkJcdTk2NjRkZWJ1Z2dlclxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcdThCQkVcdTdGNkVcdTYyNTNcdTUzMDVcdTUyMDZcdTU3NTcgXHU3RUQzXHU2NzVGXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFLQSxTQUFTLGVBQWUsV0FBVztBQUNuQyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sWUFBWTtBQUNuQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxtQkFBbUI7QUFFMUIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFmcUgsSUFBTSwyQ0FBMkM7QUFtQjFNLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLGNBQWM7QUFBQTtBQUFBLElBQ2QsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsUUFBUTtBQUFBO0FBQUE7QUFBQSxJQUVSLFdBQVc7QUFBQSxNQUNQLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLElBQ3JDLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNQLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxhQUFhLE9BQU8sQ0FBQyxDQUFDO0FBQUE7QUFBQSxNQUV4RCxzQkFBc0I7QUFBQTtBQUFBLElBQzFCLENBQUM7QUFBQTtBQUFBLEVBRUw7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDeEQ7QUFBQSxFQUNKO0FBQUE7QUFBQSxFQUVBLEtBQUs7QUFBQSxJQUNELHFCQUFxQjtBQUFBLE1BQ2pCLE1BQU07QUFBQTtBQUFBLFFBRUYscUJBQXFCLENBQUMsZUFBZTtBQUFBO0FBQUEsUUFFckMsZ0JBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BTXBCO0FBQUE7QUFBQSxJQUVKO0FBQUEsRUFDSjtBQUFBO0FBQUE7QUFBQSxFQUdBLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUEsTUFFSCxRQUFRO0FBQUEsUUFDSixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUE7QUFBQSxNQUVsQjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUE7QUFBQTtBQUFBLEVBR0EsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBO0FBQUEsSUFDUix1QkFBdUI7QUFBQTtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGFBQWEsSUFBSTtBQUViLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUU3QixrQkFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHO0FBQ3pCLGtCQUFNLE9BQU8sS0FBSyxLQUFLLFlBQVksY0FBYyxJQUFJLENBQUM7QUFDdEQsbUJBQU8sVUFBVSxJQUFJO0FBQUEsVUFDekI7QUFBQSxRQUNKO0FBQUE7QUFBQTtBQUFBLFFBSUEsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBUWhCLHNCQUFzQjtBQUFBO0FBQUEsTUFDMUI7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNMLE9BQU87QUFBQSxVQUNILFlBQVk7QUFBQTtBQUFBLFVBQ1osVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBSVY7QUFBQSxRQUNKLENBQUM7QUFBQSxNQUNMO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQTtBQUVKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
