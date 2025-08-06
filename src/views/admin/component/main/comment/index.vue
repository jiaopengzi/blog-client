<!--
 * FilePath    : blog-client\src\views\admin\component\main\comment\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论管理
-->

<template>
    <section>
        <BaseTable
            :pagination="pagination"
            :table-column="cols"
            :edit-item-dialog-visible="editItemDialogVisible"
            :is-show-delete-all="true"
            :is-show-search="true"
            :search-str="search"
            :is-show-edit="true"
            :row-style="{ height: '96px' }"
            tags-item-max-height="96px"
            height="calc(100vh - 270px)"
            :is-show-cursor-pointer="true"
            :is-show-user-name="true"
            :avatar-width="40"
            :is-show-user-email="true"
            :is-show-user-display-name="true"
            :loading-delete="loadingDelete"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @edit-row="editRow"
            @delete-rows="handleDeleteRows"
            @update-search="updateSearch"
            @run-search="runSearch"
            @update-selection="handleSelection"
            @click-author="handleClickAuthor"
            @post-click="handleClickPostTitle"
            @view-post="handleViewPost"
            @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
        >
            <template #category>
                <!-- v-for 循环 commentCountGroup生成 按钮 -->
                <div ref="categoryRef" class="category-group">
                    <el-button
                        v-for="item in commentCountGroup"
                        :key="item.key"
                        :class="{ active: item.key === activeGroup }"
                        @click="handleCommentCountByGroup(item)"
                    >
                        {{ item.display }} ({{ item.count }})
                    </el-button>
                </div>
            </template>

            <template #custom-filter>
                <div ref="customFilterRef" class="custom-filter">
                    <!-- 按照作者-->
                    <div v-if="tags.size" class="custom-filter-item author-category-tag">
                        <el-button class="author-category-tag-item author-category-tag-btn" type="primary" size="small" @click="clearAuthorCategoryTag"
                            >X</el-button
                        >
                        <el-input-tag class="author-category-tag-item" v-model="userPost" disabled />
                    </div>
                </div>
            </template>

            <template #operation>
                <!-- 批量操作 -->
                <div class="operation">
                    <el-select class="operation-item" v-model="commentOperationSelect" placeholder="批量更改" clearable style="width: 140px">
                        <el-option v-for="item in commentBatchOperations" :key="item" :label="`更改为：${CommentStatusDisplay[item] || item}`" :value="item" />
                    </el-select>
                    <el-button
                        class="operation-item"
                        type="primary"
                        :loading="loadingBatchOperation"
                        @click="handleCommentStatusOperation"
                        v-show="commentOperationSelect"
                        >更改</el-button
                    >
                </div>
            </template>

            <!-- 编辑弹窗 -->
            <template #edit-item-title>
                <span class="dialog-title">编辑和回复评论</span>
            </template>

            <template #edit-item>
                <div class="dialog-edit">
                    <EditReply
                        :data="data"
                        :post-id="postId"
                        :mentions="mentions"
                        :comment-status="commentStatus"
                        @complete-edit="handleEditReply"
                        @complete-reply="handleEditReply"
                    />
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import type { Completion } from "@codemirror/autocomplete"
import { useHead } from "@unhead/vue"
import { computed, reactive, type Ref, ref, watch } from "vue"
import { useRouter } from "vue-router"

import { batchOperationCommentStatusAPI, type BatchOperationCommentStatusRequest, type CommentStatusOperation } from "@/api/comment/batchOperationCommentStatus"
import { type CommentResAdmin, CommentReviewCode, CommentStatusDisplay } from "@/api/comment/common"
import { deleteCommentAdminAPI, type DeleteCommentRequest } from "@/api/comment/delete"
import { viewCommentByAdminAPI, type ViewCommentByAdminRequest } from "@/api/comment/viewByAdmin"
import { CommentStatusCode } from "@/api/post/common"
import { type QueryParamsRecord } from "@/api/request"
import { ResponseCode } from "@/api/response"
import type { User } from "@/api/user/getUsers"
import type { TableImg } from "@/components/common"
import { MsgType } from "@/components/common"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { confirmCommon } from "@/utils/confirm"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import EditReply from "./edit-reply"
import { useHeader } from "./hooks"
import { type CommentCountGroupItem, groupList, type GroupType, queryKey } from "./types"

defineOptions({ name: RouteNames.Comment })

useHead({
    title: adminMenuItemMap[RouteNames.Comment].text,
})

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        width: 100,
        align: "center",
    },
    {
        prop: "user_info",
        label: "评论作者",
        minWidth: 120,
        align: "center",
        isUser: true,
    },
    {
        prop: "content",
        label: "评论内容",
        sortable: true,
        minWidth: 400,
        align: "center",
        isMarkdownPreview: true,
    },
    {
        prop: "status",
        label: "状态",
        sortable: true,
        minWidth: 80,
        align: "center",
        formatter: (row: TableData) => {
            if ("status" in row) {
                const display = CommentStatusDisplay[row.status as CommentReviewCode]
                return display
            }
        },
    },
    {
        prop: "post_info",
        label: "文章信息",
        minWidth: 120,
        align: "center",
        isCommentWithPost: true,
    },
    {
        prop: "created_at",
        label: "创建时间",
        sortable: true,
        minWidth: 100,
        align: "center",
    },
    {
        prop: "ip_address",
        label: "IP地址",
        minWidth: 100,
        align: "center",
    },
])

// 可以批量操作的状态
const commentBatchOperations = ref([CommentReviewCode.Pending, CommentReviewCode.Approved, CommentReviewCode.Rejected])

const commentStatusOperationList = ref<CommentStatusOperation[]>([])

const commentOperationSelect = ref<CommentReviewCode>()

const router = useRouter()

// 获取头部数据
const { commentCountGroup, allGroup, activeGroup, getCommentCountStatus } = useHeader()

// 表格图片配置
const tableImg: TableImg = {
    width: 96,
    height: 96,
    svgFontSize: 50,
}

// 查询参数
const queryParams = reactive({} as ViewCommentByAdminRequest)

// 字符串类型的 key
const stringKeys: StringKeys<ViewCommentByAdminRequest>[] = ["post_id", "key_word"]

// 数字类型的 key
const numberKeys: NumberKeys<ViewCommentByAdminRequest>[] = ["status", "current_page", "page_size"]

// 不需要请求的参数
const noRequestKeys: QueryParamsRecord<queryKey> = { [queryKey.Group]: allGroup }

// 点击文章名称
const clickPostTitle = ref<string>("")
const clickAuthor = ref<string>("")

// useBaseTable hooks 使用
const {
    editItemDialogVisible, // 编辑对话框是否可见
    search, // 搜索关键字
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    deleteRows, // 删除行
    updatePaginate, // 更新分页
    updateRouterPush, // 更新查询参数和路由
    editItemUpdateDialogVisible, // 编辑对话框
    loadingDelete, // 删除加载状态
} = useBaseTable<CommentResAdmin, ViewCommentByAdminRequest, DeleteCommentRequest>({
    routeName: RouteNames.Comment,
    viewAPI: viewCommentByAdminAPI,
    viewResCode: ResponseCode.CommentViewSuccess,
    queryParams,
    deleteAPI: deleteCommentAdminAPI,
    deleteResCode: ResponseCode.CommentDeleteSuccess,
    options: { stringKeys, numberKeys, noRequestKeys, tableImg },
})

const handleDeleteRows = async (rows: TableData[]) => {
    await deleteRows(rows)
    await getCommentCountStatus()
}

// 处理 commentCountGroup 点击事件
const handleCommentCountByGroup = async (item: CommentCountGroupItem) => {
    activeGroup.value = item.key
    // 清空重置
    Object.keys(queryParams).forEach((key) => {
        if (groupList.includes(key as GroupType)) {
            delete queryParams[key as keyof ViewCommentByAdminRequest]
        }
    })

    // 配置查询参数
    if (item.group === queryKey.Group) {
        Object.assign(queryParams, { [queryKey.Group]: item.key })
    }

    if (item.group === queryKey.Status) {
        queryParams[queryKey.Status] = Number(item.key)
    }

    Object.assign(queryParams, {
        [queryKey.KeyWord]: search.value,
    })

    await updateRouterPush()
}

const handleClickPostTitle = async (postID: string) => {
    // 配置查询参数
    Object.assign(queryParams, {
        [queryKey.PostID]: postID,
    })

    // 历遍分页数据超找文章标题
    const comment = pagination.records.find((item) => item.post_info.id === postID)
    if (comment) {
        // 如果找到了文章标题，设置点击的文章标题
        clickPostTitle.value = comment.post_info.post_title || ""
    } else {
        // 如果没有找到文章标题，设置为空
        clickPostTitle.value = ""
    }

    await updateRouterPush()
}

// 处理查看文章详情
const handleViewPost = (postID: string) => {
    router.push({
        name: RouteNames.Home,
        query: { [queryKey.PostID]: postID },
    })
}

// 处理作者点击事件
const handleClickAuthor = async (author: User) => {
    // 配置查询参数
    Object.assign(queryParams, {
        [queryKey.UserID]: author.id,
    })
    clickAuthor.value = author.user_name

    await updateRouterPush()
}

const tags = computed(() => {
    const userPostSet = new Set<string>()

    // 文章标题
    if (clickPostTitle.value) {
        userPostSet.add(clickPostTitle.value)
    }

    // 用户
    if (clickAuthor.value) {
        userPostSet.add(clickAuthor.value)
    }

    return userPostSet
})

const userPost = ref<string[]>([])
watch(tags, (newVal) => {
    userPost.value = Array.from(newVal)
})

// 清除作者分类标签
const clearAuthorCategoryTag = async () => {
    clickAuthor.value = ""
    clickPostTitle.value = ""

    // 删除查询参数
    Object.keys(queryParams).forEach((key) => {
        // 如果是文章ID，删除
        if (key === queryKey.PostID) {
            delete queryParams[key as keyof ViewCommentByAdminRequest]
        }
        // 如果分組中显示的不是当前用户的文章，删除
        if (key === queryKey.UserID && activeGroup.value !== queryParams[key as keyof ViewCommentByAdminRequest]) {
            delete queryParams[key as keyof ViewCommentByAdminRequest]
        }
    })

    await updateRouterPush()
}

// 执行搜索
const runSearch = async () => {
    await updateRouterPush()
}

// 编辑回复评论完成
const handleEditReply = async () => {
    // 重新加载数据
    await getCommentCountStatus()
    await updatePaginate()
    editItemDialogVisible.value = false
}

// 批量操作
const loadingBatchOperation = ref(false)
const handleCommentStatusOperation = async () => {
    if (commentStatusOperationList.value.length > 0) {
        confirmCommon(
            "确认更改?",

            // 确认后的操作
            () => {
                loadingBatchOperation.value = true
                // 构造请求参数
                const req: BatchOperationCommentStatusRequest = {
                    operation_list: commentStatusOperationList.value,
                }

                batchOperationCommentStatusAPI(req).then(async (res) => {
                    if (res.data.code === ResponseCode.CommentStatusBatchOperationSuccess) {
                        const msg = res.data.msg
                        MessageUtil.success(msg, 3000)

                        // 轮询后端是否完成
                        await pollingGetStreamIDsStatus(res.data.data.stream_items)

                        await updatePaginate()
                        await getCommentCountStatus()
                        loadingBatchOperation.value = false
                    } else {
                        loadingBatchOperation.value = false
                        MessageUtil.error(res.data.msg, 3000)
                    }
                })
            },

            // 取消后的操作
            () => {},
        )
    } else {
        ElMessage({
            type: MsgType.info,
            message: "请选择需要更改的数据",
        })
    }
}

// 处理选择行
const handleSelection = async (rows: TableData[]) => {
    // 先清空
    commentStatusOperationList.value = []

    rows.flatMap((item) => {
        if ("status" in item) {
            commentStatusOperationList.value.push({
                id: item.id.toString(),
                status: commentOperationSelect.value as CommentReviewCode,
            })
        }
    })
}

// 监控 postOperationSelect 更改
watch(commentOperationSelect, async (newVal) => {
    if (newVal) {
        // 更新 postStatusOperationList 状态更改为 newVal
        commentStatusOperationList.value = commentStatusOperationList.value.map((item) => {
            item.status = newVal
            return item
        })
    }
})

// 编辑回复评论
const data: Ref<CommentResAdmin> = ref({} as CommentResAdmin)
const mentions: Ref<Completion[]> = ref([]) // 提及的用户
const postId: Ref<string> = ref("")
const commentStatus: Ref<CommentStatusCode> = ref(CommentStatusCode.Open) // 评论开启状态
const editRow = (index: number, row: TableData) => {
    // 编辑评论
    if ("post_info" in row) {
        data.value.id = row.id.toString()
        data.value.created_at = row.created_at
        data.value.post_id = row.post_info.id.toString()
        data.value.content = row.content
        data.value.user_id = row.user_info.id.toString()
        data.value.is_pinned = row.is_pinned
        data.value.post_author = row.post_author
        data.value.user_info = row.user_info

        data.value.updated_at = row.updated_at
        data.value.status = row.status
        data.value.ip_address = row.ip_address
        data.value.user_agent = row.user_agent
        data.value.post_info = row.post_info

        // 清空 mentions
        mentions.value = []
        mentions.value.push({
            label: `@${row.user_info.user_display_name}`,
            apply: `[@${row.user_info.user_display_name}](${row.user_info.user_name})`,
        })
        postId.value = row.post_info.id.toString()
        commentStatus.value = row.post_info.comment_status
    }
}

// 通用将 params 解析回对应的响应式变量中
useParams(queryParams, pagination, search)

// 将 params 解析回对应的响应式变量中(不需要请求)
const parseParamsNotLoaded = () => {
    // 在加载前将 params 解析回对应的响应式变量中
    const { post_id, status } = queryParams

    if (post_id) {
        activeGroup.value = post_id.toString()
    }

    if (status) {
        activeGroup.value = status.toString()
    }
}

// 监控 queryParams
watch(
    () => queryParams,
    () => {
        parseParamsNotLoaded()
    },
    { deep: true },
)

// 将 params 解析回对应的响应式变量中(需要请求)
const parseParamsHasLoaded = () => {
    // 在加载前将 params 解析回对应的响应式变量中
    const { user_id, post_id } = queryParams

    // 清空原有的数据
    clickAuthor.value = ""
    clickPostTitle.value = ""

    // 解析用户信息
    if (user_id) {
        for (const item of pagination.records) {
            if (item.user_info.id === user_id) {
                clickAuthor.value = item.user_info.user_name || ""
                break
            }
        }
    }

    // 解析文章标题
    if (post_id) {
        postLoop: for (const item of pagination.records) {
            if (item.post_info.id === post_id) {
                clickPostTitle.value = item.post_info.post_title || ""
                break postLoop
            }
        }
    }
}

// 当 pagination.records 有数据时，解析 params,只需要执行一次
watch(
    () => pagination.records,
    (newRecords) => {
        if (newRecords.length > 0) {
            parseParamsHasLoaded()
        }
    },
    { deep: true },
)
</script>

<style scoped lang="scss">
.custom-filter {
    display: flex;
    align-items: center;
    // margin-right: 10px;

    .custom-filter-item {
        margin-right: 10px;
    }
}

.author-category-tag {
    display: flex;
    align-items: center;
    position: relative;

    .author-category-tag-item {
        margin-right: 10px;
    }

    // author-category-tag-btn 绝对定位到最右边垂直居中
    .author-category-tag-btn {
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
    }
}

.custom-fields {
    display: flex;
    align-items: center;
    // margin-right: 10px;

    .custom-fields-item {
        span {
            margin: 0 4px;
            font-size: 14px;
            color: var(--jpz-text-color-regular);
        }
    }
}

.operation {
    display: flex;
    align-items: center;
    margin-left: 20px;

    border-left: 1px solid var(--jpz-color-primary);
    padding-left: 30px;

    .operation-item {
        margin-right: 10px;
    }
}
</style>
