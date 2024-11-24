// vite.config.ts
import path from "path";
import { defineConfig } from "file:///C:/Desktop/blog-client/node_modules/.pnpm/vite@5.4.11_@types+node@20.17.6_sass@1.80.6_terser@5.36.0/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.4.11_@types+node@20.17.6_sass@1.80.6_terser@5.36.0__vue@3.5.12_typescript@5.6.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.4.11_@types+node@20.17.6_sass@1.80.6_terser@5.36.0__vue@3.5.12_typescript@5.6.3_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import terser from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@rollup+plugin-terser@0.4.4_rollup@4.25.0/node_modules/@rollup/plugin-terser/dist/es/index.js";
import Inspect from "file:///C:/Desktop/blog-client/node_modules/.pnpm/vite-plugin-inspect@0.8.7_rollup@4.25.0_vite@5.4.11_@types+node@20.17.6_sass@1.80.6_terser@5.36.0_/node_modules/vite-plugin-inspect/dist/index.mjs";
import AutoImport from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.1_vue@3.5.12_typescript@5.6.3___rollup@4.25.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.26.2_rollup@4.25.0_vue@3.5.12_typescript@5.6.3_/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.26.2_rollup@4.25.0_vue@3.5.12_typescript@5.6.3_/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_dirname = "C:\\Desktop\\blog-client";
var vite_config_default = defineConfig({
  plugins: [
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
      "@": path.resolve(__vite_injected_original_dirname, "src")
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
        @use "./src/assets/scss/themes/index.scss" as *;
        @use './src/assets/scss/platform/phone.scss' as phone;
        @use './src/assets/scss/platform/pc.scss' as pc;
        @use './src/assets/scss/mixin.scss' as *;
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
        // rewrite: (path) => path.replace(/^\/api/, 'myadmin'),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxEZXNrdG9wXFxcXGJsb2ctY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxEZXNrdG9wXFxcXGJsb2ctY2xpZW50XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9EZXNrdG9wL2Jsb2ctY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7LypcclxuICogQEZpbGVQYXRoICAgICA6IFxcYmxvZy1jbGllbnRcXHZpdGUuY29uZmlnLnRzXHJcbiAqIEBEZXNjcmlwdGlvbiAgOiB2aXRlIFx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxyXG4gKi9cclxuXHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCJcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIlxyXG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCJcclxuaW1wb3J0IHRlcnNlciBmcm9tIFwiQHJvbGx1cC9wbHVnaW4tdGVyc2VyXCIgLy8gXHU0RjFBXHU2MkE1XHU5NTE5IFx1NkNBMVx1NjcwOVx1OEMwM1x1NzUyOFx1N0I3RVx1NTQwRFx1MzAwMiBcdTRGNDZcdTY2MkZcdTRFMERcdTVGNzFcdTU0Q0RcdTRGN0ZcdTc1MjhcclxuaW1wb3J0IEluc3BlY3QgZnJvbSBcInZpdGUtcGx1Z2luLWluc3BlY3RcIlxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1lbGVtZW50LXBsdXMgXHU2MzA5XHU5NzAwXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFx1NUYwMFx1NTlDQlxyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCJcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIlxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1lbGVtZW50LXBsdXMgXHU2MzA5XHU5NzAwXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFx1N0VEM1x1Njc1RlxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB2dWUoKSxcclxuICAgICAgICB2dWVKc3goKSxcclxuICAgICAgICBJbnNwZWN0KCksIC8vIHZpdGUtcGx1Z2luLWluc3BlY3QgXHU2N0U1XHU3NzBCXHU3RjE2XHU4QkQxXHU1NDBFXHU3Njg0XHU2NTg3XHU0RUY2XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tZWxlbWVudC1wbHVzIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBcdTVGMDBcdTU5Q0JcclxuICAgICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcclxuICAgICAgICB9KSxcclxuICAgICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcih7IGltcG9ydFN0eWxlOiBcInNhc3NcIiB9KV0sIC8vc2Nzc1x1OTcwMFx1ODk4MVx1NkRGQlx1NTJBMCB7IGltcG9ydFN0eWxlOiAnc2FzcycgfSBcdTc1NTlcdTdBN0FcdTlFRDhcdThCQTRcdTRFM0Fjc3NcclxuXHJcbiAgICAgICAgICAgIGRpcmVjdG9yeUFzTmFtZXNwYWNlOiB0cnVlLCAvLyBcdTg5RTNcdTUxQjNcdTdFQzRcdTRFRjZcdTU0MERcdTc5RjBcdTkxQ0RcdTU5MERcdTk1RUVcdTk4OTggYGNvbXBvbmVudCB4eHggaGFzIG5hbWluZyBjb25mbGljdHMgd2l0aCBvdGhlciBjb21wb25lbnRzLCBpZ25vcmVkLmBcclxuICAgICAgICB9KSxcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1lbGVtZW50LXBsdXMgXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFx1N0VEM1x1Njc1RlxyXG4gICAgXSxcclxuXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBzY3NzXHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHU3NTFGXHU2NTQ4IFx1NUYwMFx1NTlDQlxyXG4gICAgY3NzOiB7XHJcbiAgICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPIFx1NjY4Mlx1NjVGNlx1NkQ4OFx1OTY2NFx1OEI2Nlx1NTQ0QVx1RkYwQ1x1OTBFOFx1N0Y3Mlx1NTI0RFx1NTE4RFx1NTkwNFx1NzQwNiBcdTUzQzJcdTgwMDNodHRwczovL3Nhc3MtbGFuZy5jb20vZG9jdW1lbnRhdGlvbi9icmVha2luZy1jaGFuZ2VzL2xlZ2FjeS1qcy1hcGkvXHJcbiAgICAgICAgICAgICAgICBzaWxlbmNlRGVwcmVjYXRpb25zOiBbXCJsZWdhY3ktanMtYXBpXCJdLFxyXG4gICAgICAgICAgICAgICAgLy8gXHU1OTFBXHU0RTJBc2Nzc1x1NjU4N1x1NEVGNlx1NTNEOFx1OTFDRlx1NzUxRlx1NjU0OFxyXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcclxuICAgICAgICBAdXNlIFwiLi9zcmMvYXNzZXRzL3Njc3MvdGhlbWVzL2luZGV4LnNjc3NcIiBhcyAqO1xyXG4gICAgICAgIEB1c2UgJy4vc3JjL2Fzc2V0cy9zY3NzL3BsYXRmb3JtL3Bob25lLnNjc3MnIGFzIHBob25lO1xyXG4gICAgICAgIEB1c2UgJy4vc3JjL2Fzc2V0cy9zY3NzL3BsYXRmb3JtL3BjLnNjc3MnIGFzIHBjO1xyXG4gICAgICAgIEB1c2UgJy4vc3JjL2Fzc2V0cy9zY3NzL21peGluLnNjc3MnIGFzICo7XHJcbiAgICAgICAgYCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gZGV2U291cmNlTWFwOiB0cnVlLCAvLyBcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMEJcdTY2MkZcdTU0MjZcdTc1MUZcdTYyMTAgc291cmNlTWFwXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gc2Nzc1x1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1NzUxRlx1NjU0OCBcdTdFRDNcdTY3NUZcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcdThCQkVcdTdGNkVcdTRFRTNcdTc0MDYgXHU1RjAwXHU1OUNCXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBob3N0OiBcImxvY2FsaG9zdFwiLFxyXG4gICAgICAgIHBvcnQ6IDczNjQsIC8vIFx1OTg3OVx1NzZFRVx1OEZEMFx1ODg0Q1x1N0FFRlx1NTNFMyhcdTRFNURcdTVCQUJcdTY4M0MgcGVuZyBcdTc2ODRcdTYyRkNcdTk3RjNcdTk1MkVcdTY1NzBcdTVCNTcpXHJcbiAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICAgLy8gZGV2IFNlcnZlci5wcm94eSBcdTUzRUZcdTRFRTVcdTY2MkZcdTRFMDBcdTRFMkFcdTYzMDdcdTU0MTFcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODMgQVBJIFx1NjcwRFx1NTJBMVx1NTY2OFx1NzY4NFx1NUI1N1x1N0IyNlx1NEUzMlxyXG4gICAgICAgICAgICBcIi9hcGlcIjoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xMC4xMC4yLjIyMjo1NDI2XCIsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAvLyByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJ215YWRtaW4nKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcdThCQkVcdTdGNkVcdTRFRTNcdTc0MDYgXHU3RUQzXHU2NzVGXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHU4QkJFXHU3RjZFXHU2MjUzXHU1MzA1XHU1MjA2XHU1NzU3IFx1NUYwMFx1NTlDQlxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICBtaW5pZnk6IHRydWUsIC8vXHU2NjJGXHU1NDI2XHU1MzhCXHU3RjI5XHU3RjE2XHU4QkQxXHU1NDBFXHU3RUQzXHU2NzlDXHUzMDAyXHJcbiAgICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA1MDAsIC8vIFx1NjI1M1x1NTMwNVx1OEI2Nlx1NTQ0QVx1OTYwOFx1NTAzQyBcdTUzNTVcdTRGNEQgS0JcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXHU2MjUzXHU1MzA1XHU3QjU2XHU3NTY1XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKFwibm9kZV9tb2R1bGVzXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFx1NUMwNiAnbm9kZV9tb2R1bGVzJyBcdTUyMDZcdTUyNzJcdTRFM0FcdTU0MERcdTRFM0EgJ3ZlbmRvcicgXHU3Njg0XHU0RUUzXHU3ODAxXHU1NzU3XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpcnMgPSBpZC5zcGxpdChcIi9cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGRpcnNbZGlycy5sYXN0SW5kZXhPZihcIm5vZGVfbW9kdWxlc1wiKSArIDFdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgdmVuZG9yLyR7bmFtZX1gXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcdTVDMDZcdTYyNTNcdTUzMDVcdTY1ODdcdTRFRjZcdTYzMDlcdTcxNjdcdTdDN0JcdTU3OEJcdTc2RUVcdTVGNTVcdTUyMDZcdTdDN0IgXHU1RjAwXHU1OUNCXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU5NzAwXHU4OTgxXHU2NTg3XHU0RUY2XHU1NDBEIFx1NUYwMFx1NTNEMVx1NkEyMVx1NUYwRlx1NEUwQlxyXG4gICAgICAgICAgICAgICAgY2h1bmtGaWxlTmFtZXM6IFwic3RhdGljL2pzL1tuYW1lXS1baGFzaF0uanNcIixcclxuICAgICAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiBcInN0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzXCIsXHJcbiAgICAgICAgICAgICAgICBhc3NldEZpbGVOYW1lczogXCJzdGF0aWMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XVwiLFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1NEUwRFx1OTcwMFx1ODk4MVx1NjU4N1x1NEVGNlx1NTQwRCBcdTY2RjRcdTUyQTBcdTdCODBcdTZEMDEgXHU3NTFGXHU0RUE3XHU2QTIxXHU1RjBGXHU0RTBCXHJcbiAgICAgICAgICAgICAgICAvLyBjaHVua0ZpbGVOYW1lczogJ3N0YXRpYy9qcy9baGFzaF0uanMnLFxyXG4gICAgICAgICAgICAgICAgLy8gZW50cnlGaWxlTmFtZXM6ICdzdGF0aWMvanMvW2hhc2hdLmpzJyxcclxuICAgICAgICAgICAgICAgIC8vIGFzc2V0RmlsZU5hbWVzOiAnc3RhdGljL1tleHRdL1toYXNoXS5bZXh0XScsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFx1NUMwNlx1NjI1M1x1NTMwNVx1NjU4N1x1NEVGNlx1NjMwOVx1NzE2N1x1N0M3Qlx1NTc4Qlx1NzZFRVx1NUY1NVx1NTIwNlx1N0M3QiBcdTdFRDNcdTY3NUZcclxuICAgICAgICAgICAgICAgIGlubGluZUR5bmFtaWNJbXBvcnRzOiBmYWxzZSwgLy8gXHU1QzA2XHU1MkE4XHU2MDAxXHU1QkZDXHU1MTY1XHU3Njg0XHU2QTIxXHU1NzU3XHU1MTg1XHU4MDU0XHU1MjMwXHU3NTFGXHU2MjEwXHU3Njg0XHU0RUUzXHU3ODAxXHU0RTJEXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAgICAgICAgIHRlcnNlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4V29ya2VyczogMiwgLy8gXHU1RjAwXHU1NDJGXHU1OTFBXHU4RkRCXHU3QTBCXHU1MzhCXHU3RjI5XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyBcdTUzQkJcdTk2NjRjb25zb2xlLmxvZyxcdTRGRERcdTc1NTlcdTUxNzZcdTRFRDZjb25zb2xlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHB1cmVfZnVuY3M6IFsnY29uc29sZS5sb2cnXSwgLy8gXHU1M0JCXHU5NjY0Y29uc29sZS5sb2csXHU0RkREXHU3NTU5XHU1MTc2XHU0RUQ2Y29uc29sZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkcm9wX2RlYnVnZ2VyOiB0cnVlIC8vIFx1NTNCQlx1OTY2NGRlYnVnZ2VyXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFx1OEJCRVx1N0Y2RVx1NjI1M1x1NTMwNVx1NTIwNlx1NTc1NyBcdTdFRDNcdTY3NUZcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUtBLE9BQU8sVUFBVTtBQUNqQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sWUFBWTtBQUNuQixPQUFPLGFBQWE7QUFFcEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFkcEMsSUFBTSxtQ0FBbUM7QUFrQnpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQTtBQUFBO0FBQUEsSUFFUixXQUFXO0FBQUEsTUFDUCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNyQyxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDUCxXQUFXLENBQUMsb0JBQW9CLEVBQUUsYUFBYSxPQUFPLENBQUMsQ0FBQztBQUFBO0FBQUEsTUFFeEQsc0JBQXNCO0FBQUE7QUFBQSxJQUMxQixDQUFDO0FBQUE7QUFBQSxFQUVMO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDdEM7QUFBQSxFQUNKO0FBQUE7QUFBQSxFQUdBLEtBQUs7QUFBQSxJQUNELHFCQUFxQjtBQUFBLE1BQ2pCLE1BQU07QUFBQTtBQUFBLFFBRUYscUJBQXFCLENBQUMsZUFBZTtBQUFBO0FBQUEsUUFFckMsZ0JBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BTXBCO0FBQUE7QUFBQSxJQUVKO0FBQUEsRUFDSjtBQUFBO0FBQUE7QUFBQSxFQUdBLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUEsTUFFSCxRQUFRO0FBQUEsUUFDSixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUE7QUFBQSxNQUVsQjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUE7QUFBQTtBQUFBLEVBR0EsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBO0FBQUEsSUFDUix1QkFBdUI7QUFBQTtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGFBQWEsSUFBSTtBQUViLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUU3QixrQkFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHO0FBQ3pCLGtCQUFNLE9BQU8sS0FBSyxLQUFLLFlBQVksY0FBYyxJQUFJLENBQUM7QUFDdEQsbUJBQU8sVUFBVSxJQUFJO0FBQUEsVUFDekI7QUFBQSxRQUNKO0FBQUE7QUFBQTtBQUFBLFFBSUEsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBUWhCLHNCQUFzQjtBQUFBO0FBQUEsTUFDMUI7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNMLE9BQU87QUFBQSxVQUNILFlBQVk7QUFBQTtBQUFBLFVBQ1osVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBSVY7QUFBQSxRQUNKLENBQUM7QUFBQSxNQUNMO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQTtBQUVKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
