<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-03 20:48:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-03 22:12:51
 * @FilePath     : \blog-client\src\components\common\pc\content\item\TagItem.vue
 * @Description  : 标签元素
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="tag-box">
    <el-scrollbar max-height="300px">
      <el-tag
        v-for="item in tags"
        :key="item.item.lablel"
        class="tag-item"
        effect="dark"
        :round="false"
        @click="() => handleClick(item)"
        :style="[{ 'background-color': item.color.bgColor }, { color: item.color.color }]"
      >
        {{ item.item.lablel + '(' + item.item.tagPostNum + ')' }}
      </el-tag>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
type ItemColor = { color: string; bgColor: string }

// tag 随机生成RGB颜色中的r值、g值、b值
function randomRgbItem(): number {
  return Math.floor(Math.random() * 0xff)
}

// tag 字体颜色和背景色生成函数
function generateItemColor(a: number = 0.8): ItemColor {
  let r = randomRgbItem() // 随机生成RGB颜色中的r值
  let g = randomRgbItem() // 随机生成RGB颜色中的g值
  let b = randomRgbItem() // 随机生成RGB颜色中的b值
  let L = Math.round(((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * 100) // 计算亮度公式

  let bgColor = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')' // 设置背景色变量
  let color = L > 50 ? '#222' : '#ddd' // 设置文字颜色变量

  return { color: color, bgColor: bgColor }
}

type Item = { item: TagItemObj; color: ItemColor }

type TagItemObj = {
  path: string // 标签路径
  lablel: string // 标签名称
  tagPostNum: number // 标签下文章数量
}

const items = ref<Array<TagItemObj>>([
  { path: '/1', tagPostNum: 1, lablel: 'Power BI' },
  { path: '/1', tagPostNum: 2, lablel: 'Power Query' },
  { path: '/1', tagPostNum: 3, lablel: 'DAX' },
  { path: '/1', tagPostNum: 3, lablel: 'PQ' },
  { path: '/1', tagPostNum: 5, lablel: '数据分析' },
  // { path: "/1", tagPostNum: 6, lablel: 'go' },
  // { path: "/1", tagPostNum: 7, lablel: 'vue3' },
  // { path: "/1", tagPostNum: 8, lablel: 'svg' },
  // { path: "/1", tagPostNum: 8, lablel: 'Excel' },
  // { path: "/1", tagPostNum: 9, lablel: '安全库存' },
  // { path: "/1", tagPostNum: 10, lablel: '日期表' },
  // { path: "/1", tagPostNum: 11, lablel: 'ODBC' },
  // { path: "/1", tagPostNum: 12, lablel: '模型' },
  // { path: "/1", tagPostNum: 13, lablel: 'DAX Studio' },
  // { path: "/1", tagPostNum: 14, lablel: '热力图' },
  // { path: "/1", tagPostNum: 15, lablel: 'pbirs' },
  // { path: "/1", tagPostNum: 16, lablel: '帕累托' },
  // { path: "/1", tagPostNum: 17, lablel: '排名' },
  // { path: "/1", tagPostNum: 18, lablel: 'Rank' },
  // { path: "/1", tagPostNum: 18, lablel: '技巧' },
  // { path: "/1", tagPostNum: 20, lablel: '排名' },
  // { path: "/1", tagPostNum: 21, lablel: 'access' },
  // { path: "/1", tagPostNum: 22, lablel: 'Power BI Report Server' },
  // { path: "/1", tagPostNum: 23, lablel: '先进先出' },
  // { path: "/1", tagPostNum: 24, lablel: 'M语言' },
  // { path: "/1", tagPostNum: 25, lablel: '模型' },
  // { path: "/1", tagPostNum: 26, lablel: 'HR' },
])

const tags = ref<Array<Item>>(
  items.value.map((item) => {
    return { item: item, color: generateItemColor() }
  })
)

function handleClick(clickedItem: Item) {
  console.log('Clicked tag:', clickedItem.item.lablel)
}
</script>

<style scoped lang="scss">
.tag-box {
  width: 320px;
  border: 1px solid #000;
  overflow-y: auto;
  padding-bottom: 5px;
  padding-left: 5px;
}

.tag-item {
  color: #ffffff;
  font-size: 13px;
  min-width: 50px;
  margin-top: 5px;
  margin-right: 5px;
  padding: 3px 3px;
  border: none;

  &:hover {
    cursor: pointer;
  }
}
</style>
