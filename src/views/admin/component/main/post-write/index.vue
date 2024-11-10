<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 10:04:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-10 19:44:10
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
            </div>
        </div>

        <el-form
            class="post-info"
            label-position="top"
            label-width="200px"
            :model="postInfo"
            :rules="rules"
        >
            <el-form-item label="标题" prop="post_title">
                <el-input v-model="postInfo.post_title" placeholder="添加标题" />
            </el-form-item>

            <!-- 编辑器 -->
            <div ref="editorContainerRef" class="editor md-layout-fs">
                <EditorPost :editor-state="editorState" />
            </div>

            <ul class="switch-group seo-status">
                <li class="switch-item" v-for="item in seoStatus" :key="item.name">
                    <SwitchGroup :switch-item="item" @update-status="updateSeoStatus" />
                </li>
            </ul>

            <el-form-item
                v-if="seoIsShow"
                label="SEO自定义文章标题，留空则为文章标题。"
                prop="seo_title"
            >
                <el-input v-model="postInfo.seo_title" />
            </el-form-item>

            <el-form-item
                v-if="seoIsShow"
                label="SEO文章描述，留空则自动截取首段一定字数作为文章描。"
                prop="seo_description"
            >
                <el-input v-model="postInfo.seo_description" :rows="5" type="textarea" />
            </el-form-item>

            <el-form-item
                v-if="seoIsShow"
                label="SEO文章关键词，多个关键词用英文半角逗号隔开，留空则自动将文章标签做为关键词。"
                prop="seo_keywords"
            >
                <el-input v-model="postInfo.seo_keywords" />
            </el-form-item>

            <el-form-item label="手动设置缩略图,如果没有则随机显示一张图片。" prop="thumbnail">
                <el-input v-model="postInfo.thumbnail" />
            </el-form-item>

            <el-form-item label="销售价格 为空则为免费。" prop="price">
                <el-input v-model="postInfo.price" />
            </el-form-item>

            <el-form-item label="别名，留空则使用默认ID值。" prop="slug">
                <el-input v-model="postInfo.slug" />
            </el-form-item>

            <el-form-item label="文章分类管理" prop="categories">
                <div class="category">
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
            </el-form-item>

            <el-form-item label="文章标签管理" prop="tags">
                <div class="add-tag">
                    <AddTag
                        ref="addTagRef"
                        :tag-list-in="postInfo.tags || []"
                        @update-tag-list="updateTagListIn"
                    />
                </div>
            </el-form-item>

            <el-form-item label="付费管理" prop="pay_roles">
                <ul class="switch-group">
                    <li class="switch-item" v-for="item in rolePaidList" :key="item.name">
                        <SwitchGroup
                            :switch-item="item"
                            :span-word-count="nameMaxLength"
                            @update-status="updateRolePaidList"
                        />
                    </li>
                </ul>
            </el-form-item>

            <el-form-item label="评论管理" prop="comment_status">
                <ul class="switch-group">
                    <li class="switch-item" v-for="item in commentStatus" :key="item.name">
                        <SwitchGroup :switch-item="item" @update-status="updateCommentStatus" />
                    </li>
                </ul>
            </el-form-item>

            <el-form-item label="文章状态" prop="post_status">
                <el-radio-group v-model="postInfo.post_status">
                    <el-radio
                        v-for="item in radioOptions()"
                        :key="item.value"
                        :value="item.value"
                        >{{ item.label }}</el-radio
                    >
                </el-radio-group>
            </el-form-item>

            <el-form-item
                v-if="postInfo.post_status === PostStatusCode.Password"
                label="文章密码"
                prop="post_password"
                with="200"
            >
                <el-input v-model="postInfo.post_password" />
            </el-form-item>

            <el-form-item
                v-if="postInfo.post_status === PostStatusCode.Future"
                label="文章发布时间"
                prop="post_push_time"
            >
                <el-date-picker
                    v-model="postInfo.post_push_time.time"
                    type="datetime"
                    placeholder="留空则为立刻发布"
                    :shortcuts="generateShortcuts('发布')"
                    :default-time="defaultTime"
                />
            </el-form-item>

            <el-form-item label="文章过期时间" prop="post_expired_time">
                <el-date-picker
                    v-model="postInfo.post_expired_time.time"
                    type="datetime"
                    placeholder="留空则为永不过期"
                    :shortcuts="generateShortcuts('过期')"
                    :default-time="defaultTime"
                />
            </el-form-item>
        </el-form>

        <div class="btns-footer">
            <el-button type="primary" class="save-post btns-footer-item">
                <Icon :name="IconKeys.Save" custom-class="btns-footer-item-icon" />
                <span>保存</span>
            </el-button>
        </div>
    </el-container>
</template>
<script lang="ts" setup>
import {
    ref,
    reactive,
    useTemplateRef,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    toRefs,
} from "vue"
import { useResizeObserver } from "@vueuse/core"
import { EditorStateManager, EditorPost } from "@/components/editor"
import { IconKeys } from "@/components/common/icons"
import type { SwitchItem, SwitchItemLabel } from "@/components/common/switch-group"
import SwitchGroup from "@/components/common/switch-group"
import { AdminSideMenu } from "@/views/admin/component/aside"
import { type ElContainer } from "element-plus"
import { useUserStore } from "@/stores/user"
import { viewListPostCategoryAPI, type PostCategory } from "@/api/postCategory/view"
import { ResponseCode, LocalStorageKey } from "@/api/responseCode"
import { getRolesList } from "@/utils/permissionRole"
import {
    createEmptyInsertPostRequest,
    insertPostRequestAPI,
    PostStatusCode,
    CommentStatusCode,
    gegPostStatusOptions,
    type InsertPostRequest,
} from "@/api/post/insert"
import { useFormValidation } from "./hooks"
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { PermissionNames } from "@/utils/permissionRole"

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
const rolePaidList: SwitchItem[] = []

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
const commentStatus: SwitchItem[] = [
    {
        name: "commentStatus",
        display: "评论状态",
        status: true,
        label: {
            labelTrue: "开启",
            labelFalse: "关闭",
        },
    },
]

// SEO状态
const seoIsShow = ref(localStorage.getItem(LocalStorageKey.IsShowSeoAtPostWrite) == "true")
const seoStatus: SwitchItem[] = [
    {
        name: "seoStatus",
        display: "SEO状态",
        status: localStorage.getItem(LocalStorageKey.IsShowSeoAtPostWrite) == "true",
        label: {
            labelTrue: "开启",
            labelFalse: "关闭",
        },
    },
]

// 更新SEO状态
const updateSeoStatus = (item: SwitchItem) => {
    seoIsShow.value = item.status
    localStorage.setItem(LocalStorageKey.IsShowSeoAtPostWrite, item.status.toString())
}

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

const radioOptions = () => {
    const Options = gegPostStatusOptions()
    // 判断是否有编辑文章的权限
    if (!userStore.hasPermission(PermissionNames.EditPost)) {
        // 只保留草稿状态
        return Options.filter((item) => item.value === PostStatusCode.Draft)
    }
    return Options
}

// 监听页面关闭事件,即用户手动修改ULR或关闭页面
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (userStore.isEditing) {
        // 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/beforeunload_event
        event.preventDefault()
        event.returnValue = ""
    }
}

// 时间快捷选项
const generateShortcuts = (useDisplay: string) => {
    return [
        {
            text: `5分钟后${useDisplay}`,
            value: () => {
                const date = new Date()
                date.setMinutes(date.getMinutes() + 5)
                return date
            },
        },
        {
            text: `1小时后${useDisplay}`,
            value: () => {
                const date = new Date()
                date.setHours(date.getHours() + 1)
                return date
            },
        },
        {
            text: `1天后${useDisplay}`,
            value: () => {
                const date = new Date()
                date.setDate(date.getDate() + 1)
                return date
            },
        },
        {
            text: `7天后${useDisplay}`,
            value: () => {
                const date = new Date()
                date.setDate(date.getDate() + 7)
                return date
            },
        },
        {
            text: `30天后${useDisplay}`,
            value: () => {
                const date = new Date()
                date.setDate(date.getDate() + 30)
                return date
            },
        },
    ]
}

// 默认时间为当前日期
const defaultTime = new Date()

// hooks
const {
    checkPostTitleValidator,
    checkPostPasswordValidator,
    checkSeoDescriptionValidator,
    checkSeoKeywordsValidator,
    checkThumbnailValidator,
    checkPriceValidator,
    checkPostSlugValidator,
    checkPostSlugExcludingIDValidator,
    checkCategoriesValidator,
    checkPostPushTimeValidator,
    checkPostExpiredTimeValidator,
} = useFormValidation({
    form: toRefs(postInfo),
})

/**
 * @description: 表单校验规则
 * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<InsertPostRequest>>({
    post_title: [
        { required: true, message: "标题不能为空", trigger: "blur" },
        { validator: checkPostTitleValidator, trigger: "blur" },
    ],
    post_password: [
        { required: false, message: "文章密码,留空则为不设置密码。", trigger: "blur" },
        { validator: checkPostPasswordValidator, trigger: "blur" },
    ],
    seo_title: [
        { required: false, message: "SEO自定义文章标题，留空则为文章标题。", trigger: "blur" },
    ],
    seo_description: [
        {
            required: false,
            message: "SEO文章描述，留空则自动截取首段一定字数作为文章描。",
            trigger: "blur",
        },
        { validator: checkSeoDescriptionValidator, trigger: "blur" },
    ],
    seo_keywords: [
        {
            required: false,
            message:
                "SEO文章关键词，多个关键词用英文半角逗号隔开，留空则自动将文章标签做为关键词。",
            trigger: "blur",
        },
        { validator: checkSeoKeywordsValidator, trigger: "blur" },
    ],
    thumbnail: [
        {
            required: false,
            message: "手动设置缩略图,如果没有则随机显示一张图片。",
            trigger: "blur",
        },
        { validator: checkThumbnailValidator, trigger: "blur" },
    ],
    price: [
        { required: false, message: "销售价格 为空则为免费。", trigger: "blur" },
        { validator: checkPriceValidator, trigger: "blur" },
    ],
    slug: [
        { required: false, message: "别名，留空则使用默认ID值。", trigger: "blur" },
        { validator: checkPostSlugValidator, trigger: "blur" },
        { validator: checkPostSlugExcludingIDValidator, trigger: "blur" },
    ],
    categories: [
        { required: true, message: "文章分类管理", trigger: "blur" },
        { validator: checkCategoriesValidator, trigger: "blur" },
    ],
    tags: [{ required: false, message: "文章标签管理", trigger: "blur" }],
    pay_roles: [{ required: false, message: "付费管理", trigger: "blur" }],
    comment_status: [{ required: false, message: "评论管理", trigger: "blur" }],
    post_push_time: [
        { required: false, message: "文章发布时间", trigger: "blur" },
        { validator: checkPostPushTimeValidator, trigger: "blur" },
    ],
    post_expired_time: [
        { required: false, message: "文章过期时间", trigger: "blur" },
        { validator: checkPostExpiredTimeValidator, trigger: "blur" },
    ],
})

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
    margin-bottom: 32px;
}

h4 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 16px;
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
    position: relative;
}
</style>
