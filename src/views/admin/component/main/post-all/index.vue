<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 16:21:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-26 22:28:21
 * @FilePath     : \blog-client\src\views\admin\component\main\post-all\index.vue
 * @Description  : 标签管理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <BaseTable
        :pagination="pagination"
        :table-column="cols"
        :add-item-dialog-visible="addItemDialogVisible"
        :edit-item-dialog-visible="editItemDialogVisible"
        :is-show-delete-all="true"
        :is-show-search="true"
        :search-str="search"
        :is-show-edit="true"
        :row-style="{ height: '96px' }"
        tags-item-max-height="96px"
        @update-current-page="updateCurrentPage"
        @update-page-size="updatePageSize"
        @edit-row="editRow"
        @delete-rows="deleteRows"
        @update-search="updateSearch"
    >
        <template #btns>
            <el-button type="primary" @click="postWrite"> 写文章 </el-button>
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import type { TableData, TableColumn } from "@/components/common/base-table"
import { AdminSideMenu } from "@/views/admin/component/aside"
import { type PostInfoRes, PostStatusCode, PostStatusDisplay } from "@/api/post/common"
import { type ViewPostByAdminRequest, viewPostByAdminRequestAPI } from "@/api/post/viewByAdmin"
import { ResponseCode } from "@/api/responseCode"
import BaseTable from "@/components/common/base-table"
import { useGetData } from "@/components/hooks/useGetData"
import { type DeletePostRequest, deletePostAPI } from "@/api/post/delete"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { formatTime } from "@/utils/dateTime"
import router from "@/router"
import { queryKey } from "@/views/admin/component/main/post-write"
import { type TableImg } from "@/components/common"

defineOptions({ name: AdminSideMenu.PostTag })

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        width: 100,
        align: "center",
    },
    {
        prop: "thumbnail",
        label: "图片",
        width: 130,
        align: "center",
        isImg: true,
    },
    {
        prop: "post_title",
        label: "标题",
        sortable: true,
        width: 180,
        align: "center",
        isHeading: true,
    },
    {
        prop: "categories",
        label: "分类",
        sortable: true,
        width: 180,
        align: "center",
        isCategories: true,
    },
    {
        prop: "tags",
        label: "标签",
        sortable: true,
        width: 180,
        align: "center",
        isTags: true,
    },
    {
        prop: "price",
        label: "价格",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "view_count",
        label: "查看",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "like_count",
        label: "点赞",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "collect_count",
        label: "收藏",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "comment_count",
        label: "评论",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "author_info",
        label: "作者",
        sortable: true,
        minWidth: 120,
        align: "center",
        isAuthor: true,
    },
    {
        prop: "post_status",
        label: "状态",
        sortable: true,
        minWidth: 120,
        align: "center",
        formatter: (row: TableData) => {
            if ("post_status" in row) {
                const display = PostStatusDisplay[row.post_status as PostStatusCode]
                // 判断是否为定时或者过期
                if (row.post_status === PostStatusCode.Future && row.post_push_time.Time) {
                    return `${display}(${formatTime(row.post_push_time.Time)})`
                }

                if (row.post_status === PostStatusCode.Expired && row.post_expired_time.Time) {
                    return `${display}(${formatTime(row.post_expired_time.Time)})`
                }

                return display
            }
        },
    },
    {
        prop: "created_at",
        label: "创建时间",
        sortable: true,
        minWidth: 120,
        align: "center",
    },
])

// 表格图片配置
const tableImg: TableImg = {
    width: 96,
    height: 96,
    svgFontSize: 50,
}

// 查询参数
const queryParams = reactive({} as ViewPostByAdminRequest)

// hooks 使用
const {
    addItemDialogVisible, // 添加对话框是否可见
    editItemDialogVisible, // 编辑对话框是否可见
    search, // 搜索关键字
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    updatePaginate, // 更新分页数据
    deleteRows, // 删除行
    updatePaginateOnBeforeMount, // 更新分页数据
} = useBaseTable<PostInfoRes, ViewPostByAdminRequest, DeletePostRequest>(
    AdminSideMenu.PostAll,
    viewPostByAdminRequestAPI,
    ResponseCode.PostViewByAdminSuccess,
    deletePostAPI,
    ResponseCode.PostDeleteSuccess,
    queryParams,
    tableImg,
)

const postWrite = () => {
    router.push({ name: AdminSideMenu.PostWrite })
}

const editRow = (index: number, row: TableData) => {
    // 编辑文章
    router.push({
        name: AdminSideMenu.PostWrite,
        query: { [queryKey.ID]: row.id },
    })
}

// 获取数据
useGetData(updatePaginateOnBeforeMount, updatePaginate)
</script>

<style scoped lang="scss">
.dialog-title {
    font-size: 20px;
    font-weight: 700;
}

.dialog-add,
.dialog-edit {
    width: 100%;
    // 浮动 水平居中
    display: flex;
    justify-content: center;
}
</style>
