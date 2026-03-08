<!--
 * FilePath    : blog-client\src\views\admin\component\main\membership-user\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 会员用户列表
-->

<template>
    <section class="membership-user-page">
        <BaseTable
            :pagination="pagination"
            :table-column="cols"
            :add-item-dialog-visible="addItemDialogVisible"
            :edit-item-dialog-visible="editItemDialogVisible"
            :is-show-search="true"
            :search-str="search"
            :loading-delete="loadingDelete"
            height="calc(100vh - 270px)"
            :is-show-cursor-pointer="true"
            :is-show-user-name="true"
            :avatar-width="40"
            :is-show-user-email="true"
            :is-show-user-display-name="true"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @update-search="updateSearch"
            @run-search="runSearch"
            @click-author="handleClickAuthor"
        >
            <template #category>
                <div class="category-group">
                    <el-button
                        v-for="item in membershipUserCountGroup"
                        :key="item.key"
                        :class="{ active: item.key === activeGroup }"
                        @click="handleExpireGroup(item)"
                    >
                        <span v-if="item.icon">
                            {{ item.icon === "unexpired" ? "✅" : "❌" }}
                        </span>
                        {{ item.display }} ({{ item.count }})
                    </el-button>
                </div>
            </template>

            <template #custom-filter>
                <div class="custom-filter">
                    <FilterTagClear v-if="tags.size" class="custom-filter-item" :tags="userMembership" @clear="clearAuthorCategoryTag" />
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { CircleCheckFilled, WarningFilled } from "@element-plus/icons-vue"
import { useHead } from "@unhead/vue"
import { computed, onBeforeMount, reactive, ref, watch } from "vue"

import type { MembershipUserRes } from "@/api/membership/common"
import { getMembershipUserCountByExpireAPI, type MembershipUserCountByExpire } from "@/api/membership/getUserCountByExpire"
import { type ViewMembershipUserRequest, viewMembershipUserAPI } from "@/api/membership/userView"
import type { QueryParamsRecord } from "@/api/request"
import { ResponseCode } from "@/api/response"
import type { User } from "@/api/user/getUsers"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import FilterTagClear from "@/components/common/filter-tag-clear"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { formatTime } from "@/utils/dateTime"
import { adminMenuItemMap } from "@/views/admin/component/aside"

defineOptions({ name: RouteNames.MembershipUser })

useHead({
    title: adminMenuItemMap[RouteNames.MembershipUser].text,
})

enum queryKey {
    Group = "group",
    UserID = "user_id",
    IsExpired = "is_expired",
    KeyWord = "key_word",
}

interface MembershipUserCountGroupItem {
    display: string
    group: queryKey.Group | queryKey.IsExpired
    icon?: "unexpired" | "expired"
    key: string
    count: number
    index: number
}

const groupList = [queryKey.Group, queryKey.IsExpired] as const

/**
 * isMembershipExpired 判断会员是否已过期。
 */
const isMembershipExpired = (expireTime: MembershipUserRes["expire_time"]): boolean => {
    if (!expireTime || expireTime.Valid === false || expireTime.Time === null) {
        return false
    }

    return new Date(expireTime.Time).getTime() <= Date.now()
}

/**
 * formatMembershipExpireTime 格式化会员到期时间展示。
 */
const formatMembershipExpireTime = (expireTime: MembershipUserRes["expire_time"]): string => {
    if (!expireTime || expireTime.Valid === false || expireTime.Time === null) {
        return "永久有效"
    }

    return formatTime(expireTime.Time)
}

/**
 * getMembershipExpireDisplay 获取会员过期状态显示文案。
 */
const getMembershipExpireDisplay = (expireTime: MembershipUserRes["expire_time"]): string => {
    return isMembershipExpired(expireTime) ? "❌已过期" : "✅未过期"
}

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        minWidth: 180,
        align: "center",
        isCopyText: true,
    },
    {
        prop: "user_info",
        label: "用户",
        minWidth: 220,
        align: "center",
        isUser: true,
    },
    {
        prop: "role",
        label: "会员角色",
        sortable: true,
        minWidth: 140,
        align: "center",
        isHeading: true,
    },
    {
        prop: "membership_id",
        label: "会员ID",
        sortable: true,
        minWidth: 180,
        align: "center",
        isCopyText: true,
    },
    {
        prop: "order_id",
        label: "订单ID",
        sortable: true,
        minWidth: 180,
        align: "center",
        isCopyText: true,
    },
    // {
    //     prop: "user_info",
    //     label: "订阅状态",
    //     sortable: true,
    //     minWidth: 120,
    //     align: "center",
    //     formatter: (row: TableData) => {
    //         if ("user_info" in row) {
    //             return "subscribe_status" in row.user_info && row.user_info.subscribe_status === 1 ? "已订阅" : "未订阅"
    //         }

    //         return "-"
    //     },
    // },
    {
        prop: "created_at",
        label: "开通时间",
        sortable: true,
        minWidth: 180,
        align: "center",
    },
    {
        prop: "expire_time",
        label: "过期时间",
        sortable: true,
        minWidth: 180,
        align: "center",
        formatter: (row: TableData) => {
            if ("expire_time" in row) {
                return formatMembershipExpireTime(row.expire_time as MembershipUserRes["expire_time"])
            }

            return "-"
        },
    },
    {
        prop: "is_expired",
        label: "是否过期",
        sortable: true,
        minWidth: 120,
        align: "center",
        formatter: (row: TableData) => {
            if ("expire_time" in row) {
                return getMembershipExpireDisplay(row.expire_time as MembershipUserRes["expire_time"])
            }

            return "-"
        },
    },
])

const queryParams = reactive<ViewMembershipUserRequest>({} as ViewMembershipUserRequest)

const stringKeys: StringKeys<ViewMembershipUserRequest>[] = ["key_word", "user_id"]
const numberKeys: NumberKeys<ViewMembershipUserRequest>[] = ["current_page", "page_size"]
const booleanKeys: BooleanKeys<ViewMembershipUserRequest>[] = ["is_expired"]
const noRequestKeys: QueryParamsRecord<queryKey> = { [queryKey.Group]: "all" }

const allGroup = "all"
const activeGroup = ref(allGroup)
const membershipUserCountExpire = ref<MembershipUserCountByExpire[]>([])

const membershipUserCountGroup = computed<MembershipUserCountGroupItem[]>(() => {
    const expiredCount = membershipUserCountExpire.value.find((item) => item.is_expired)?.count ?? 0
    const unexpiredCount = membershipUserCountExpire.value.find((item) => !item.is_expired)?.count ?? 0

    return [
        { display: "全部", group: queryKey.Group, key: allGroup, count: expiredCount + unexpiredCount, index: 0 },
        { display: "未过期", group: queryKey.IsExpired, icon: "unexpired", key: "false", count: unexpiredCount, index: 1 },
        { display: "已过期", group: queryKey.IsExpired, icon: "expired", key: "true", count: expiredCount, index: 2 },
    ]
})

const clickAuthor = ref("")
const userMembership = ref<string[]>([])

const tags = computed(() => {
    const userMembershipSet = new Set<string>()

    if (clickAuthor.value) {
        userMembershipSet.add(clickAuthor.value)
    }

    return userMembershipSet
})

watch(tags, (newVal) => {
    userMembership.value = Array.from(newVal)
})

/**
 * getMembershipUserExpireCount 获取会员用户过期统计数据。
 */
const getMembershipUserExpireCount = async () => {
    const res = await getMembershipUserCountByExpireAPI()
    if (res.data.code === ResponseCode.MembershipUserCountByExpireSuccess) {
        membershipUserCountExpire.value = res.data.data
        return
    }

    membershipUserCountExpire.value = []
}

const { addItemDialogVisible, editItemDialogVisible, search, pagination, updateCurrentPage, updatePageSize, updateSearch, updateRouterPush, loadingDelete } =
    useBaseTable<MembershipUserRes, ViewMembershipUserRequest, never>({
        routeName: RouteNames.MembershipUser,
        viewAPI: viewMembershipUserAPI,
        viewResCode: ResponseCode.MembershipUserViewSuccess,
        queryParams,
        options: { stringKeys, numberKeys, booleanKeys, noRequestKeys, refreshPromiseFns: [getMembershipUserExpireCount] },
    })

const runSearch = async () => {
    await updateRouterPush()
}

/**
 * handleExpireGroup 处理按是否过期分组点击事件。
 */
const handleExpireGroup = async (item: MembershipUserCountGroupItem) => {
    activeGroup.value = item.key

    groupList.forEach((key) => {
        delete queryParams[key as keyof ViewMembershipUserRequest]
    })

    if (item.group === queryKey.Group) {
        Object.assign(queryParams, { [queryKey.Group]: item.key })
    }

    if (item.group === queryKey.IsExpired) {
        queryParams.is_expired = item.key === "true"
    }

    Object.assign(queryParams, {
        [queryKey.KeyWord]: search.value,
    })

    await updateRouterPush()
}

const handleClickAuthor = async (author: User) => {
    Object.assign(queryParams, {
        user_id: author.id,
    })
    clickAuthor.value = author.user_name

    await updateRouterPush()
}

const clearAuthorCategoryTag = async () => {
    clickAuthor.value = ""
    delete queryParams.user_id

    await updateRouterPush()
}

/**
 * parseParamsNotLoaded 解析无需请求的分组参数。
 */
const parseParamsNotLoaded = () => {
    if (queryParams.is_expired === true) {
        activeGroup.value = "true"
        return
    }

    if (queryParams.is_expired === false) {
        activeGroup.value = "false"
        return
    }

    activeGroup.value = allGroup
}

useParams(queryParams, pagination, search)

watch(
    () => queryParams,
    () => {
        parseParamsNotLoaded()
    },
    { deep: true },
)

onBeforeMount(async () => {
    await getMembershipUserExpireCount()
})
</script>

<style scoped lang="scss">
.membership-user-page {
    margin-top: 40px;
}
.custom-filter {
    display: flex;
    align-items: center;

    .custom-filter-item {
        margin-right: 10px;
    }
}
</style>
