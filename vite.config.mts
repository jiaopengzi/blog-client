/*
 * @Author       : jiaopengzi
 * @Date         : 2023-12-03 00:20:51
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-04 14:24:06
 * @FilePath     : \blog-client\vite.config.mts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-04 18:07:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-03 00:09:08
 * @FilePath     : \blog-client\vite.config.mts
 * @Description  : vite 配置文件
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import terser from '@rollup/plugin-terser'

// ------------------------------element-plus 按需自动导入 开始
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// ------------------------------element-plus 按需自动导入 结束

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // ------------------------------element-plus 自动导入 开始
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })], //scss需要添加 { importStyle: 'sass' } 留空默认为css
    }),
    // ------------------------------element-plus 自动导入 结束
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
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
        `,
      },
    },
  },
  // ------------------------------ scss全局变量生效 结束
  // ------------------------------ 设置代理 开始
  server: {
    host: 'localhost',
    port: 8081,
    proxy: {
      // dev Server.proxy 可以是一个指向开发环境 API 服务器的字符串
      '/api': {
        target: 'http://192.168.2.222:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, 'myadmin'),
      },
    },
  },
  // ------------------------------ 设置代理 结束
  // ------------------------------ 设置打包分块 开始
  build: {
    chunkSizeWarningLimit: 500, // 打包警告阈值 单位 KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 将 'node_modules' 分割为名为 'vendor' 的代码块
            const dirs = id.split('/')
            const name = dirs[dirs.lastIndexOf('node_modules') + 1]
            return `vendor/${name}`
          }
        },
      },
      plugins: [
        terser({
          maxWorkers: 2, // 开启多进程压缩
        }),
      ],
    },
  },
  // ------------------------------ 设置打包分块 结束
})
