<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 10:04:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-09 15:25:30
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\index.vue
 * @Description  : 写文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <el-container ref="elContainerRef" direction="vertical">
        <div class="btns-header">
            <div class="btns-header-left">
                <el-button type="primary" class="add-media btns-header-item">
                    <Icon :name="IconKeys.Media" custom-class="btns-header-item-icon" />
                    <span>添加媒体</span>
                </el-button>
            </div>
            <div class="btns-header-right">
                <el-button type="primary" class="save-post btns-header-item">
                    <Icon :name="IconKeys.Save" custom-class="btns-header-item-icon" />
                    <span>保存</span>
                </el-button>
                <el-button type="primary" class="post-push btns-header-item">
                    <Icon :name="IconKeys.Media" custom-class="btns-header-item-icon" />
                    <span>发布</span>
                </el-button>
            </div>
        </div>

        <el-form class="post-info" label-position="top" label-width="200px" :model="postInfo">
            <el-form-item label="标题">
                <el-input v-model="postInfo.post_title" placeholder="添加标题" />
            </el-form-item>

            <!-- 编辑器 -->
            <div ref="editorContainerRef" class="editor md-layout-fs">
                <EditorPost :editor-state="editorState" />
            </div>

            <el-form-item label="SEO自定义文章标题，留空则为文章标题。">
                <el-input v-model="postInfo.seo_title" />
            </el-form-item>
            <el-form-item label="SEO文章描述，留空则自动截取首段一定字数作为文章描。">
                <el-input v-model="postInfo.seo_description" :rows="5" type="textarea" />
            </el-form-item>
            <el-form-item
                label="SEO文章关键词，多个关键词用英文半角逗号隔开，留空则自动将文章标签做为关键词。"
            >
                <el-input v-model="postInfo.seo_keywords" />
            </el-form-item>
            <el-form-item label="手动设置缩略图,如果没有则随机显示一张图片。">
                <el-input v-model="postInfo.thumbnail" />
            </el-form-item>
            <el-form-item label="销售价格 为空则为免费。">
                <el-input v-model="postInfo.price" />
            </el-form-item>
            <el-form-item label="别名，留空则使用默认ID值。">
                <el-input v-model="postInfo.slug" />
            </el-form-item>
        </el-form>

        <div class="category segmentation-line">
            <h4>文章分类管理</h4>
            <el-checkbox-group v-model="postInfo.categories">
                <el-checkbox
                    class="category-item"
                    v-for="item in categories"
                    :key="item.id"
                    :value="item.id"
                    size="large"
                >
                    {{ item.name }}
                </el-checkbox>
            </el-checkbox-group>
        </div>

        <div class="add-tag segmentation-line">
            <h4>文章标签管理</h4>
            <AddTag
                ref="addTagRef"
                :tag-list-in="postInfo.tags || []"
                @update-tag-list="updateTagListIn"
            />
        </div>

        <div class="segmentation-line segmentation-line-last">
            <h4>付费管理</h4>
            <ul class="switch-group">
                <li class="switch-item" v-for="item in rolePaidList" :key="item.name">
                    <SwitchGroup
                        :switch-item="item"
                        :span-word-count="nameMaxLength"
                        @update-status="updateRolePaidList"
                    />
                </li>
            </ul>
        </div>

        <div class="segmentation-line segmentation-line-last">
            <h4>评论管理</h4>
            <ul class="switch-group">
                <li class="switch-item" v-for="item in commentStatus" :key="item.name">
                    <SwitchGroup
                        :switch-item="item"
                        :span-word-count="nameMaxLength"
                        @update-status="updateCommentStatus"
                    />
                </li>
            </ul>
        </div>
        <div class="btns-footer">
            <el-button type="primary" class="save-post btns-footer-item">
                <Icon :name="IconKeys.Save" custom-class="btns-footer-item-icon" />
                <span>保存</span>
            </el-button>
            <el-button type="primary" class="post-push btns-footer-item">
                <Icon :name="IconKeys.Media" custom-class="btns-footer-item-icon" />
                <span>发布</span>
            </el-button>
        </div>
    </el-container>
</template>
<script lang="ts" setup>
import { reactive, useTemplateRef, onBeforeMount, onMounted, onBeforeUnmount } from "vue"
import { useResizeObserver } from "@vueuse/core"
import { EditorStateManager, EditorPost } from "@/components/editor"
import { IconKeys } from "@/components/common/icons"
import type { SwitchItem, SwitchItemLabel } from "@/components/common/switch-group"
import SwitchGroup from "@/components/common/switch-group"
import { AdminSideMenu } from "@/views/admin/component/aside"
import { type ElContainer } from "element-plus"
import { useUserStore } from "@/stores/user"
import { viewListPostCategoryAPI, type PostCategory } from "@/api/postCategory/view"
import { ResponseCode } from "@/api/responseCode"
import { getRolesList } from "@/utils/permissionRole"
import {
    createEmptyInsertPostRequest,
    insertPostRequestAPI,
    PostStatusCode,
    CommentStatusCode,
    type InsertPostRequest,
} from "@/api/post/insert"

import AddTag from "@/components/common/add-tag"

defineOptions({ name: AdminSideMenu.PostWrite })

const elContainerRef = useTemplateRef<InstanceType<typeof ElContainer> | null>("elContainerRef")
const editorContainerRef = useTemplateRef<HTMLDivElement | null>("editorContainerRef")

// const addTagRef = useTemplateRef <InstanceType<typeof AddTag>>("addTagRef")
const stateManager = new EditorStateManager()
const editorState = stateManager.getState()

const userStore = useUserStore()
userStore.setIsEditing(true)

// 监听编辑器宽度变化
useResizeObserver(editorContainerRef, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect
    stateManager.setEditorWidth(width)
})

const postInfo = reactive(createEmptyInsertPostRequest())

const updateTagListIn = (tagList: string[]) => {
    postInfo.tags = tagList
    if (tagList) {
        console.log("标签", tagList)
    } else {
        console.log("标签", postInfo.tags)
        return rolePaidList
    }
}

// 角色付费管理
const rolePaidList: SwitchItem[] = reactive([])

const rolePaidLabel: SwitchItemLabel = {
    labelTrue: "免费",
    labelFalse: "付费",
}

// 初始化角色付费管理都为付费状态，后续根据后端数据进行修改
const initRolePaidManagement = async () => {
    // 首先从 系统角色列表 获取角色列表
    const { roles: rolesSystem } = await getRolesList()
    // 历遍 rolesSystem 构造 rolePaidList
    rolesSystem.forEach((role) => {
        const switchItem: SwitchItem = {
            name: role.role_name,
            display: role.description,
            status: false,
            label: rolePaidLabel,
        }
        rolePaidList.push(switchItem)
    })

    // TODO 从商城角色列表获取角色列表
}

// 评论状态
const commentStatus: SwitchItem[] = reactive([
    {
        name: "commentStatus",
        display: "评论状态",
        status: true,
        label: {
            labelTrue: "开启",
            labelFalse: "关闭",
        },
    },
])

// 更新角色付费管理
const updateRolePaidList = (item: SwitchItem) => {
    const index = rolePaidList.findIndex((i) => i.name === item.name)
    rolePaidList[index].status = item.status
}

// 更新评论状态
const updateCommentStatus = (item: SwitchItem) => {
    const index = commentStatus.findIndex((i) => i.name === item.name)
    commentStatus[index].status = item.status
}

// 计算 name 最大长度
const nameMaxLength = Math.max(...rolePaidList.map((item) => (item.name ?? "").length))

// 获取分类列表
const categories = reactive<PostCategory[]>([])
const getCategoryList = async () => {
    await viewListPostCategoryAPI().then((res) => {
        if (res.data.code === ResponseCode.PostCategoryViewListSuccess) {
            Object.assign(categories, res.data.data)
        }
    })
}

// 监听页面关闭事件,即用户手动修改ULR或关闭页面
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (userStore.isEditing) {
        // 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/beforeunload_event
        event.preventDefault()
        event.returnValue = ""
    }
}

onBeforeMount(async () => {
    // 生成角色付费管理
    await initRolePaidManagement()
})

onMounted(async () => {
    await getCategoryList()
    // window.addEventListener("beforeunload", handleBeforeUnload)
})

onBeforeUnmount(() => {
    // window.removeEventListener("beforeunload", handleBeforeUnload)
})
</script>

<style scoped lang="scss">
.btns-header,
.btns-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px;
}

.btns-header-left,
.btns-header-right {
    display: flex;
    justify-content: center;
    align-items: center;
}

.btns-footer {
    display: flex;
    justify-content: left;
    align-items: center;
}

.btns-header-item,
.btns-footer-item {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100px;
    height: 38px;
    line-height: 40px;
    font-weight: 700;

    span {
        margin-left: 8px;
    }
}
.btns-header-item-icon,
.btns-footer-item-icon {
    font-size: 20px;
    // fill: var(--text-color);
    fill: red;
}

.editor {
    // margin-left: 16px;
    // width: 98%;
    // height: 100%;
    margin-bottom: 32px;
}

h4 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 16px;
}

.segmentation-line {
    border-top: 1px solid #eaeaea;
    margin: 0 16px;
    padding-top: 16px;
}
.segmentation-line-last {
    margin-top: 16px;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 16px;
}

.category-item {
    margin: 8px 16px;
    min-width: 120px;
}

.switch-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap; // 自动换行
}

.switch-item {
    min-width: 180px;
}

.post-info {
    // margin: 10px 20px;
    padding: 10px 20px;
    width: calc(100% - 40px);
    height: 100%;
    overflow: auto;
    // 相对定位
    position: relative;
}
</style>
