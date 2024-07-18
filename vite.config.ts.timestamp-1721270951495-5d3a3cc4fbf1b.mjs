// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Desktop/blog-client/node_modules/.pnpm/vite@5.3.4_@types+node@20.14.11_sass@1.77.8_terser@5.31.3/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.3.4_@types+node@20.14.11_sass@1.77.8_terser@5.31.3__vue@3.4.32_typescript@5.5.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.3.4_@types+node@20.14.11_sass@1.77.8_terser@5.31.3__vue@3.4.32_typescript@5.5.3_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import terser from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@rollup+plugin-terser@0.4.4_rollup@4.18.1/node_modules/@rollup/plugin-terser/dist/es/index.js";
import AutoImport from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.0_vue@3.4.32_typescript@5.5.3___rollup@4.18.1/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.24.8_rollup@4.18.1_vue@3.4.32_typescript@5.5.3_/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.24.8_rollup@4.18.1_vue@3.4.32_typescript@5.5.3_/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_import_meta_url = "file:///C:/Desktop/blog-client/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
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
      // src 为根目录
    }
  },
  // ------------------------------ scss全局变量生效 开始
  css: {
    preprocessorOptions: {
      scss: {
        // 多个scss文件变量生效
        // additionalData: `
        // @use "@/assets/scss/variables.scss" as *;
        // @use "@/assets/scss/element.scss" as *;
        // `,
        additionalData: `
        @use "@/assets/scss/themes/index.scss"as *;
        @use '@/assets/scss/platform/phone.scss' as phone;
        @use '@/assets/scss/platform/pc.scss' as pc;
        @use '@/assets/scss/mixin.scss' as *;
        `
      }
    }
  },
  // ------------------------------ scss全局变量生效 结束
  // ------------------------------ 设置代理 开始
  server: {
    host: "localhost",
    port: 8081,
    proxy: {
      // dev Server.proxy 可以是一个指向开发环境 API 服务器的字符串
      "/api": {
        target: "http://10.10.2.222:8080",
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
        // 静态资源需要文件名 调试模式下
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        // 静态资源不需要文件名 更加简洁 生成模式下
        // chunkFileNames: 'static/js/[hash].js',
        // entryFileNames: 'static/js/[hash].js',
        // assetFileNames: 'static/[ext]/[hash].[ext]',
        // ------------------------------ 将打包文件按照类型目录分类 结束
      },
      plugins: [
        terser({
          maxWorkers: 2
          // 开启多进程压缩
        })
      ]
    }
  }
  // ------------------------------ 设置打包分块 结束
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxEZXNrdG9wXFxcXGJsb2ctY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxEZXNrdG9wXFxcXGJsb2ctY2xpZW50XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9EZXNrdG9wL2Jsb2ctY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7LypcclxuICogQEF1dGhvciAgICAgICA6IGppYW9wZW5nemlcclxuICogQERhdGUgICAgICAgICA6IDIwMjMtMTItMDMgMDA6MjA6NTFcclxuICogQExhc3RFZGl0b3JzICA6IGppYW9wZW5nemlcclxuICogQExhc3RFZGl0VGltZSA6IDIwMjQtMDEtMTMgMTQ6MjA6MzJcclxuICogQEZpbGVQYXRoICAgICA6IFxcYmxvZy1jbGllbnRcXHZpdGUuY29uZmlnLnRzXHJcbiAqIEBEZXNjcmlwdGlvbiAgOiB2aXRlIFx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxyXG4gKiBAQmxvZyAgICAgICAgIDogaHR0cHM6Ly9qaWFvcGVuZ3ppLmNvbVxyXG4gKiBAQ29weXJpZ2h0ICAgIDogQ29weXJpZ2h0IChjKSAyMDIzIGJ5IGppYW9wZW5nemksIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqL1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuaW1wb3J0IHRlcnNlciBmcm9tICdAcm9sbHVwL3BsdWdpbi10ZXJzZXInIC8vIFx1NEYxQVx1NjJBNVx1OTUxOSBcdTZDQTFcdTY3MDlcdThDMDNcdTc1MjhcdTdCN0VcdTU0MERcdTMwMDIgXHU0RjQ2XHU2NjJGXHU0RTBEXHU1RjcxXHU1NENEXHU0RjdGXHU3NTI4XHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWVsZW1lbnQtcGx1cyBcdTYzMDlcdTk3MDBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgXHU1RjAwXHU1OUNCXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWVsZW1lbnQtcGx1cyBcdTYzMDlcdTk3MDBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgXHU3RUQzXHU2NzVGXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgdnVlSnN4KCksXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1lbGVtZW50LXBsdXMgXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFx1NUYwMFx1NTlDQlxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXHJcbiAgICB9KSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKHsgaW1wb3J0U3R5bGU6ICdzYXNzJyB9KV0sIC8vc2Nzc1x1OTcwMFx1ODk4MVx1NkRGQlx1NTJBMCB7IGltcG9ydFN0eWxlOiAnc2FzcycgfSBcdTc1NTlcdTdBN0FcdTlFRDhcdThCQTRcdTRFM0Fjc3NcclxuXHJcbiAgICAgIGRpcmVjdG9yeUFzTmFtZXNwYWNlOiB0cnVlLCAvLyBcdTg5RTNcdTUxQjNcdTdFQzRcdTRFRjZcdTU0MERcdTc5RjBcdTkxQ0RcdTU5MERcdTk1RUVcdTk4OTggYGNvbXBvbmVudCB4eHggaGFzIG5hbWluZyBjb25mbGljdHMgd2l0aCBvdGhlciBjb21wb25lbnRzLCBpZ25vcmVkLmBcclxuICAgIH0pLFxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tZWxlbWVudC1wbHVzIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBcdTdFRDNcdTY3NUZcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLCAvLyBzcmMgXHU0RTNBXHU2ODM5XHU3NkVFXHU1RjU1XHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBzY3NzXHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHU3NTFGXHU2NTQ4IFx1NUYwMFx1NTlDQlxyXG4gIGNzczoge1xyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgLy8gXHU1OTFBXHU0RTJBc2Nzc1x1NjU4N1x1NEVGNlx1NTNEOFx1OTFDRlx1NzUxRlx1NjU0OFxyXG4gICAgICAgIC8vIGFkZGl0aW9uYWxEYXRhOiBgXHJcbiAgICAgICAgLy8gQHVzZSBcIkAvYXNzZXRzL3Njc3MvdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xyXG4gICAgICAgIC8vIEB1c2UgXCJAL2Fzc2V0cy9zY3NzL2VsZW1lbnQuc2Nzc1wiIGFzICo7XHJcbiAgICAgICAgLy8gYCxcclxuICAgICAgICBhZGRpdGlvbmFsRGF0YTogYFxyXG4gICAgICAgIEB1c2UgXCJAL2Fzc2V0cy9zY3NzL3RoZW1lcy9pbmRleC5zY3NzXCJhcyAqO1xyXG4gICAgICAgIEB1c2UgJ0AvYXNzZXRzL3Njc3MvcGxhdGZvcm0vcGhvbmUuc2NzcycgYXMgcGhvbmU7XHJcbiAgICAgICAgQHVzZSAnQC9hc3NldHMvc2Nzcy9wbGF0Zm9ybS9wYy5zY3NzJyBhcyBwYztcclxuICAgICAgICBAdXNlICdAL2Fzc2V0cy9zY3NzL21peGluLnNjc3MnIGFzICo7XHJcbiAgICAgICAgYCxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gc2Nzc1x1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1NzUxRlx1NjU0OCBcdTdFRDNcdTY3NUZcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHU4QkJFXHU3RjZFXHU0RUUzXHU3NDA2IFx1NUYwMFx1NTlDQlxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXHJcbiAgICBwb3J0OiA4MDgxLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgLy8gZGV2IFNlcnZlci5wcm94eSBcdTUzRUZcdTRFRTVcdTY2MkZcdTRFMDBcdTRFMkFcdTYzMDdcdTU0MTFcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODMgQVBJIFx1NjcwRFx1NTJBMVx1NTY2OFx1NzY4NFx1NUI1N1x1N0IyNlx1NEUzMlxyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTAuMTAuMi4yMjI6ODA4MCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnbXlhZG1pbicpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcdThCQkVcdTdGNkVcdTRFRTNcdTc0MDYgXHU3RUQzXHU2NzVGXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFx1OEJCRVx1N0Y2RVx1NjI1M1x1NTMwNVx1NTIwNlx1NTc1NyBcdTVGMDBcdTU5Q0JcclxuICBidWlsZDoge1xyXG4gICAgbWluaWZ5OiB0cnVlLCAvL1x1NjYyRlx1NTQyNlx1NTM4Qlx1N0YyOVx1N0YxNlx1OEJEMVx1NTQwRVx1N0VEM1x1Njc5Q1x1MzAwMlxyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA1MDAsIC8vIFx1NjI1M1x1NTMwNVx1OEI2Nlx1NTQ0QVx1OTYwOFx1NTAzQyBcdTUzNTVcdTRGNEQgS0JcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcbiAgICAgICAgICAgIC8vIFx1NUMwNiAnbm9kZV9tb2R1bGVzJyBcdTUyMDZcdTUyNzJcdTRFM0FcdTU0MERcdTRFM0EgJ3ZlbmRvcicgXHU3Njg0XHU0RUUzXHU3ODAxXHU1NzU3XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcnMgPSBpZC5zcGxpdCgnLycpXHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBkaXJzW2RpcnMubGFzdEluZGV4T2YoJ25vZGVfbW9kdWxlcycpICsgMV1cclxuICAgICAgICAgICAgcmV0dXJuIGB2ZW5kb3IvJHtuYW1lfWBcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcdTVDMDZcdTYyNTNcdTUzMDVcdTY1ODdcdTRFRjZcdTYzMDlcdTcxNjdcdTdDN0JcdTU3OEJcdTc2RUVcdTVGNTVcdTUyMDZcdTdDN0IgXHU1RjAwXHU1OUNCXHJcblxyXG4gICAgICAgIC8vIFx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1OTcwMFx1ODk4MVx1NjU4N1x1NEVGNlx1NTQwRCBcdThDMDNcdThCRDVcdTZBMjFcdTVGMEZcdTRFMEJcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ3N0YXRpYy9bZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJyxcclxuXHJcbiAgICAgICAgLy8gXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU0RTBEXHU5NzAwXHU4OTgxXHU2NTg3XHU0RUY2XHU1NDBEIFx1NjZGNFx1NTJBMFx1N0I4MFx1NkQwMSBcdTc1MUZcdTYyMTBcdTZBMjFcdTVGMEZcdTRFMEJcclxuICAgICAgICAvLyBjaHVua0ZpbGVOYW1lczogJ3N0YXRpYy9qcy9baGFzaF0uanMnLFxyXG4gICAgICAgIC8vIGVudHJ5RmlsZU5hbWVzOiAnc3RhdGljL2pzL1toYXNoXS5qcycsXHJcbiAgICAgICAgLy8gYXNzZXRGaWxlTmFtZXM6ICdzdGF0aWMvW2V4dF0vW2hhc2hdLltleHRdJyxcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFx1NUMwNlx1NjI1M1x1NTMwNVx1NjU4N1x1NEVGNlx1NjMwOVx1NzE2N1x1N0M3Qlx1NTc4Qlx1NzZFRVx1NUY1NVx1NTIwNlx1N0M3QiBcdTdFRDNcdTY3NUZcclxuICAgICAgfSxcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIHRlcnNlcih7XHJcbiAgICAgICAgICBtYXhXb3JrZXJzOiAyLCAvLyBcdTVGMDBcdTU0MkZcdTU5MUFcdThGREJcdTdBMEJcdTUzOEJcdTdGMjlcclxuICAgICAgICB9KSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHU4QkJFXHU3RjZFXHU2MjUzXHU1MzA1XHU1MjA2XHU1NzU3IFx1N0VEM1x1Njc1RlxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBVUEsU0FBUyxlQUFlLFdBQVc7QUFDbkMsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFlBQVk7QUFFbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFsQnFILElBQU0sMkNBQTJDO0FBc0IxTSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUE7QUFBQSxJQUVQLFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLElBQ25DLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxhQUFhLE9BQU8sQ0FBQyxDQUFDO0FBQUE7QUFBQSxNQUV4RCxzQkFBc0I7QUFBQTtBQUFBLElBQ3hCLENBQUM7QUFBQTtBQUFBLEVBRUg7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUE7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR0EsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU1KLGdCQUFnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU1sQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBLEVBR0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUEsTUFFTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUE7QUFBQSxNQUVoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBLEVBR0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBO0FBQUEsSUFDUix1QkFBdUI7QUFBQTtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGFBQWEsSUFBSTtBQUNmLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUUvQixrQkFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHO0FBQ3pCLGtCQUFNLE9BQU8sS0FBSyxLQUFLLFlBQVksY0FBYyxJQUFJLENBQUM7QUFDdEQsbUJBQU8sVUFBVSxJQUFJO0FBQUEsVUFDdkI7QUFBQSxRQUNGO0FBQUE7QUFBQTtBQUFBLFFBSUEsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BUWxCO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxPQUFPO0FBQUEsVUFDTCxZQUFZO0FBQUE7QUFBQSxRQUNkLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUVGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
