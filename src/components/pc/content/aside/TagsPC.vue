<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-03 20:44:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-25 17:03:22
 * @FilePath     : \blog-client\src\components\pc\content\aside\TagsPC.vue
 * @Description  : 标签list
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="aside-item">
    <div class="title">
      <h2>
        <Icon name="label" customClass="my-icon" />
        文章标签
      </h2>
    </div>
    <div class="tag-box">
      <el-scrollbar max-height="300px">
        <TagItem v-for="(item, index) in items" :tagData="item" :key="index" />
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TagDataObj } from '@/components/common/base/tagItem.d'
import TagItem from '@/components/common/base/TagItem.vue'
import { ref } from 'vue'

const items = ref<Array<TagDataObj>>([
  { path: '/1', tagPostNum: 1, lablel: 'Power BI' },
  { path: '/1', tagPostNum: 2, lablel: 'Power Query' },
  { path: '/1', tagPostNum: 3, lablel: 'DAX' },
  { path: "/1", tagPostNum: 3, lablel: 'PQ' },
  { path: "/1", tagPostNum: 5, lablel: '数据分析' },
  { path: "/1", tagPostNum: 6, lablel: 'go' },
  { path: "/1", tagPostNum: 7, lablel: 'vue3' },
  { path: "/1", tagPostNum: 8, lablel: 'svg' },
  { path: "/1", tagPostNum: 8, lablel: 'Excel' },
  { path: "/1", tagPostNum: 9, lablel: '安全库存' },
  { path: "/1", tagPostNum: 10, lablel: '日期表' },
  { path: "/1", tagPostNum: 11, lablel: 'ODBC' },
  { path: "/1", tagPostNum: 12, lablel: '模型' },
  { path: "/1", tagPostNum: 13, lablel: 'DAX Studio' },
  { path: "/1", tagPostNum: 14, lablel: '热力图' },
  { path: "/1", tagPostNum: 15, lablel: 'pbirs' },
  { path: "/1", tagPostNum: 16, lablel: '帕累托' },
  { path: "/1", tagPostNum: 17, lablel: '排名' },
  { path: "/1", tagPostNum: 18, lablel: 'Rank' },
  { path: "/1", tagPostNum: 18, lablel: '技巧' },
  { path: "/1", tagPostNum: 20, lablel: '排名' },
  { path: "/1", tagPostNum: 21, lablel: 'access' },
  { path: "/1", tagPostNum: 22, lablel: 'Power BI Report Server' },
  { path: "/1", tagPostNum: 23, lablel: '先进先出' },
  { path: "/1", tagPostNum: 24, lablel: 'M语言' },
  { path: "/1", tagPostNum: 25, lablel: '模型' },
  { path: "/1", tagPostNum: 26, lablel: 'HR' }, { path: "/1", tagPostNum: 13, lablel: 'DAX Studio' },
  { path: "/1", tagPostNum: 14, lablel: '热力图' },
  { path: "/1", tagPostNum: 15, lablel: 'pbirs' },
  { path: "/1", tagPostNum: 16, lablel: '帕累托' },
  { path: "/1", tagPostNum: 17, lablel: '排名' },
  { path: "/1", tagPostNum: 18, lablel: 'Rank' },
  { path: "/1", tagPostNum: 18, lablel: '技巧' },
  { path: "/1", tagPostNum: 20, lablel: '排名' },
  { path: "/1", tagPostNum: 21, lablel: 'access' },
  { path: "/1", tagPostNum: 22, lablel: 'Power BI Report Server' },
  { path: "/1", tagPostNum: 23, lablel: '先进先出' },
  { path: "/1", tagPostNum: 24, lablel: 'M语言' },
  { path: "/1", tagPostNum: 25, lablel: '模型' },
  { path: "/1", tagPostNum: 26, lablel: 'HR' },
])
</script>
<style scoped lang="scss">
.aside-item {
  border: 1px solid #eaeaea;
  background-color: light.$background-color-content;
  border-radius: 5px;

  .title {
    background-color: light.$background-color-page;
    padding: 10px 5px;
  }

  h2 {
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
}

.tag-box {
  // width: 320px;
  // border: 1px solid #000;
  overflow-y: auto;
  padding-bottom: 5px;
  padding-left: 5px;
}

.my-icon {
  font-size: 20px;
  margin-right: 5px;
  fill: #bb1818;
}
</style>
