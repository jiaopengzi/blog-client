<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 16:21:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-05 18:18:31
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\index.vue
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
        @update-current-page="updateCurrentPage"
        @update-page-size="updatePageSize"
        @edit-row="editRow"
        @delete-rows="deleteRows"
        @update-search="updateSearch"
        @update-selection="updateSelection"
        @add-item-update-dialog-visible="addItemUpdateDialogVisible"
        @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
    >
        <template #btns>
            <el-button type="primary" @click="handleAdd"> 新增 </el-button>
        </template>

        <!-- 新增弹窗 -->
        <template #add-item-title>
            <span class="dialog-title">新增标签</span>
        </template>

        <template #add-item>
            <div class="dialog-add">
                <AddTag @add-status="addStatus" />
            </div>
        </template>

        <!-- 编辑弹窗 -->
        <template #edit-item-title>
            <span class="dialog-title">编辑标签</span>
        </template>

        <template #edit-item>
            <div class="dialog-edit">
                <EditTag :edit-data="editData" @edit-status="editStatus" />
            </div>
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import type { Pagination } from "@/components/common"
import type { TableData, TableColumn } from "@/components/common/base-table"
import { formatTableData } from "@/components/common/base-table"
import { debounce } from "throttle-debounce"
import { AdminSideMenu } from "@/views/admin/component/aside"
import { type PostTag } from "@/api/postTag/view"
import { viewPostTagAPI, type ViewPostTagRequest } from "@/api/postTag/view"

import { ResponseCode } from "@/api/responseCode"
import router from "@/router"
import { paginationRouterPush, PaginationQueryKey } from "@/router/utils"

import { ShowMsgTip } from "@/utils/message"

import BaseTable from "@/components/common/base-table"
import AddTag from "./component/add"
import EditTag from "./component/edit"
import { type EditForm } from "./component/edit"
import { useGetData } from "@/components/hooks/useGetData"
import { type DeletePostTagRequest, deletePostTagAPI } from "@/api/postTag/delete"

defineOptions({ name: AdminSideMenu.PostTag })

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        width: 180,
        align: "center",
    },
    {
        prop: "thumbnail",
        label: "图片",
        width: 150,
        align: "center",
        isImg: true,
    },
    {
        prop: "name",
        label: "标签名称",
        sortable: true,
        width: 150,
        align: "center",
    },
    {
        prop: "slug",
        label: "别名",
        sortable: true,
        width: 140,
        align: "center",
    },
    {
        prop: "created_at",
        label: "创建时间",
        sortable: true,
        width: 180,
        align: "center",
    },
    {
        prop: "description",
        label: "描述",
        sortable: true,
        width: 180,
        align: "center",
        formatter: (row: TableData) => {
            return ("description" in row && row.description) || "-"
        },
    },
    {
        prop: "post_count",
        label: "文章数量",
        sortable: true,
        width: 80,
        align: "center",
    },
    {
        prop: "order",
        label: "排序",
        sortable: true,
        width: 180,
        align: "center",
    },
])

const pagination = ref<Pagination<PostTag>>({
    total: 0,
    current_page: 1,
    page_size: 10,
    page_count: 1,
    page_sizes: [10, 20, 50, 100],
    records: [],
})

const search = ref("")

const addItemDialogVisible = ref(false)
const editItemDialogVisible = ref(false)

// url query key
enum queryKey {
    Search = "search",
}

const handleAdd = () => {
    // addItemDialogVisible.value = !addItemDialogVisible.value
    addItemDialogVisible.value = true
    console.log("00============", addItemDialogVisible.value)
}

const updateCurrentPage = async (val: number) => {
    pagination.value.current_page = val
    paginationRouterPush(AdminSideMenu.PostTag, pagination.value.page_size, val, {
        [queryKey.Search]: search.value,
    })
    console.log("01============", val)
}

const updatePageSize = async (val: number) => {
    pagination.value.page_size = val
    paginationRouterPush(AdminSideMenu.PostTag, val, pagination.value.current_page, {
        [queryKey.Search]: search.value,
    })
    console.log("02============", val)
}

// 需要编辑的用户ID
const editData = reactive<EditForm>({
    id: 0,
    name: "",
    slug: "",
})

const editRow = (index: number, row: TableData) => {
    console.log("04============", index, row)
    if ("id" in row) {
        editData.id = Number(row.id)
    }
    if ("name" in row) {
        editData.name = row.name
    }
    if ("slug" in row) {
        editData.slug = row.slug || ""
    }
    if ("description" in row) {
        editData.description = row.description
    }
    if ("img" in row) {
        editData.thumbnail = row.img?.url
    }
    if ("order" in row && row.order !== 0) {
        editData.order = Number(row.order) // 确保 order 是数字
    }
    editItemDialogVisible.value = true
}

const deleteRows = async (rows: TableData[]) => {
    // 将 rows 中的id 组成新的 list
    const ids = rows.flatMap((item) => ("id" in item ? Number(item.id) : []))

    const deleteUserRequest: DeletePostTagRequest = { id_list: ids }

    // 删除
    await deletePostTagAPI(deleteUserRequest).then((res) => {
        if (res.data.code === ResponseCode.PostTagDeleteSuccess) {
            // 删除成功后重新获取列表
            getPaginate({
                current_page: pagination.value.current_page,
                page_size: pagination.value.page_size,
                key_word: search.value,
            })
            ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 3000)
        } else {
            // 显示错误信息
            ShowMsgTip(ShowMsgTip.MsgType.error, res.data.msg, 3000)
        }
    })
}

const updateSearch = debounce(500, async (val: string) => {
    search.value = val
    paginationRouterPush(
        AdminSideMenu.PostTag,
        pagination.value.page_size,
        pagination.value.current_page,
        { [queryKey.Search]: val },
    )
    console.log("07============", val)
})

const updateSelection = (rows: TableData[]) => {
    console.log("18============", rows)
}

// 新增对话框
const addItemUpdateDialogVisible = (val: boolean) => {
    console.log("09============", val)
    addItemDialogVisible.value = val
}

// 编辑对话框
const editItemUpdateDialogVisible = (val: boolean) => {
    console.log("09============", val)
    editItemDialogVisible.value = val
}

// 获取分页用户
async function getPaginate(req: ViewPostTagRequest) {
    console.log("10============", req)
    // 如果 key_word 为空 则不传 key_word
    if (!req.key_word) {
        delete req.key_word
    }

    // 获取标签列表
    await viewPostTagAPI(req).then((res) => {
        if (res.data.code === ResponseCode.PostTagViewSuccess) {
            res.data.data.records = res.data.data.records.map((row: PostTag) =>
                formatTableData(row),
            )

            pagination.value = res.data.data
            console.log("11============", pagination.value)
        }
    })
}

// 从路由中query中获取值
function getValueFromQuery() {
    pagination.value.page_size =
        Number(router.currentRoute.value.query[PaginationQueryKey.PageSize]) || 10
    pagination.value.current_page =
        Number(router.currentRoute.value.query[PaginationQueryKey.CurrentPage]) || 1
    search.value = (router.currentRoute.value.query[queryKey.Search] as string) || ""
    console.log("12============", search.value)
}

const addStatus = async (status: boolean) => {
    // 如果 status 为 true 就更新
    if (status) {
        getValueFromQuery()
        // 按照角色获取用户数量
        await getPaginate({
            current_page: pagination.value.current_page,
            page_size: pagination.value.page_size,
            key_word: search.value,
        })
    }
}

const editStatus = async (status: boolean) => {
    // 如果 status 为 true 就更新
    if (status) {
        getValueFromQuery()
        await getPaginate({
            current_page: pagination.value.current_page,
            page_size: pagination.value.page_size,
            key_word: search.value,
        })
    }
}

// 初始化数据
const getDataOnBeforeMount = async () => {
    getValueFromQuery()
    await getPaginate({
        current_page: pagination.value.current_page,
        page_size: pagination.value.page_size,
        key_word: search.value,
    })
}

// 路由变化时获取数据
const getDataOnRouteChange = async () => {
    console.log("13============", search.value)
    await getPaginate({
        current_page: pagination.value.current_page,
        page_size: pagination.value.page_size,
        key_word: search.value,
    })
}

useGetData(getDataOnBeforeMount, getDataOnRouteChange)
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
