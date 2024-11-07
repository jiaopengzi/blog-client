<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:14:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-07 14:36:18
 * @FilePath     : \blog-client\src\components\layout\aside\month-archive\index.vue
 * @Description  : 阅读存档
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="aside-item">
        <div class="title">
            <h2><Icon :name="IconKeys.Archive" custom-class="aside-icon" />文章归档</h2>
        </div>
        <div class="table">
            <el-table
                :max-height="400"
                :data="tableData"
                :show-header="true"
                :row-class-name="tableRowClassName"
                @row-click="handleRowClick"
            >
                <el-table-column prop="date" label="月份" align="center" />
                <el-table-column prop="num" label="文章数量" align="center" />
            </el-table>
        </div>
    </div>
</template>
<script setup lang="ts">
import router from "@/router/index"
import { IconKeys } from "@/components/common/icons"

defineOptions({ name: "MonthArchive" })

// 参考官方文档 https://element-plus.org/zh-CN/component/table.html#table-%E4%BA%8B%E4%BB%B6
function handleRowClick(row: any) {
    router.push({ path: row.path })
}

const tableData = [
    {
        date: "2016-05",
        num: 1,
        path: "/post/1",
    },
    {
        date: "2016-05",
        num: 2,
        path: "/post/2",
    },
    {
        date: "2016-05",
        num: 1,
        path: "/post/1",
    },
    // {
    //   date: '2016-05',
    //   num: 2,
    //   path: '/post/2',
    // },
    // {
    //   date: '2016-05',
    //   num: 1,
    //   path: '/post/1',
    // },
    // {
    //   date: '2016-05',
    //   num: 2,
    //   path: '/post/2',
    // },
    // {
    //   date: '2016-05',
    //   num: 1,
    //   path: '/post/1',
    // },
    // {
    //   date: '2016-05',
    //   num: 2,
    //   path: '/post/2',
    // },
    // {
    //   date: '2016-05',
    //   num: 1,
    //   path: '/post/1',
    // },
    // {
    //   date: '2016-05',
    //   num: 2,
    //   path: '/post/2',
    // },
    // {
    //   date: '2016-05',
    //   num: 2,
    //   path: '/post/2',
    // },
    // {
    //   date: '2016-05',
    //   num: 1,
    //   path: '/post/1',
    // },
    // {
    //   date: '2016-05',
    //   num: 2,
    //   path: '/post/2',
    // },
]

const tableRowClassName = () => {
    return "month-archive-row-class" // 返回 class 名称 全局样式
}
</script>
<style scoped lang="scss">
.aside-item {
    border: 1px solid #eaeaea;
    background-color: $background-color-content;
    border-radius: 5px;
}

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

.aside-icon {
    font-size: 20px;
    margin-right: 5px;
    fill: #bb1818;
}

:deep(.month-archive-row-class) {
    cursor: pointer;
}
</style>
