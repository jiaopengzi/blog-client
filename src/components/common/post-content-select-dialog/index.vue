<!--
 * FilePath    : blog-client\src\components\common\post-content-select-dialog\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 文章和页面内容选择弹窗
-->

<template>
    <el-dialog v-model="isVisible" width="98%" top="5vh" class="post-content-select-dialog" @close="handleClose">
        <template #header>
            <div class="post-content-select-dialog__header">
                <h4 class="post-content-select-dialog__title">{{ dialogTitle }}</h4>
                <el-radio-group v-model="activePostType" size="large" class="post-content-select-dialog__type-switch">
                    <el-radio-button :value="PostType.Post">文章</el-radio-button>
                    <el-radio-button :value="PostType.Page">页面</el-radio-button>
                </el-radio-group>
            </div>
        </template>

        <PostListAdmin
            :key="activePostType"
            :route-name="activeRouteName"
            :write-route-name="activeWriteRouteName"
            :post-type="activePostType"
            :head-title="activeHeadTitle"
            :is-select-mode="true"
            :is-sync-route="false"
            :disable-head="true"
            table-height="55vh"
            @update-selection="updateSelection"
        />

        <template #footer>
            <div class="post-content-select-dialog__footer">
                <span class="post-content-select-dialog__selection-count">已选 {{ selectionRows.length }} 项</span>
                <div class="post-content-select-dialog__actions">
                    <el-button @click="isVisible = false">取消</el-button>
                    <el-button type="primary" class="post-content-select-dialog__insert" @click="insert">
                        <span>{{ insertButtonText }}</span>
                    </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"

import { PostType, type PostResPaginationByAdmin } from "@/api/post/common"
import PostListAdmin from "@/components/common/post-list-admin"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"
import { MessageUtil } from "@/utils/message"

defineOptions({ name: "PostContentSelectDialog" })

const { modelValue = false, initialPostType = PostType.Post } = defineProps<{
    /** modelValue, 弹窗是否显示. */
    modelValue?: boolean
    /** initialPostType, 打开弹窗时默认展示的内容类型. */
    initialPostType?: PostType
}>()

const emit = defineEmits<{
    (event: "update:modelValue", value: boolean): void
    (event: "insert-data", rows: PostResPaginationByAdmin[]): void
}>()

const activePostType = ref<PostType>(initialPostType)
const selectionRows = ref<PostResPaginationByAdmin[]>([])

const isVisible = computed<boolean>({
    get: () => modelValue,
    set: (value: boolean) => emit("update:modelValue", value),
})

/**
 * activeRouteName 当前选择类型对应的列表路由名.
 * @returns 文章或页面列表路由名.
 */
const activeRouteName = computed(() => (activePostType.value === PostType.Page ? RouteNames.PageAll : RouteNames.PostAll))

/**
 * activeWriteRouteName 当前选择类型对应的写入路由名.
 * @returns 文章或页面编辑路由名.
 */
const activeWriteRouteName = computed(() => (activePostType.value === PostType.Page ? RouteNames.PageWrite : RouteNames.PostWrite))

/**
 * activeHeadTitle 当前选择类型对应的后台菜单标题.
 * @returns 文章或页面列表标题.
 */
const activeHeadTitle = computed(() => adminMenuItemMap[activeRouteName.value].text)

/**
 * dialogTitle 当前弹窗标题.
 * @returns 与当前内容类型匹配的弹窗标题.
 */
const dialogTitle = computed(() => (activePostType.value === PostType.Page ? "页面引用" : "文章引用"))

/**
 * insertButtonText 当前确认按钮文案.
 * @returns 与当前内容类型匹配的确认按钮文案.
 */
const insertButtonText = computed(() => (activePostType.value === PostType.Page ? "插入页面引用" : "插入文章引用"))

watch(
    () => modelValue,
    (value) => {
        if (value) {
            activePostType.value = initialPostType
            selectionRows.value = []
        }
    },
)

watch(activePostType, () => {
    selectionRows.value = []
})

/**
 * handleClose 关闭弹窗并同步父组件状态.
 * @returns void.
 */
const handleClose = () => {
    emit("update:modelValue", false)
}

/**
 * updateSelection 缓存当前列表选中的文章或页面行.
 * @param rows - 后台列表选中的文章或页面行.
 * @returns void.
 */
const updateSelection = (rows: PostResPaginationByAdmin[]) => {
    selectionRows.value = rows.map((row) => ({
        ...row,
        post_type: activePostType.value,
    }))
}

/**
 * insert 校验选择并将文章或页面行回传给编辑器页面.
 * @returns void.
 */
const insert = () => {
    if (selectionRows.value.length === 0) {
        MessageUtil.warning("请选择需要插入的文章或页面")
        return
    }

    emit("insert-data", selectionRows.value)
    handleClose()
}
</script>

<style scoped lang="scss">
.post-content-select-dialog__header,
.post-content-select-dialog__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.post-content-select-dialog__title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: var(--jpz-text-color-primary);
}

.post-content-select-dialog__type-switch {
    flex-shrink: 0;
}

.post-content-select-dialog__selection-count {
    color: var(--jpz-text-color-secondary);
    font-size: 14px;
}

.post-content-select-dialog__actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.post-content-select-dialog__insert {
    margin-right: 16px;
}

@media (max-width: 768px) {
    .post-content-select-dialog__header,
    .post-content-select-dialog__footer {
        align-items: stretch;
        flex-direction: column;
    }

    .post-content-select-dialog__actions {
        justify-content: flex-end;
    }
}
</style>
