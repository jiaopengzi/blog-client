<!--
 * FilePath    : blog-client\src\components\common\post-list-admin\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 后台文章列表
-->

<template>
    <section>
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
            height="calc(100vh - 270px)"
            :loading-delete="loadingDelete"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @edit-row="editRow"
            @delete-rows="handleDeleteRows"
            @update-search="updateSearch"
            @run-search="runSearch"
            @update-selection="handleSelection"
            @click-category="handleClickCategory"
            @click-tag="handleClickTag"
            @click-author="handleClickAuthor"
            @view-post="onViewPost"
        >
            <template #btns>
                <el-button ref="addBtnRef" type="primary" @click="write"> {{ writeText }} </el-button>
            </template>

            <template #category v-if="postType === PostType.Post">
                <!-- v-for 循环 postCountGroup生成 按钮 -->
                <div ref="categoryRef" class="category-group">
                    <el-button
                        v-for="item in postCountGroup"
                        :key="item.key"
                        :class="{ active: item.key === activeGroup }"
                        @click="handlePostCountByGroup(item)"
                    >
                        {{ item.display }} ({{ item.count }})
                    </el-button>
                </div>
            </template>

            <template #custom-filter v-if="postType === PostType.Post">
                <div ref="customFilterRef" class="custom-filter">
                    <!-- 按照作者 分类 标签 -->
                    <div v-if="tags.size" class="custom-filter-item author-category-tag">
                        <el-button class="author-category-tag-item author-category-tag-btn" type="primary" size="small" @click="clearAuthorCategoryTag"
                            >X</el-button
                        >
                        <el-input-tag class="author-category-tag-item" v-model="authorCategoryTag" disabled />
                    </div>

                    <!-- 按照月份筛选 -->
                    <div class="custom-filter-item">
                        <el-select v-model="postCountMonthSelect" placeholder="全部日期" clearable style="width: 130px">
                            <el-option
                                v-for="item in postCountMonth"
                                :key="`${item.year}-${item.month}(${item.count})`"
                                :label="`${item.year}-${item.month.toString().padStart(2, '0')}(${item.count})`"
                                :value="`${item.year}-${item.month}`"
                            />
                        </el-select>
                    </div>

                    <!-- 自定义字段筛选 -->
                    <div class="custom-filter-item custom-fields">
                        <el-select class="custom-fields-item" v-model="postCustomFieldsSelect" placeholder="自定义筛选" clearable style="width: 130px">
                            <el-option v-for="item in CustomFields" :key="item" :label="CustomFieldsDisplay[item]" :value="item" />
                        </el-select>
                        <div class="custom-fields-item" v-show="postCustomFieldsSelect">
                            <span>最小值:</span>
                            <el-input-number v-model="postCustomFieldsMin" controls-position="right" :min="0" :max="9999999999999" style="width: 130px" />
                        </div>

                        <div class="custom-fields-item" v-show="postCustomFieldsSelect">
                            <span>最大值:</span>
                            <el-input-number v-model="postCustomFieldsMax" controls-position="right" :min="1" :max="9999999999999" style="width: 130px" />
                        </div>
                    </div>
                </div>
            </template>

            <template #operation v-if="postType === PostType.Post">
                <!-- 批量操作 -->
                <div class="operation">
                    <el-select class="operation-item" v-model="postOperationSelect" placeholder="批量更改" clearable style="width: 140px">
                        <el-option v-for="item in postBatchOperations" :key="item" :label="`更改为：${PostStatusDisplay[item] || item}`" :value="item" />
                    </el-select>
                    <el-button
                        class="operation-item"
                        type="primary"
                        :loading="loadingBatchOperation"
                        @click="handlePostStatusOperation"
                        v-show="postOperationSelect"
                        >更改</el-button
                    >
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { computed, reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { Target } from "@/api/common"
import { batchOperationPostStatusAPI, type BatchOperationPostStatusRequest, type PostStatusOperation } from "@/api/post/batchOperationPostStatus"
import { CustomFields, CustomFieldsDisplay, type PostResPaginationByAdmin, PostStatusCode, PostStatusDisplay, PostType } from "@/api/post/common"
import { deletePostAPI, type DeletePostRequest } from "@/api/post/delete"
import { type ViewPostByAdminRequest } from "@/api/post/viewByAdmin"
import type { PostCategory } from "@/api/postCategory/view"
import type { PostTag } from "@/api/postTag/view"
import { type QueryParamsRecord } from "@/api/request"
import { ResponseCode } from "@/api/response"
import type { User } from "@/api/user/getUsers"
import type { TableImg } from "@/components/common"
import { MsgType } from "@/components/common"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import { queryKey as queryKeyUpsert } from "@/components/common/post-upsert"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { usePostView } from "@/components/hooks/usePostView"
import { useUserStore } from "@/stores/user"
import { confirmCommon } from "@/utils/confirm"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import { useAPI } from "./api"
import { generateCols } from "./cols"
import { useHeader } from "./hooks"
import { groupList, type GroupType, type PostCountGroupItem, type PostListAdminProps, queryKey } from "./types"

defineOptions({ name: "PostListAdmin" })

const { postType, headTitle, routeName, writeRouteName } = defineProps<PostListAdminProps>()

useHead({
    title: headTitle,
})

const cols: TableColumn[] = generateCols(postType)

// 可以批量操作的状态
const postBatchOperations = ref([PostStatusCode.Draft, PostStatusCode.Private, PostStatusCode.Publish])

const postStatusOperationList = ref<PostStatusOperation[]>([])

const postOperationSelect = ref<PostStatusCode>()
const postCountMonthSelect = ref("")
const postCustomFieldsSelect = ref("")
const postCustomFieldsMin = ref(0)
const postCustomFieldsMax = ref(100)

const userStore = useUserStore()
const router = useRouter()

// 获取头部数据
const { postCountGroup, postCountMonth, allGroup, activeGroup, getPostCountStatus } = useHeader(userStore.getUserID, postType)

// 表格图片配置
const tableImg: TableImg = {
    width: 96,
    height: 96,
    svgFontSize: 50,
}

// 查询参数
const queryParams = reactive({} as ViewPostByAdminRequest)

// 字符串类型的 key
const stringKeys: StringKeys<ViewPostByAdminRequest>[] = [
    "custom_filed",
    "custom_filed_max",
    "custom_filed_min",
    "key_word",
    "post_author",
    "post_category_id",
    "post_tag_id",
    "post_type",
]

// 数字类型的 key
const numberKeys: NumberKeys<ViewPostByAdminRequest>[] = ["post_status", "year", "month", "is_pinned", "is_recommended", "current_page", "page_size"]

// 不需要请求的参数
const noRequestKeys: QueryParamsRecord<queryKey> = { [queryKey.Group]: allGroup }

// 点击分类、标签、作者
const clickCategory = ref<string>("")
const clickTag = ref<string>("")
const clickAuthor = ref<string>("")

const { viewAPIByPostType } = useAPI(postType)

const {
    addItemDialogVisible, // 添加对话框是否可见
    editItemDialogVisible, // 编辑对话框是否可见
    search, // 搜索关键字
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    deleteRows, // 删除行
    updatePaginate, // 更新分页
    updateRouterPush, // 更新查询参数和路由
    loadingDelete, // 删除加载状态
} = useBaseTable<PostResPaginationByAdmin, ViewPostByAdminRequest, DeletePostRequest>({
    routeName,
    viewAPI: viewAPIByPostType,
    viewResCode: ResponseCode.PostViewByAdminSuccess,
    queryParams,
    deleteAPI: deletePostAPI,
    deleteResCode: ResponseCode.PostDeleteSuccess,
    options: { stringKeys, numberKeys, noRequestKeys, tableImg, refreshPromiseFns: [getPostCountStatus] },
})

const handleDeleteRows = async (rows: TableData[]) => {
    await deleteRows(rows)
    await getPostCountStatus()
}

// 更新查询参数

// 处理 postCountGroup 点击事件
const handlePostCountByGroup = async (item: PostCountGroupItem) => {
    activeGroup.value = item.key
    // 清空重置
    Object.keys(queryParams).forEach((key) => {
        if (groupList.includes(key as GroupType)) {
            delete queryParams[key as keyof ViewPostByAdminRequest]
        }
    })

    // 配置查询参数
    if (item.group === queryKey.Group) {
        Object.assign(queryParams, { [queryKey.Group]: item.key })
    }

    if (item.group === queryKey.PostAuthor) {
        queryParams[queryKey.PostAuthor] = item.key
        Object.assign(queryParams, { [queryKey.PostAuthor]: item.key })
    }

    if (item.group === queryKey.PostStatus) {
        queryParams[queryKey.PostStatus] = Number(item.key)
        // Object.assign(queryParams, { [queryKey.PostStatus]: item.key })
    }

    if (item.group === queryKey.IsPinned) {
        Object.assign(queryParams, { [queryKey.IsPinned]: 1 })
    }

    if (item.group === queryKey.IsRecommended) {
        Object.assign(queryParams, { [queryKey.IsRecommended]: 1 })
    }

    // 清空
    clickAuthor.value = ""

    Object.assign(queryParams, {
        [queryKey.KeyWord]: search.value,
    })

    await updateRouterPush()
}

const handleClickCategory = async (item: PostCategory | PostTag) => {
    // 配置查询参数
    Object.assign(queryParams, {
        [queryKey.PostCategoryID]: item.id,
    })
    clickCategory.value = item.name

    await updateRouterPush()
}

const handleClickTag = async (item: PostCategory | PostTag) => {
    // 配置查询参数
    Object.assign(queryParams, {
        [queryKey.PostTagID]: item.id,
    })
    clickTag.value = item.name

    await updateRouterPush()
}

const handleClickAuthor = async (author: User) => {
    // 配置查询参数
    Object.assign(queryParams, {
        [queryKey.PostAuthor]: author.id,
    })
    clickAuthor.value = author.user_name

    await updateRouterPush()
}

const tags = computed(() => {
    const authorCategoryTagSet = new Set<string>()
    if (clickCategory.value) {
        authorCategoryTagSet.add(clickCategory.value)
    }
    if (clickTag.value) {
        authorCategoryTagSet.add(clickTag.value)
    }
    if (clickAuthor.value) {
        authorCategoryTagSet.add(clickAuthor.value)
    }
    return authorCategoryTagSet
})

const authorCategoryTag = ref<string[]>([])
watch(tags, (newVal) => {
    authorCategoryTag.value = Array.from(newVal)
})

const clearAuthorCategoryTag = async () => {
    clickCategory.value = ""
    clickTag.value = ""
    clickAuthor.value = ""

    // 删除查询参数
    Object.keys(queryParams).forEach((key) => {
        if (key === queryKey.PostCategoryID || key === queryKey.PostTagID) {
            delete queryParams[key as keyof ViewPostByAdminRequest]
        }

        // 如果分組中显示的不是当前用户的文章，删除
        if (key === queryKey.PostAuthor && activeGroup.value !== queryParams[key as keyof ViewPostByAdminRequest]) {
            delete queryParams[key as keyof ViewPostByAdminRequest]
        }
    })

    await updateRouterPush()
}

// 监控 postCountMonthSelect
watch(postCountMonthSelect, async (newVal) => {
    if (newVal) {
        const [year, month] = newVal.split("-")
        queryParams.year = Number(year)
        queryParams.month = Number(month)
    } else {
        delete queryParams.year
        delete queryParams.month
        await updateRouterPush()
    }
})

// 监控 postCustomFieldsSelect
watch([postCustomFieldsSelect, postCustomFieldsMin, postCustomFieldsMax], async ([newSelect, newMin, newMax], [oldSelect, oldMin, oldMax]) => {
    queryParams.custom_filed_min = oldMin.toString()
    queryParams.custom_filed_max = oldMax.toString()

    if (newSelect !== oldSelect) {
        queryParams.custom_filed = newSelect as CustomFields
    }

    if (newMin !== oldMin) {
        queryParams.custom_filed_min = newMin.toString()
    }

    if (newMax !== oldMax) {
        queryParams.custom_filed_max = newMax.toString()
    }

    if (newSelect === void 0) {
        delete queryParams.custom_filed
        delete queryParams.custom_filed_min
        delete queryParams.custom_filed_max
        await updateRouterPush()
    }
})

// 执行搜索
const runSearch = async () => {
    await updateRouterPush()
}

// 批量操作
const loadingBatchOperation = ref(false)
const handlePostStatusOperation = async () => {
    if (postStatusOperationList.value.length > 0) {
        confirmCommon(
            "确认更改?",

            // 确认后的操作
            () => {
                loadingBatchOperation.value = true
                // 构造请求参数
                const req: BatchOperationPostStatusRequest = {
                    operation_list: postStatusOperationList.value,
                }

                batchOperationPostStatusAPI(req).then(async (res) => {
                    if (res.data.code === ResponseCode.PostStatusBatchOperationSuccess) {
                        const msg = res.data.msg + "，请稍后刷新页面查看最新数据"

                        // 保证有数据且包含 stream_items 字段才进行轮询
                        if (res.data.data && res.data.data.stream_items) {
                            await pollingGetStreamIDsStatus(res.data.data.stream_items)
                        }

                        MessageUtil.success(msg, 3000)
                        await updatePaginate()
                        await getPostCountStatus()

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
    postStatusOperationList.value = []

    rows.flatMap((item) => {
        if ("id" in item) {
            postStatusOperationList.value.push({
                id: item.id.toString(),
                post_status: postOperationSelect.value as PostStatusCode,
            })
        }
    })
}

// 监控 postOperationSelect 更改
watch(postOperationSelect, async (newVal) => {
    if (newVal) {
        // 更新 postStatusOperationList 状态更改为 newVal
        postStatusOperationList.value = postStatusOperationList.value.map((item) => {
            item.post_status = newVal
            return item
        })
    }
})

const writeText = computed(() => {
    switch (postType) {
        case PostType.Post:
            return "写文章"
        case PostType.Page:
            return "新增页面"
        case PostType.Video:
            return "新增视频"
        default:
            return "写内容"
    }
})

// 写文章
const write = () => {
    router.push({ name: writeRouteName })
}

// 编辑文章
const editRow = (index: number, row: TableData) => {
    // 编辑文章
    router.push({
        name: writeRouteName,
        query: { [queryKeyUpsert.ID]: row.id },
    })
}

// 通用将 params 解析回对应的响应式变量中
useParams(queryParams, pagination, search)

// 将 params 解析回对应的响应式变量中(不需要请求)
const parseParamsNotLoaded = () => {
    // 在加载前将 params 解析回对应的响应式变量中
    const { post_author, post_status, year, month, custom_filed, custom_filed_min, custom_filed_max, is_pinned, is_recommended } = queryParams

    if (post_author && post_author === userStore.getUserID) {
        activeGroup.value = post_author
    }

    if (post_status) {
        activeGroup.value = post_status.toString()
    }

    if (is_pinned) {
        activeGroup.value = queryKey.IsPinned
    }

    if (is_recommended) {
        activeGroup.value = queryKey.IsRecommended
    }

    postCountMonthSelect.value = year && month ? `${year}-${month}` : ""
    postCustomFieldsSelect.value = custom_filed || ""
    postCustomFieldsMin.value = custom_filed_min ? Number(custom_filed_min) : 0
    postCustomFieldsMax.value = custom_filed_max ? Number(custom_filed_max) : 100
}

// 监控 queryParams
watch(
    () => queryParams,
    () => {
        parseParamsNotLoaded()
        // 如果包含 post_type 则移除，避免出现在路由中，在请求参数中已经单独处理了
        if (queryParams.post_type) {
            delete queryParams.post_type
        }
    },
    { deep: true },
)

// 将 params 解析回对应的响应式变量中(需要请求)
const parseParamsHasLoaded = () => {
    // 在加载前将 params 解析回对应的响应式变量中
    const { post_author, post_category_id, post_tag_id } = queryParams

    // 清空原有的数据
    clickAuthor.value = ""
    clickCategory.value = ""
    clickTag.value = ""

    // 解析作者
    if (post_author) {
        for (const item of pagination.records) {
            if (item.author_info.id === post_author) {
                clickAuthor.value = item.author_info.user_display_name
                break
            }
        }
    }

    // 解析分类
    if (post_category_id) {
        categoryLoop: for (const item of pagination.records) {
            for (const category of item.categories) {
                if (category.id === post_category_id) {
                    clickCategory.value = category.name
                    break categoryLoop
                }
            }
        }
    }

    // 解析标签
    if (post_tag_id) {
        tagLoop: for (const item of pagination.records) {
            for (const tag of item.tags) {
                if (tag.id === post_tag_id) {
                    clickTag.value = tag.name
                    break tagLoop
                }
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

const { handleViewPost } = usePostView()

// 前台查看文章/页面
const onViewPost = (postID: string) => {
    const row = pagination.records.find((item) => item.id === postID)
    const slug = row?.slug || postID
    handleViewPost(postID, Target.Blank, { postType, slug })
}
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
