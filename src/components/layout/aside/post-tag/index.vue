<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:15:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-26 15:00:47
 * @FilePath     : \blog-client\src\components\layout\aside\post-tag\index.vue
 * @Description  : 文章标签
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="aside-item">
        <div class="title">
            <h2>
                <Icon :name="IconKeys.Label" customClass="my-icon" />
                文章标签
            </h2>
        </div>
        <div class="tag-box">
            <el-scrollbar max-height="300px">
                <TagItem v-for="(item, index) in items" :tagData="item" :key="index" @click="handleClick(item)" />
            </el-scrollbar>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import type { TagDataObj } from '@/components/common/tag-item'
import TagItem from '@/components/common/tag-item'
import { IconKeys } from '@/components/common/icons'


defineOptions({ name: 'PostTag' })

const emit = defineEmits<{
    (event: 'click', tagItemData: TagDataObj): void
}>()


const items = ref<Array<TagDataObj>>([
    { path: '/1', tagPostNum: 1, label: 'Power BI' },
    { path: '/1', tagPostNum: 2, label: 'Power Query' },
    { path: '/1', tagPostNum: 3, label: 'DAX' },
    { path: '/1', tagPostNum: 3, label: 'PQ' },
    { path: '/1', tagPostNum: 5, label: '数据分析' },
    { path: '/1', tagPostNum: 6, label: 'go' },
    { path: '/1', tagPostNum: 7, label: 'vue3' },
    { path: '/1', tagPostNum: 8, label: 'svg' },
    { path: '/1', tagPostNum: 8, label: 'Excel' },
    { path: '/1', tagPostNum: 9, label: '安全库存' },
    { path: '/1', tagPostNum: 10, label: '日期表' },
    { path: '/1', tagPostNum: 11, label: 'ODBC' },
    { path: '/1', tagPostNum: 12, label: '模型' },
    { path: '/1', tagPostNum: 13, label: 'DAX Studio' },
    { path: '/1', tagPostNum: 14, label: '热力图' },
    { path: '/1', tagPostNum: 15, label: 'pbirs' },
    { path: '/1', tagPostNum: 16, label: '帕累托' },
    { path: '/1', tagPostNum: 17, label: '排名' },
    { path: '/1', tagPostNum: 18, label: 'Rank' },
    { path: '/1', tagPostNum: 18, label: '技巧' },
    { path: '/1', tagPostNum: 20, label: '排名' },
    { path: '/1', tagPostNum: 21, label: 'access' },
    { path: '/1', tagPostNum: 22, label: 'Power BI Report Server' },
    { path: '/1', tagPostNum: 23, label: '先进先出' },
    { path: '/1', tagPostNum: 24, label: 'M语言' },
    { path: '/1', tagPostNum: 25, label: '模型' },
    { path: '/1', tagPostNum: 26, label: 'HR' },
    { path: '/1', tagPostNum: 13, label: 'DAX Studio' },
    { path: '/1', tagPostNum: 14, label: '热力图' },
    { path: '/1', tagPostNum: 15, label: 'pbirs' },
    { path: '/1', tagPostNum: 16, label: '帕累托' },
    { path: '/1', tagPostNum: 17, label: '排名' },
    { path: '/1', tagPostNum: 18, label: 'Rank' },
    { path: '/1', tagPostNum: 18, label: '技巧' },
    { path: '/1', tagPostNum: 20, label: '排名' },
    { path: '/1', tagPostNum: 21, label: 'access' },
    { path: '/1', tagPostNum: 22, label: 'Power BI Report Server' },
    { path: '/1', tagPostNum: 23, label: '先进先出' },
    { path: '/1', tagPostNum: 24, label: 'M语言' },
    { path: '/1', tagPostNum: 25, label: '模型' },
    { path: '/1', tagPostNum: 26, label: 'HR' },
])

const handleClick = (tagItemData: TagDataObj) => {
    emit('click', tagItemData)
}

</script>
<style scoped lang="scss">
.aside-item {
    border: 1px solid #eaeaea;
    background-color: $background-color-content;
    border-radius: 5px;

    .title {
        background-color: $background-color-page;
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