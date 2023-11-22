<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-22 16:12:33
 * @FilePath     : \blog-client\src\App.vue
 * @Description  : 入口文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <Head>
    <title>My awesome site</title>
    <meta name="description" content="My awesome site description" />
  </Head>
  <div class="app">
    <!-- :key="$route.fullPath" 解决url变化而页面不刷新问题 -->
    <router-view :key="$route.fullPath" />
  </div>
</template>
<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { Head } from '@unhead/vue/components'
// import Icon from '@/components/icons/Icon.vue'

useHead({
  title: 'My awesome site',
  meta: [
    { name: 'description', content: '目录，就是目录。' },
    {
      name: 'keywords',
      content:
        '焦棚子,jiaopengzi,power bi,power pivot,power query,power bi report server,数据分析,透视表,excel,目录',
    },
    { property: 'og:type', content: 'acticle' },
    { property: 'og:locale', content: 'zh-CN' },
    { property: 'og:title', content: '焦棚子的文章目录' },
    { property: 'og:author', content: '焦棚子' },
    {
      property: 'og:image',
      content: 'https://image.jiaopengzi.com/wp-content/uploads/2020/02/logo_1920_2_w280.png',
    },
    { property: 'og:site_name', content: '焦棚子' },
    { property: 'og:description', content: '目录，就是目录。' },
    { property: 'og:url', content: 'https://jiaopengzi.com/75.html' },
    { property: 'og:release_date', content: '2020-02-27 15:15:29' },
  ],
})
</script>

<style scoped lang="scss"></style>
