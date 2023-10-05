/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-04 18:07:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-06 00:19:50
 * @FilePath     : \blog-client\vite.config.ts
 * @Description  :
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// ------------------------------element-plus 自动导入 开始
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// ------------------------------element-plus 自动导入 结束

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
      resolvers: [ElementPlusResolver()],
    }),
    // ------------------------------element-plus 自动导入 结束
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // ------------------------------ less全局变量生效 开始
  css: {
    preprocessorOptions: {
      less: {
        // 添加 Less 文件，引用全局变量
        modifyVars: {
          hack: `true; @import "./src/assets/styleVariables.less";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  // ------------------------------ less全局变量生效 结束
  // ------------------------------ 设置代理 开始
  server: {
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
})
