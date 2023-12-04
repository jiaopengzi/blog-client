// vite.config.mts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Desktop/blog-client/node_modules/.pnpm/vite@5.0.4_@types+node@18.19.1_sass@1.69.5/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@vitejs+plugin-vue@4.5.1_vite@5.0.4_vue@3.3.9/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.0.4_vue@3.3.9/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import terser from "file:///C:/Desktop/blog-client/node_modules/.pnpm/@rollup+plugin-terser@0.4.4/node_modules/@rollup/plugin-terser/dist/es/index.js";
import AutoImport from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-auto-import@0.16.7/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-vue-components@0.25.2_vue@3.3.9/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///C:/Desktop/blog-client/node_modules/.pnpm/unplugin-vue-components@0.25.2_vue@3.3.9/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Desktop/blog-client/vite.config.mts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // ------------------------------element-plus 自动导入 开始
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: "sass" })]
      //scss需要添加 { importStyle: 'sass' } 留空默认为css
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
        target: "http://192.168.2.222:8080",
        changeOrigin: true
        // rewrite: (path) => path.replace(/^\/api/, 'myadmin'),
      }
    }
  },
  // ------------------------------ 设置代理 结束
  // ------------------------------ 设置打包分块 开始
  build: {
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
        }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcRGVza3RvcFxcXFxibG9nLWNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcRGVza3RvcFxcXFxibG9nLWNsaWVudFxcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0Rlc2t0b3AvYmxvZy1jbGllbnQvdml0ZS5jb25maWcubXRzXCI7LypcclxuICogQEF1dGhvciAgICAgICA6IGppYW9wZW5nemlcclxuICogQERhdGUgICAgICAgICA6IDIwMjMtMTItMDMgMDA6MjA6NTFcclxuICogQExhc3RFZGl0b3JzICA6IGppYW9wZW5nemlcclxuICogQExhc3RFZGl0VGltZSA6IDIwMjMtMTItMDQgMTQ6MjQ6MDZcclxuICogQEZpbGVQYXRoICAgICA6IFxcYmxvZy1jbGllbnRcXHZpdGUuY29uZmlnLm10c1xyXG4gKiBARGVzY3JpcHRpb24gIDpcclxuICogQEJsb2cgICAgICAgICA6IGh0dHBzOi8vamlhb3Blbmd6aS5jb21cclxuICogQENvcHlyaWdodCAgICA6IENvcHlyaWdodCAoYykgMjAyMyBieSBqaWFvcGVuZ3ppLCBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBBdXRob3IgICAgICAgOiBqaWFvcGVuZ3ppXHJcbiAqIEBEYXRlICAgICAgICAgOiAyMDIzLTA3LTA0IDE4OjA3OjMyXHJcbiAqIEBMYXN0RWRpdG9ycyAgOiBqaWFvcGVuZ3ppXHJcbiAqIEBMYXN0RWRpdFRpbWUgOiAyMDIzLTEyLTAzIDAwOjA5OjA4XHJcbiAqIEBGaWxlUGF0aCAgICAgOiBcXGJsb2ctY2xpZW50XFx2aXRlLmNvbmZpZy5tdHNcclxuICogQERlc2NyaXB0aW9uICA6IHZpdGUgXHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XHJcbiAqIEBibG9nICAgICAgICAgOiBodHRwczovL2ppYW9wZW5nemkuY29tXHJcbiAqIEBDb3B5cmlnaHQgKGMpIDIwMjMgYnkgamlhb3Blbmd6aSwgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICovXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5pbXBvcnQgdGVyc2VyIGZyb20gJ0Byb2xsdXAvcGx1Z2luLXRlcnNlcidcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWVsZW1lbnQtcGx1cyBcdTYzMDlcdTk3MDBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgXHU1RjAwXHU1OUNCXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWVsZW1lbnQtcGx1cyBcdTYzMDlcdTk3MDBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgXHU3RUQzXHU2NzVGXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgdnVlSnN4KCksXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1lbGVtZW50LXBsdXMgXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFx1NUYwMFx1NTlDQlxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXHJcbiAgICB9KSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKHsgaW1wb3J0U3R5bGU6ICdzYXNzJyB9KV0sIC8vc2Nzc1x1OTcwMFx1ODk4MVx1NkRGQlx1NTJBMCB7IGltcG9ydFN0eWxlOiAnc2FzcycgfSBcdTc1NTlcdTdBN0FcdTlFRDhcdThCQTRcdTRFM0Fjc3NcclxuICAgIH0pLFxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tZWxlbWVudC1wbHVzIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBcdTdFRDNcdTY3NUZcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gc2Nzc1x1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1NzUxRlx1NjU0OCBcdTVGMDBcdTU5Q0JcclxuICBjc3M6IHtcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgc2Nzczoge1xyXG4gICAgICAgIC8vIFx1NTkxQVx1NEUyQXNjc3NcdTY1ODdcdTRFRjZcdTUzRDhcdTkxQ0ZcdTc1MUZcdTY1NDhcclxuICAgICAgICAvLyBhZGRpdGlvbmFsRGF0YTogYFxyXG4gICAgICAgIC8vIEB1c2UgXCJAL2Fzc2V0cy9zY3NzL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcclxuICAgICAgICAvLyBAdXNlIFwiQC9hc3NldHMvc2Nzcy9lbGVtZW50LnNjc3NcIiBhcyAqO1xyXG4gICAgICAgIC8vIGAsXHJcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcclxuICAgICAgICBAdXNlIFwiQC9hc3NldHMvc2Nzcy90aGVtZXMvaW5kZXguc2Nzc1wiYXMgKjtcclxuICAgICAgICBAdXNlICdAL2Fzc2V0cy9zY3NzL3BsYXRmb3JtL3Bob25lLnNjc3MnIGFzIHBob25lO1xyXG4gICAgICAgIEB1c2UgJ0AvYXNzZXRzL3Njc3MvcGxhdGZvcm0vcGMuc2NzcycgYXMgcGM7XHJcbiAgICAgICAgQHVzZSAnQC9hc3NldHMvc2Nzcy9taXhpbi5zY3NzJyBhcyAqO1xyXG4gICAgICAgIGAsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHNjc3NcdTUxNjhcdTVDNDBcdTUzRDhcdTkxQ0ZcdTc1MUZcdTY1NDggXHU3RUQzXHU2NzVGXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFx1OEJCRVx1N0Y2RVx1NEVFM1x1NzQwNiBcdTVGMDBcdTU5Q0JcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxyXG4gICAgcG9ydDogODA4MSxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIC8vIGRldiBTZXJ2ZXIucHJveHkgXHU1M0VGXHU0RUU1XHU2NjJGXHU0RTAwXHU0RTJBXHU2MzA3XHU1NDExXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzIEFQSSBcdTY3MERcdTUyQTFcdTU2NjhcdTc2ODRcdTVCNTdcdTdCMjZcdTRFMzJcclxuICAgICAgJy9hcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMi4yMjI6ODA4MCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnbXlhZG1pbicpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcdThCQkVcdTdGNkVcdTRFRTNcdTc0MDYgXHU3RUQzXHU2NzVGXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFx1OEJCRVx1N0Y2RVx1NjI1M1x1NTMwNVx1NTIwNlx1NTc1NyBcdTVGMDBcdTU5Q0JcclxuICBidWlsZDoge1xyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA1MDAsIC8vIFx1NjI1M1x1NTMwNVx1OEI2Nlx1NTQ0QVx1OTYwOFx1NTAzQyBcdTUzNTVcdTRGNEQgS0JcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcbiAgICAgICAgICAgIC8vIFx1NUMwNiAnbm9kZV9tb2R1bGVzJyBcdTUyMDZcdTUyNzJcdTRFM0FcdTU0MERcdTRFM0EgJ3ZlbmRvcicgXHU3Njg0XHU0RUUzXHU3ODAxXHU1NzU3XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcnMgPSBpZC5zcGxpdCgnLycpXHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBkaXJzW2RpcnMubGFzdEluZGV4T2YoJ25vZGVfbW9kdWxlcycpICsgMV1cclxuICAgICAgICAgICAgcmV0dXJuIGB2ZW5kb3IvJHtuYW1lfWBcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgdGVyc2VyKHtcclxuICAgICAgICAgIG1heFdvcmtlcnM6IDIsIC8vIFx1NUYwMFx1NTQyRlx1NTkxQVx1OEZEQlx1N0EwQlx1NTM4Qlx1N0YyOVxyXG4gICAgICAgIH0pLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcdThCQkVcdTdGNkVcdTYyNTNcdTUzMDVcdTUyMDZcdTU3NTcgXHU3RUQzXHU2NzVGXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFvQkEsU0FBUyxlQUFlLFdBQVc7QUFDbkMsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFlBQVk7QUFHbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUE3QnNILElBQU0sMkNBQTJDO0FBaUMzTSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUE7QUFBQSxJQUVQLFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLElBQ25DLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxhQUFhLE9BQU8sQ0FBQyxDQUFDO0FBQUE7QUFBQSxJQUMxRCxDQUFDO0FBQUE7QUFBQSxFQUVIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBTUosZ0JBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BTWxCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUEsRUFHQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxNQUVMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLE1BRWhCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUEsRUFHQSxPQUFPO0FBQUEsSUFDTCx1QkFBdUI7QUFBQTtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGFBQWEsSUFBSTtBQUNmLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUUvQixrQkFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHO0FBQ3pCLGtCQUFNLE9BQU8sS0FBSyxLQUFLLFlBQVksY0FBYyxJQUFJLENBQUM7QUFDdEQsbUJBQU8sVUFBVSxJQUFJO0FBQUEsVUFDdkI7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsT0FBTztBQUFBLFVBQ0wsWUFBWTtBQUFBO0FBQUEsUUFDZCxDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFFRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
