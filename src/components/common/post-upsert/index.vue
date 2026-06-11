<!--
 * FilePath    : blog-client\src\components\common\post-upsert\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章新增和编辑组件
-->
<template>
    <section class="post-upsert-page">
        <NoPermission v-if="showEditNoPermission" :head-title="editNoPermissionHeadTitle" :path-display="editNoPermissionPathDisplay" />

        <el-container v-else ref="elContainerRef" direction="vertical">
            <div class="btns-header">
                <div class="btns-header-left">
                    <el-button type="primary" class="new-post-write btns-header-item" @click="newPostWrite">
                        <j-icon :name="IconKeys.Edit" custom-class="btns-header-item-icon" />
                        <span>{{ postType === PostType.Page ? "新页面" : "新文章" }}</span>
                    </el-button>
                </div>
                <div class="btns-header-right">
                    <span v-if="localDraftStatus.text" class="local-draft-status" :class="`local-draft-status-${localDraftStatus.type}`">{{
                        localDraftStatus.text
                    }}</span>
                    <el-button type="primary" class="save-post btns-header-item" @click="submitForm(formRef as FormInstance)">
                        <j-icon :name="IconKeys.Save" custom-class="btns-header-item-icon" />
                        <span>保存</span>
                    </el-button>
                    <el-button type="primary" class="save-post btns-header-item" @click="viewPost">
                        <j-icon :name="IconKeys.View" custom-class="btns-header-item-icon" />
                        <span>前台查看</span>
                    </el-button>
                </div>
            </div>

            <el-form
                ref="formRef"
                class="post-info"
                label-position="top"
                label-width="200px"
                :model="postInfoForm"
                :rules="rules"
                :scroll-to-error="true"
                :status-icon="true"
                :scroll-into-view-options="{ behavior: 'smooth', block: 'center' }"
            >
                <div class="post-form-shell">
                    <div class="post-form-primary">
                        <el-form-item label="标题" prop="post_title" class="post-form-primary__title">
                            <el-input class="post-title" v-model="postInfoForm.post_title" placeholder="添加标题" />
                        </el-form-item>

                        <!-- TODO 占位让校验生效, EditorPost 放到 el-form-item 宽度会无限增长原因待查 -->
                        <el-form-item prop="post_content"> </el-form-item>

                        <!-- 编辑器 -->
                        <div ref="editorContainerRef" class="editor md-layout-fs post-form-primary__editor">
                            <JEditor
                                ref="editorPostRef"
                                :state-manager="stateManager"
                                :external-toolbar-buttons="editorExternalToolbarButtons"
                                :is-enable-copy-cache="true"
                                :post-id="postInfoForm.id"
                                :is-admin-video="true"
                                :is-paid="isPaid"
                                :pay-strategy="postInfoForm.pay_strategy"
                                :price="(postInfoForm.price * 100).toString()"
                                :video-toc="postInfoForm.video_toc"
                                placeholder-text="请开始创作..."
                                :mdlint-rules="editorMarkdownRules"
                                :theme="theme"
                                :image-upload-handler="postImageUploadHandler"
                                @external-toolbar-btn-clicked="handleEditorExternalToolbarButtonClick"
                                @update-editor-status="updateEditorStatus"
                            />

                            <!-- 创建时间和更新时间 -->
                            <div v-if="postInfoAboutTime.created_at" class="about-time">
                                <span>创建时间：{{ formatTime(postInfoAboutTime.created_at || "") }}</span>
                                <span>更新时间：{{ formatTime(postInfoAboutTime.updated_at || "") }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="post-form-panels">
                        <section v-if="isShowCategory || isShowTag" class="form-panel">
                            <div class="form-panel__header">
                                <h3 class="form-panel__title">基础信息</h3>
                            </div>
                            <div class="form-panel__grid">
                                <el-form-item v-if="isShowCategory" label="分类管理" prop="category_ids" class="form-panel__field form-panel__field--full">
                                    <div class="category">
                                        <el-checkbox-group v-model="postInfoForm.category_ids">
                                            <el-checkbox class="category-item" v-for="item in allCategories" :key="item.id" :value="item.id" size="large">
                                                {{ item.name }}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                </el-form-item>

                                <el-form-item v-if="isShowTag" label="标签管理" prop="tags" class="form-panel__field form-panel__field--full">
                                    <div class="add-tag">
                                        <AddTag ref="addTagRef" :tag-list-in="postInfoForm.tag_names || []" @update-tag-list="updateTagListIn" />
                                    </div>
                                </el-form-item>

                                <el-form-item label="设置文章缩略图。" prop="thumbnail" class="form-panel__field form-panel__field--full">
                                    <div class="thumbnail-row">
                                        <div class="thumbnail-input">
                                            <ImageInput v-model="postInfoForm.thumbnail" clearable />
                                        </div>
                                        <PostUpsertThumbnailTools
                                            v-model:auto-insert="thumbnailAutoInsert"
                                            v-model:insert-index="thumbnailImgIndex"
                                            :has-editor-thumbnail-options="hasEditorThumbnailOptions"
                                            @pick-from-article="openThumbnailPicker"
                                        />
                                    </div>
                                </el-form-item>
                            </div>
                        </section>

                        <div class="more-setting-switch">
                            <SwitchGroup :switch-items="moreSetting" @update-status="updateDefaultStatus" />
                        </div>

                        <section v-show="moreSettingIsShow" class="form-panel">
                            <div class="form-panel__header">
                                <h3 class="form-panel__title">更多设置</h3>
                            </div>
                            <div class="form-panel__grid">
                                <el-form-item
                                    v-show="moreSettingIsShow"
                                    label="评论管理"
                                    prop="comment_status"
                                    class="form-panel__field form-panel__field--switch form-panel__field--full"
                                >
                                    <SwitchGroup :switch-items="commentStatus" @update-status="updateCommentStatus" />
                                </el-form-item>

                                <el-form-item
                                    v-show="moreSettingIsShow"
                                    label="别名，留空则使用默认ID值。"
                                    prop="slug"
                                    class="form-panel__field form-panel__field--full"
                                >
                                    <el-input v-model="postInfoForm.slug" />
                                </el-form-item>

                                <el-form-item label="视频合集" prop="video_toc" v-show="moreSettingIsShow" class="form-panel__field form-panel__field--full">
                                    <div class="video-toc-tree">
                                        <el-button v-if="isShowAddTocBtn" type="primary" @click="addDefaultToc">添加合集</el-button>
                                        <VideoTocTreeEdit :tree-list="postInfoForm.video_toc" @tree-update="handleUpdate" />
                                    </div>
                                </el-form-item>

                                <el-form-item
                                    v-show="moreSettingIsShow"
                                    label="SEO 自定义文章标题，留空则为文章标题。"
                                    prop="seo_title"
                                    class="form-panel__field form-panel__field--full"
                                >
                                    <el-input v-model="postInfoForm.seo_title" />
                                </el-form-item>

                                <el-form-item
                                    v-show="moreSettingIsShow"
                                    label="SEO文章关键词，多个关键词用英文半角逗号隔开，留空则自动将文章标签做为关键词。"
                                    prop="seo_keywords"
                                    class="form-panel__field form-panel__field--full"
                                >
                                    <el-input v-model="postInfoForm.seo_keywords" />
                                </el-form-item>

                                <el-form-item
                                    ref="seoDescriptionRef"
                                    v-show="moreSettingIsShow"
                                    :label="`SEO文章描述，留空则自动截取内容前 ${post_list_summary_truncate} 字。`"
                                    prop="seo_description"
                                    class="form-panel__field form-panel__field--full"
                                >
                                    <div class="seo-description-extract">
                                        <el-button size="small" class="seo-description-extract-btn" @click="seoDescriptionExtract">提取内容前</el-button>
                                        <el-input-number
                                            size="small"
                                            v-model="seoDescriptionExtractWords"
                                            class="seo-description-extract-input"
                                            :min="1"
                                            :max="500"
                                            :step="1"
                                        >
                                            <template #suffix>字</template>
                                        </el-input-number>
                                    </div>
                                    <el-input v-model="postInfoForm.seo_description" :rows="5" type="textarea" />
                                </el-form-item>
                            </div>
                        </section>

                        <section v-show="moreSettingIsShow" class="form-panel">
                            <div class="form-panel__header">
                                <h3 class="form-panel__title">付费与定价</h3>
                            </div>
                            <div class="form-panel__grid">
                                <el-form-item label="付费管理" prop="pay_roles" v-show="moreSettingIsShow" class="form-panel__field form-panel__field--full">
                                    <SwitchGroup :switch-items="rolePaidList" @update-status="updateRolePaidList" />
                                </el-form-item>

                                <el-form-item
                                    label="销售价格，留空或者为 0 则为免费。"
                                    prop="price"
                                    v-show="moreSettingIsShow"
                                    class="form-panel__field form-panel__field--full"
                                >
                                    <el-input-number
                                        class="input-number"
                                        v-model="postInfoForm.price"
                                        :min="0"
                                        :precision="2"
                                        :step="0.01"
                                        placeholder="请输入价格(元)"
                                    >
                                        <template #suffix>
                                            <span>元</span>
                                        </template>
                                    </el-input-number>
                                </el-form-item>

                                <el-form-item label="支付策略" prop="pay_strategy" v-show="moreSettingIsShow" class="form-panel__field form-panel__field--full">
                                    <el-radio-group v-model="postInfoForm.pay_strategy">
                                        <el-radio v-for="item in payStrategyOptions" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                        </section>

                        <section class="form-panel">
                            <div class="form-panel__header">
                                <h3 class="form-panel__title">发布设置</h3>
                            </div>
                            <div class="form-panel__grid">
                                <el-form-item label="文章状态" prop="post_status" class="form-panel__field form-panel__field--full">
                                    <div class="post-status">
                                        <el-radio-group v-model="postInfoForm.post_status">
                                            <el-radio v-for="item in radioOptions()" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
                                        </el-radio-group>
                                        <div
                                            class="post-show-method"
                                            v-show="
                                                (postInfoForm.post_status === PostStatusCode.Future ||
                                                    postInfoForm.post_status === PostStatusCode.Password ||
                                                    postInfoForm.post_status === PostStatusCode.Publish ||
                                                    postInfoForm.post_status === PostStatusCode.Expired) &&
                                                postType === PostType.Post
                                            "
                                        >
                                            <SwitchGroup :switch-items="postShowMethod" @update-status="updatePostShowMethod" />
                                        </div>
                                    </div>
                                </el-form-item>

                                <el-form-item
                                    v-if="postInfoForm.post_status === PostStatusCode.Password"
                                    label="文章密码"
                                    prop="post_password"
                                    with="200"
                                    class="form-panel__field form-panel__field--full"
                                >
                                    <el-input v-model="postInfoForm.post_password" />
                                </el-form-item>

                                <el-form-item label="展示时间" prop="post_push_time" class="form-panel__field form-panel__field--full">
                                    <div class="post-push-time-field">
                                        <el-date-picker
                                            v-model="postInfoForm.post_push_time.Time"
                                            class="post-time-picker"
                                            type="datetime"
                                            placeholder="默认当前时间"
                                            :shortcuts="generateShortcuts('发布')"
                                            :default-time="defaultTime"
                                            @change="markPostPushTimeTouched"
                                        />
                                        <div v-if="isShowFuturePostPushTimeTip" class="post-push-time-tip">
                                            非定时文章的展示时间晚于当前时间, 会影响前台排序和 NEW 标识.
                                        </div>
                                    </div>
                                </el-form-item>

                                <el-form-item
                                    v-show="
                                        postInfoForm.post_status === PostStatusCode.Future ||
                                        postInfoForm.post_status === PostStatusCode.Password ||
                                        postInfoForm.post_status === PostStatusCode.Publish ||
                                        postInfoForm.post_status === PostStatusCode.Expired
                                    "
                                    label="过期时间"
                                    prop="post_expired_time"
                                    class="form-panel__field form-panel__field--full"
                                >
                                    <el-date-picker
                                        v-model="postInfoForm.post_expired_time.Time"
                                        type="datetime"
                                        placeholder="留空则为永不过期"
                                        :shortcuts="generateShortcuts('过期')"
                                        :default-time="defaultTime"
                                    />
                                </el-form-item>
                            </div>
                        </section>
                    </div>
                </div>
            </el-form>

            <div class="btns-footer">
                <el-button type="primary" class="save-post btns-footer-item" @click="submitForm(formRef as FormInstance)">
                    <j-icon :name="IconKeys.Save" custom-class="btns-footer-item-icon" />
                    <span>保存</span>
                </el-button>

                <el-button type="primary" class="save-post btns-footer-item" @click="viewPost">
                    <j-icon :name="IconKeys.View" custom-class="btns-header-item-icon" />
                    <span>前台查看</span>
                </el-button>
            </div>
        </el-container>
    </section>

    <!-- 媒体文件选择弹窗 -->
    <SelectMedia v-if="mediaDialogVisible" v-model="mediaDialogVisible" @insert-data="insertMedia" />
    <PostContentSelectDialog
        v-if="postContentDialogVisible"
        v-model="postContentDialogVisible"
        :initial-post-type="postType"
        @insert-data="insertPostContent"
    />
    <ThumbnailSelectDialog
        v-model:visible="thumbnailPickerVisible"
        :options="editorThumbnailOptions"
        :current-url="postInfoForm.thumbnail"
        @select="handleThumbnailPicked"
    />
</template>
<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { useResizeObserver } from "@vueuse/core"
import { ElMessage } from "element-plus"
import type { FormInstance } from "element-plus"
import { storeToRefs } from "pinia"
import { computed, onBeforeMount, onUnmounted, reactive, ref, toRefs, useTemplateRef, watch } from "vue"
import { useRouter } from "vue-router"

import { Target } from "@/api/common"
import { getPayStrategyOptions, getPostStatusOptions, type InsertPostRequest, type PostResPaginationByAdmin, PostStatusCode, PostType } from "@/api/post/common"
import { type PostCategory, viewListPostCategoryAPI } from "@/api/postCategory/view"
import { ResponseCode } from "@/api/response"
import AddTag from "@/components/common/add-tag/index.vue"
import type { TableData } from "@/components/common/base-table"
import { IconKeys } from "@/components/common/icons"
import ImageInput from "@/components/common/image-input"
import SelectMedia from "@/components/common/media-select/index.vue"
import PostContentSelectDialog from "@/components/common/post-content-select-dialog"
import ThumbnailSelectDialog from "@/components/common/thumbnail-select-dialog"
import SwitchGroup from "@/components/common/switch-group"
import VideoTocTreeEdit from "@/components/common/video-toc-tree-edit"
import { CommandsKey, type EditorExternalToolbarButton, EditorStateManager } from "@/components/editor"
import JEditor from "@/components/editor/index.vue"
import { useEditor } from "@/components/hooks/useEditor"
import { usePostView } from "@/components/hooks/usePostView"
import { useTheme } from "@/theme/useTheme"
import { type ImageUploadHandler, type MarkdownRulesConfig } from "@/pkg/codemirror"
import { autoFixMarkdownText } from "@/pkg/codemirror/extension/mdlint/service"
import { RouteNames } from "@/router"
import { LocalStorageKey } from "@/stores/local"
import { useOptionsStore } from "@/stores/options"
import { PermissionNames } from "@/stores/permissionRole"
import { useUserStore } from "@/stores/user"
import { formatTime } from "@/utils/dateTime"
import { generateShortcuts } from "@/utils/dateTime"
import { extractSeoDescriptionFromMarkdown } from "@/utils/markdownSeo"
import { MessageUtil } from "@/utils/message"
import NoPermission from "@/views/admin/component/main/no-permission"

import { type PostInfoAboutTime, type PostUpsertProps, queryKey, type UpdatePostForm, type UpsertPostForm } from "./types"
import PostUpsertThumbnailTools from "./thumbnail-tools.vue"
import { useAdd } from "./useAdd"
import { useEdit } from "./useEdit"
import { useFormValidation } from "./useFormValidation"
import { createPostImageUploadHandler, getNextPostImageIndex } from "./imageUpload"
import { createPostLinkInsertText } from "./insertPostContent"
import { usePostUpsertLocalDraft } from "./useLocalDraft"
import { usePostVideoToc } from "./usePostVideoToc"
import { useSnapshot } from "./useSnapshot"
import { useSwitchItem } from "./useSwitchItem"
import {
    createEmptyUpsertPostForm,
    createPostThumbnailOptions,
    getPostEditNoPermissionResourceLabel,
    getPostThumbnailUrlByIndex,
    shouldShowFuturePostPushTimeTip,
    syncCreatePostDefaultAuthor,
} from "./utils"

defineOptions({ name: "PostUpsert" })

const { postType, headTitle, routeName } = defineProps<PostUpsertProps>()

// // 事件
// const emit = defineEmits<{
//     (event: "post-id", val: string): void
// }>()

useHead({
    title: headTitle,
})

// 初始化表单数据
const postInfoForm = reactive<UpsertPostForm>(createEmptyUpsertPostForm(postType))
const defaultPostPushTimeMs = ref(postInfoForm.post_push_time.Time?.getTime() ?? null)
const isPostPushTimeTouched = ref(false)
const isShowCategory = computed(() => postType === PostType.Post)
const isShowTag = computed(() => postType === PostType.Post)
const showEditNoPermission = ref(false)
const editNoPermissionPathDisplay = computed(() => getPostEditNoPermissionResourceLabel(postType, postInfoForm.id))
const editNoPermissionHeadTitle = computed(() => `后台管理 - ${editNoPermissionPathDisplay.value}无权限`)

const postInfoAboutTime = reactive<PostInfoAboutTime>({})

/**
 * 判断非定时文章是否选择了未来展示时间.
 * @returns true 表示需要展示轻量提醒.
 */
const isShowFuturePostPushTimeTip = computed(() => {
    return shouldShowFuturePostPushTimeTip(postInfoForm.post_status, postInfoForm.post_push_time.Time)
})

/**
 * 记录展示时间已经由用户手动调整.
 * @returns void.
 */
const markPostPushTimeTouched = () => {
    isPostPushTimeTouched.value = true
}

/**
 * 判断新建文章是否仍在使用初始化时的默认展示时间.
 * @returns true 表示保存时可刷新为提交时刻.
 */
const isUsingInitialDefaultPostPushTime = () => {
    if (postInfoForm.id || isPostPushTimeTouched.value || !postInfoForm.post_push_time.Time || defaultPostPushTimeMs.value === null) {
        return false
    }

    return new Date(postInfoForm.post_push_time.Time).getTime() === defaultPostPushTimeMs.value
}

/**
 * 同步新建文章默认展示时间到提交时刻.
 * @returns true 表示本次提交使用了自动默认值.
 */
const syncDefaultPostPushTimeBeforeCreate = () => {
    if (!isUsingInitialDefaultPostPushTime()) {
        return false
    }

    const postPushTime = new Date()
    postInfoForm.post_push_time = {
        Time: postPushTime,
        Valid: true,
    }
    defaultPostPushTimeMs.value = postPushTime.getTime()
    return true
}

const formRef = useTemplateRef<FormInstance>("formRef")
const editorContainerRef = useTemplateRef<HTMLDivElement | null>("editorContainerRef")
const editorPostRef = useTemplateRef<InstanceType<typeof JEditor>>("editorPostRef")

const stateManager = new EditorStateManager()
useEditor(stateManager)

const postEditorToolbarActionNames = {
    AddMedia: "post-upsert-add-media",
    InsertPostContent: "post-upsert-insert-post-content",
} as const

const editorState = stateManager.getState()
const mediaDialogVisible = ref(false)
const postContentDialogVisible = ref(false)
const thumbnailPickerVisible = ref(false)
const editorThumbnailOptions = computed(() => createPostThumbnailOptions(editorState.imgUrls))
const hasEditorThumbnailOptions = computed(() => editorThumbnailOptions.value.length > 0)
const insertPostContentButtonText = computed(() => (postType === PostType.Page ? "页面引用" : "文章引用"))
const editorExternalToolbarButtons = computed<EditorExternalToolbarButton[]>(() => {
    return [
        {
            name: postEditorToolbarActionNames.AddMedia,
            display: "添加媒体",
            icon: IconKeys.Media,
            insertAfter: CommandsKey.Fullscreen,
        },
        {
            name: postEditorToolbarActionNames.InsertPostContent,
            display: insertPostContentButtonText.value,
            icon: IconKeys.Article,
            insertAfter: CommandsKey.Fullscreen,
        },
    ]
})

const thumbnailAutoInsert = ref(localStorage.getItem(LocalStorageKey.ThumbnailAutoInsertEnable) === "true")
const thumbnailImgIndex = ref(Number(localStorage.getItem(LocalStorageKey.ThumbnailAutoInsertIndex)) || 1)

watch(thumbnailAutoInsert, (val) => {
    localStorage.setItem(LocalStorageKey.ThumbnailAutoInsertEnable, String(val))
})

watch(thumbnailImgIndex, (val) => {
    localStorage.setItem(LocalStorageKey.ThumbnailAutoInsertIndex, String(val))
})

/**
 * 打开文章内图片选择弹窗.
 * @returns void.
 */
const openThumbnailPicker = () => {
    if (!hasEditorThumbnailOptions.value) {
        return
    }

    thumbnailPickerVisible.value = true
}

/**
 * 根据用户点选结果更新缩略图.
 * @param selectedUrl 用户在弹窗中选中的图片 URL.
 * @returns void.
 */
const handleThumbnailPicked = (selectedUrl: string) => {
    insertThumbnailFromEditor(selectedUrl)
}

/**
 * 将文章内图片设置为当前缩略图.
 * @param selectedUrl 手动选择的图片 URL, 不传时按默认插入序号取图.
 * @returns void.
 */
const insertThumbnailFromEditor = (selectedUrl?: string) => {
    const thumbnailUrl = selectedUrl || getPostThumbnailUrlByIndex(editorState.imgUrls, thumbnailImgIndex.value)

    if (!thumbnailUrl) {
        ElMessage.warning(`当前文章只有 ${editorThumbnailOptions.value.length} 张图片，无法插入第 ${thumbnailImgIndex.value} 张`)
        return
    }

    postInfoForm.thumbnail = thumbnailUrl
}

const router = useRouter()

const userStore = useUserStore()
const optionsStore = useOptionsStore()

// 文章列表摘要截断
const { post_list_summary_truncate } = storeToRefs(optionsStore)

const seoDescriptionExtractWords = ref(post_list_summary_truncate.value)
const payStrategyOptions = getPayStrategyOptions()

const isPaid = ref(false)
const postContentError = ref("")
const editorMarkdownRules: MarkdownRulesConfig = {
    rule002: false,
    rule003: false,
}
const postImageUploadHandler: ImageUploadHandler = createPostImageUploadHandler(
    () => postInfoForm.post_title,
    () => getNextPostImageIndex(editorState.imgUrls),
)

const { theme } = useTheme()

// 监听编辑器宽度变化
const { stop: stopResizeObserver } = useResizeObserver(editorContainerRef, (entries) => {
    const entry = entries[0]
    if (!entry) return
    const { width } = entry.contentRect
    stateManager.setEditorWidth(width.toString())
})

// 所有分类列表
const allCategories = ref<PostCategory[]>([])

const showWarningCategory = () => {
    if (allCategories.value.length === 0) {
        MessageUtil.warning("请添加文章分类后在进入文章编辑")
    }
}

const getCategoryList = async () => {
    await viewListPostCategoryAPI().then((res) => {
        if (res.data.code === ResponseCode.PostCategoryViewListSuccess) {
            allCategories.value = res.data.data
            showWarningCategory()
        }
    })
}

// 更新标签列表
const updateTagListIn = (tagList: string[]) => {
    postInfoForm.tag_names = tagList
}

// 开关hooks
const {
    moreSettingIsShow,
    updateDefaultStatus,
    moreSetting,
    unfoldDefaultStatus,
    rolePaidList,
    initRolePaidManagement,
    updateRolePaidList,
    commentStatus,
    updateCommentStatus,
    postShowMethod,
    updatePostShowMethod,
} = useSwitchItem(postInfoForm)

// 视频目录
const { handleUpdate, isShowAddTocBtn, addDefaultToc } = usePostVideoToc(postInfoForm)

/**
 * seoDescriptionExtract 从 Markdown 源文本中提取 SEO 描述, 跳过代码块等不应进入摘要的内容.
 * @returns void.
 */
const seoDescriptionExtract = () => {
    postInfoForm.seo_description = extractSeoDescriptionFromMarkdown(editorState.editorContent || "", seoDescriptionExtractWords.value)
}

// 监控文章标签变化,更新 seo 关键词
watch(
    () => postInfoForm.tag_names,
    (newVal, oldVal) => {
        // 如果 newVal oldVal 为 undefined, 为了后续不报错, 设置为空数组
        newVal = newVal || []
        oldVal = oldVal || []

        // 如果 seo 关键词为空，则更新 seo 关键词
        if (!postInfoForm.seo_keywords && newVal) {
            postInfoForm.seo_keywords = newVal.join(",")
        }

        // 如果末尾有逗号，则去掉
        if (postInfoForm.seo_keywords.endsWith(",")) {
            postInfoForm.seo_keywords = postInfoForm.seo_keywords.slice(0, -1)
        }

        // 将当前 postInfoForm.seo_keywords 使用逗号分割转为set
        const keywordSet = new Set(postInfoForm.seo_keywords.split(","))

        // 需要增加的标签
        const addVal = newVal?.filter((i) => !oldVal.includes(i))
        // 先添加
        addVal?.forEach((i) => {
            keywordSet.add(i)
        })

        // 需要移除的标签
        const removeVal = oldVal?.filter((i) => !newVal.includes(i))
        // 再移除
        removeVal?.forEach((i) => {
            keywordSet.delete(i)
        })

        // 更新 seo 关键词
        postInfoForm.seo_keywords = Array.from(keywordSet).join(",")
    },
)

// 更新 slug
watch(
    () => postInfoForm.id,
    (newVal) => {
        // 如果 slug 为空，且 id 不为空，则更新 slug
        if (!postInfoForm.slug && newVal) {
            postInfoForm.slug = newVal
        }
    },
)

// 更新 slug
watch(
    () => postInfoForm.post_status,
    (newVal) => {
        // 如果文章状态不为密码，则清空文章密码
        if (newVal !== PostStatusCode.Password) {
            postInfoForm.post_password = ""
        }

        // 如果文章状态不为过期，则清空文章过期时间
        if (newVal !== PostStatusCode.Expired) {
            postInfoForm.post_expired_time = {
                Time: null,
                Valid: false,
            }
        }

        // 如果文章状态不为发布，则默认文章显示方式为关闭
        if (newVal !== PostStatusCode.Publish) {
            postShowMethod.forEach((item) => {
                item.status = false
            })
            postInfoForm.is_pinned = 0
            postInfoForm.is_recommended = 0
        }
    },
)

const radioOptions = () => {
    const Options = getPostStatusOptions()
    // 判断是否有编辑文章的权限
    if (!userStore.hasPermission(PermissionNames.EditPost)) {
        // 只保留草稿状态
        return Options.filter((item) => item.value === PostStatusCode.Draft)
    }
    return Options
}

// 默认时间为当前日期
const defaultTime = new Date()

// hooks
const { rules } = useFormValidation({
    form: toRefs(postInfoForm),
    postContentError,
})

// 需要更新的数据
const dataOfUpdate: UpdatePostForm = reactive({}) as UpdatePostForm

const {
    getValueFromQuery,
    getDataOnBeforeMount,
    submitForm: editSubmitForm,
} = useEdit(
    postInfoForm,
    rolePaidList,
    commentStatus,
    queryKey,
    stateManager,
    dataOfUpdate,
    postInfoAboutTime,
    postShowMethod,
    unfoldDefaultStatus,
    isPaid,
    router,
    postType,
)

const { submitForm: addSubmitForm } = useAdd(postInfoForm, queryKey, postInfoAboutTime, router, routeName, unfoldDefaultStatus, isPaid)

// 数据快照
const { isUpdate, updatedFields, updateSnapshot, updateStatus } = useSnapshot(postInfoForm)

const {
    localDraftStatus,
    isApplyingLocalDraft,
    clearPostUpsertLocalDraftAfterRemoteSaved,
    resolvePostUpsertLocalDraftOnMount,
    startPostUpsertLocalDraftRealtimeSave,
    stopPostUpsertLocalDraftRealtimeSave,
} = usePostUpsertLocalDraft({
    postType,
    postInfoForm,
    stateManager,
    editorPostRef,
    formRef,
    commentStatus,
    postShowMethod,
    rolePaidList,
    isUpdate,
    updateStatus,
})

// 监控 category_ids 变化,手动执行校验
watch(
    () => postInfoForm.category_ids,
    () => {
        if (isApplyingLocalDraft.value) return
        if (!isShowCategory.value) return
        formRef.value?.validateField("category_ids")
    },
)

/**
 * 同步编辑器内容到表单, 并在用户继续编辑时清空上一次 lint 阻断提示.
 * @returns void.
 */
const updateEditorStatus = () => {
    // 将编辑器内容赋值给 post_content
    postInfoForm.post_content = editorState.editorContent
    postContentError.value = ""
    formRef.value?.clearValidate("post_content")
    syncCreatePostDefaultAuthor(postInfoForm, postType, userStore.data.user.id)
}

/**
 * 汇总 lint 诊断信息, 用于在表单校验中提示用户未自动修复的问题.
 * @param diagnostics lint 诊断列表.
 * @returns 适合表单错误展示的简短提示文本.
 */
const formatLintErrorMessage = (diagnostics: { message: string }[]) => {
    const uniqueMessages = Array.from(new Set(diagnostics.map((item) => item.message))).slice(0, 3)
    const extraCount = diagnostics.length - uniqueMessages.length
    const suffix = extraCount > 0 ? ` 等 ${diagnostics.length} 个问题` : ""
    return `Markdown lint 未通过：${uniqueMessages.join("；")}${suffix}`
}

/**
 * 保存前执行 Markdown lint 自动修复, 剩余问题会挂到 post_content 表单校验中并阻止提交.
 * @param formEl 文章表单实例.
 * @returns 是否通过保存前的编辑器校验.
 */
const validateEditorBeforeSubmit = async (formEl: FormInstance | undefined) => {
    updateEditorStatus()
    postContentError.value = ""

    const result = autoFixMarkdownText(editorState.editorContent, {
        rules: editorMarkdownRules,
    })

    if (result.changed) {
        editorPostRef.value?.replaceContent(result.fixedText)
        postInfoForm.post_content = result.fixedText
    }

    if (result.diagnostics.length === 0) {
        formEl?.clearValidate("post_content")
        return true
    }

    postContentError.value = formatLintErrorMessage(result.diagnostics)

    try {
        await formEl?.validateField("post_content")
    } catch {
        // 表单错误提示由 Element Plus 展示, 这里无需额外处理.
    }

    return false
}

const submitForm = async (formEl: FormInstance | undefined) => {
    const isEditorValid = await validateEditorBeforeSubmit(formEl)
    if (!isEditorValid) {
        return
    }

    // 保存时自动插入缩略图，插入后立即同步快照比对状态，避免 watch 异步导致 isUpdate 未更新
    if (thumbnailAutoInsert.value) {
        insertThumbnailFromEditor()
        updateStatus()
    }

    // 判断 seo 标题是否为空
    if (!postInfoForm.seo_title) {
        // 如果 seo 标题为空，则使用文章标题
        postInfoForm.seo_title = postInfoForm.post_title
    }

    // 判断 seo 描述是否为空
    if (!postInfoForm.seo_description) {
        // 如果 seo 描述为空，则自动截取内容前 post_list_summary_truncate 字
        seoDescriptionExtract()
    }

    // 判断走新增还是更新
    const draftPostIdBeforeSubmit = postInfoForm.id || ""
    if (!postInfoForm.id) {
        const isAutoPostPushTime = syncDefaultPostPushTimeBeforeCreate()
        const isFinish = await addSubmitForm(formEl)
        // 如果新增成功，将快照更新
        if (isFinish) {
            if (isAutoPostPushTime && postInfoAboutTime.created_at) {
                postInfoForm.post_push_time = {
                    Time: new Date(postInfoAboutTime.created_at),
                    Valid: true,
                }
            }
            await updateSnapshot()
            clearPostUpsertLocalDraftAfterRemoteSaved(draftPostIdBeforeSubmit)
        }
    } else {
        // 判断是否有更新
        if (!isUpdate.value) {
            MessageUtil.warning("没有任何修改")
            return
        }

        // 先清空 dataOfUpdate 再将更新字段合并到 dataOfUpdate
        Object.keys(dataOfUpdate).forEach((key) => {
            delete dataOfUpdate[key as keyof UpsertPostForm]
        })
        Object.assign(dataOfUpdate, updatedFields)
        dataOfUpdate.post_push_time = postInfoForm.post_push_time

        // 需要更新的字段
        dataOfUpdate.update_fields = Object.keys(updatedFields) as (keyof InsertPostRequest)[]
        dataOfUpdate.id = postInfoForm.id

        const isFinish = await editSubmitForm(formEl)
        // 如果更新成功，将快照更新
        if (isFinish) {
            await updateSnapshot()
            clearPostUpsertLocalDraftAfterRemoteSaved(draftPostIdBeforeSubmit)
        }
    }
}

/**
 * handleEditorExternalToolbarButtonClick 处理编辑器工具栏内的业务按钮动作。
 * 文章编辑页仅在此处注册附加能力, 以避免影响编辑器在其他场景的复用。
 * @param name - 当前点击的外部工具栏按钮标识。
 * @returns 无返回值。
 */
const handleEditorExternalToolbarButtonClick = (name: string): void => {
    if (name === postEditorToolbarActionNames.AddMedia) {
        mediaDialogVisible.value = true
        return
    }

    if (name === postEditorToolbarActionNames.InsertPostContent) {
        postContentDialogVisible.value = true
        return
    }
}

/**
 * insertMedia 将媒体选择器中的内容插入编辑器.
 * 图片会统一插入为空方括号的 Markdown 语法, 以保持与拖拽和截图上传行为一致.
 * @param data 媒体选择器返回的数据列表.
 * @returns void.
 */
const insertMedia = (data: TableData[]) => {
    // 不满足条件直接返回
    if (!editorPostRef.value || data.length === 0) return

    // 遍历数据插入到编辑器
    for (const item of data) {
        // 判断 file_type 是否在 item 中, 即为 Media 类型
        if (!("file_type" in item)) return
        let content = ""

        // 视频 hls
        if (item.file_type.startsWith("video") && item.is_generate_hls) {
            const videoID = item.file_name.split(".")[0]
            content = `<video-player video-type="hls" id="${videoID}"></video-player>\n`
        }

        // 视频 非 hls
        if (item.file_type.startsWith("video") && !item.is_generate_hls) {
            const src = item.url_belong + item.path
            const type = item.file_type.split("/")[1]
            content = `<video-player video-type="${type}" src="${src}"></video-player>\n`
        }

        // 图片
        if (item.file_type.startsWith("image") && item.img?.url) {
            content = `![](${item.img?.url})\n`
        }

        // TODO: 其他类型

        editorPostRef.value?.codemirror?.insertContent(content)
    }

    // 关闭弹窗
    mediaDialogVisible.value = false
}

/**
 * insertPostContent 将选择的文章或页面链接插入编辑器当前光标位置.
 * @param rows 后台文章或页面列表选中的行.
 * @returns void.
 */
const insertPostContent = (rows: PostResPaginationByAdmin[]) => {
    if (!editorPostRef.value || rows.length === 0) return

    const content = createPostLinkInsertText(rows)
    if (!content) {
        MessageUtil.warning("选中的文章或页面无法生成链接")
        return
    }

    editorPostRef.value.codemirror?.insertContent(content)
    postContentDialogVisible.value = false
}

// 前台查看文章/页面
const { handleViewPost } = usePostView()
const viewPost = () => {
    if (!postInfoForm.id) {
        MessageUtil.warning("请先保存文章")
        return
    }

    handleViewPost(postInfoForm.id, Target.Blank, { postType, slug: postInfoForm.slug })
}

// 新文章/新页面
const newPostWrite = async () => {
    // 先跳转到列表再跳转到编辑页面, 以便重置组件状态
    const allRouteName = postType === PostType.Page ? RouteNames.PageAll : RouteNames.PostAll
    await router.push({ name: allRouteName })
    await router.push({ name: routeName })
}

onUnmounted(() => {
    stopPostUpsertLocalDraftRealtimeSave()
    stopResizeObserver()
})

onBeforeMount(async () => {
    // 生成角色付费管理
    await initRolePaidManagement()
    await getCategoryList()
    await getValueFromQuery()
    if (postInfoForm.id) {
        showEditNoPermission.value = await getDataOnBeforeMount()
    }
    syncCreatePostDefaultAuthor(postInfoForm, postType, userStore.data.user.id)
    await updateSnapshot()
    if (!showEditNoPermission.value) {
        await resolvePostUpsertLocalDraftOnMount()
        startPostUpsertLocalDraftRealtimeSave()
    }
})
</script>

<style scoped lang="scss">
.post-upsert-page {
    padding-bottom: 24px;
}

.post-title {
    font-size: 24px;
    font-weight: 700;
    height: 40px;
}

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

.btns-header-right {
    gap: 8px;
}

.btns-header {
    margin-bottom: 0;
}

.local-draft-status {
    max-width: 240px;
    overflow: hidden;
    color: var(--jpz-text-color-secondary);
    font-size: 13px;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.local-draft-status-saved {
    color: var(--jpz-color-success);
}

.local-draft-status-error,
.local-draft-status-conflict {
    color: var(--jpz-color-danger);
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
    fill: var(--jpz-color-secondary);
}

.editor {
    margin-bottom: 32px;
}

.about-time {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    font-size: 14px;
    color: var(--jpz-text-color-disabled);
}

.more-setting-switch {
    display: flex;
    align-items: center;
    // margin: 16px 0;
    font-size: 14px;
    color: var(--jpz-text-color-primary);
}

.seo-description-extract {
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    .seo-description-extract-btn {
        margin-right: 4px;
    }
}

h4 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 16px;
}

.category-item {
    margin: 8px 14px 8px 0;
    min-width: 120px;
}

.post-info {
    padding: 10px 20px;
    width: calc(100% - 40px);
    height: 100%;
    overflow: auto;
    position: relative;
}

.post-form-shell {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.post-form-primary,
.form-panel {
    border: none;
    border-radius: 4px;
    background: linear-gradient(180deg, color-mix(in srgb, var(--jpz-bg-color) 97%, white) 0%, var(--jpz-bg-color) 100%);
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.04);
}

.post-form-primary {
    border: none;
    background: transparent;
    box-shadow: none;
    padding: 0;
}

.post-form-primary__title {
    margin-bottom: 0;
}

.post-form-primary__editor {
    margin-bottom: 0;
}

.post-form-panels {
    display: grid;
    gap: 24px;
}

.form-panel {
    padding: 24px;
}

.form-panel__header {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 24px;
}

.form-panel__title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--jpz-text-color-primary);
}

.form-panel__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    column-gap: 18px;
}

.form-panel__field {
    min-width: 0;
}

.form-panel__field--full {
    grid-column: 1 / -1;
}

.switch-field-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
}

.input-number {
    width: 100%;
}

.post-push-time-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.post-time-picker {
    width: 220px;
}

.post-push-time-tip {
    max-width: 520px;
    color: var(--jpz-color-warning);
    font-size: 12px;
    line-height: 18px;
}

.video-toc-tree {
    width: 100%;
}

.thumbnail-row {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 18px;
    width: 100%;
}

.thumbnail-input {
    flex: 1 1 0;
    min-width: 0;
}

.post-status {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.post-show-method {
    padding: 14px 16px;
    border-radius: 4px;
    border: none;
    background: color-mix(in srgb, var(--jpz-color-primary) 4%, transparent);
}

:deep(.form-panel__grid > .el-form-item) {
    margin-bottom: 24px;
}

:deep(.post-form-primary > .el-form-item:last-of-type),
:deep(.form-panel__grid > .el-form-item:last-child) {
    margin-bottom: 0;
}

:deep(.form-panel__field--switch .el-form-item__content) {
    width: auto;
}

:deep(.form-panel__field--switch.el-form-item) {
    display: flex;
    align-items: center;
    gap: 12px;
}

:deep(.form-panel__field--switch.el-form-item .el-form-item__label) {
    padding-bottom: 0;
    margin-bottom: 0;
    width: auto;
}

:deep(.form-panel__field--switch.el-form-item .el-form-item__content) {
    min-height: auto;
}

:deep(.form-panel__field .el-form-item__label) {
    font-weight: 400;
    color: var(--jpz-text-color-primary);
}

@media (max-width: 1024px) {
    .form-panel__header,
    .switch-field-row,
    .about-time,
    .thumbnail-row,
    .btns-header,
    .btns-footer {
        flex-direction: column;
        align-items: flex-start;
    }

    .switch-field-row {
        align-items: center;
    }

    :deep(.form-panel__field--switch.el-form-item) {
        display: block;
    }
}
</style>
