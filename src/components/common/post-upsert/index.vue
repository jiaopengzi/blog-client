<!--
 * FilePath    : blog-client\src\components\common\post-upsert\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章新增和编辑组件
-->

<template>
    <section>
        <el-container ref="elContainerRef" direction="vertical">
            <div class="btns-header">
                <div class="btns-header-left">
                    <el-button type="primary" class="add-media btns-header-item" @click="mediaDialogVisible = true">
                        <j-icon :name="IconKeys.Media" custom-class="btns-header-item-icon" />
                        <span>添加媒体</span>
                    </el-button>
                </div>
                <div class="btns-header-right">
                    <el-button type="primary" class="save-post btns-header-item" @click="submitForm(formRef as FormInstance)">
                        <j-icon :name="IconKeys.Save" custom-class="btns-header-item-icon" />
                        <span>保存</span>
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
                <el-form-item label="标题" prop="post_title">
                    <el-input class="post-title" v-model="postInfoForm.post_title" placeholder="添加标题" />
                </el-form-item>

                <!-- TODO 占位让校验生效, EditorPost 放到 el-form-item 宽度会无限增长原因待查 -->
                <el-form-item prop="post_content"> </el-form-item>
                <!-- 编辑器 -->
                <div ref="editorContainerRef" class="editor md-layout-fs">
                    <JEditor ref="editorPostRef" :state-manager="stateManager" @update-editor-status="updateEditorStatus" />

                    <!-- 创建时间和更新时间 -->
                    <div v-if="postInfoAboutTime.created_at" class="about-time">
                        <span>创建时间：{{ formatTime(postInfoAboutTime.created_at || "") }}</span>
                        <span>更新时间：{{ formatTime(postInfoAboutTime.updated_at || "") }}</span>
                    </div>
                </div>

                <div class="seo-switch">
                    <SwitchGroup :switch-items="defaultStatus" @update-status="updateDefaultStatus" />
                </div>

                <el-form-item v-show="defaultStatusIsShow" label="SEO自定义文章标题，留空则为文章标题。" prop="seo_title">
                    <el-input v-model="postInfoForm.seo_title" />
                </el-form-item>

                <el-form-item
                    ref="seoDescriptionRef"
                    v-show="defaultStatusIsShow"
                    label="SEO文章描述，留空则自动截取首段一定字数作为文章描。"
                    prop="seo_description"
                >
                    <el-input v-model="postInfoForm.seo_description" :rows="5" type="textarea" />
                </el-form-item>

                <el-form-item
                    v-show="defaultStatusIsShow"
                    label="SEO文章关键词，多个关键词用英文半角逗号隔开，留空则自动将文章标签做为关键词。"
                    prop="seo_keywords"
                >
                    <el-input v-model="postInfoForm.seo_keywords" />
                </el-form-item>

                <el-form-item v-show="defaultStatusIsShow" label="别名，留空则使用默认ID值。" prop="slug">
                    <el-input v-model="postInfoForm.slug" />
                </el-form-item>

                <el-form-item label="手动设置缩略图,如果没有则随机显示一张图片。" prop="thumbnail">
                    <el-input v-model="postInfoForm.thumbnail" />
                </el-form-item>

                <el-form-item label="销售价格 为空则为免费。" prop="price">
                    <el-input-number class="input-number" v-model="postInfoForm.price" :min="0" :precision="2" :step="0.01" placeholder="请输入价格(元)">
                        <template #suffix>
                            <span>元</span>
                        </template>
                    </el-input-number>
                </el-form-item>

                <el-form-item label="分类管理" prop="category_ids" v-if="isShowCategory">
                    <div class="category">
                        <el-checkbox-group v-model="postInfoForm.category_ids">
                            <el-checkbox class="category-item" v-for="item in allCategories" :key="item.id" :value="item.id" size="large">
                                {{ item.name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>

                <el-form-item label="标签管理" prop="tags" v-if="isShowTag">
                    <div class="add-tag">
                        <AddTag ref="addTagRef" :tag-list-in="postInfoForm.tag_names || []" @update-tag-list="updateTagListIn" />
                    </div>
                </el-form-item>

                <el-form-item label="付费管理" prop="pay_roles">
                    <SwitchGroup :switch-items="rolePaidList" @update-status="updateRolePaidList" />
                </el-form-item>

                <el-form-item label="评论管理" prop="comment_status">
                    <SwitchGroup :switch-items="commentStatus" @update-status="updateCommentStatus" />
                </el-form-item>

                <el-form-item label="文章状态" prop="post_status">
                    <div class="post-status">
                        <el-radio-group v-model="postInfoForm.post_status">
                            <el-radio v-for="item in radioOptions()" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
                        </el-radio-group>
                        <div class="post-show-method" v-show="postInfoForm.post_status === PostStatusCode.Publish && postType === PostType.Post">
                            <SwitchGroup :switch-items="postShowMethod" @update-status="updatePostShowMethod" />
                        </div>
                    </div>
                </el-form-item>

                <el-form-item v-if="postInfoForm.post_status === PostStatusCode.Password" label="文章密码" prop="post_password" with="200">
                    <el-input v-model="postInfoForm.post_password" />
                </el-form-item>

                <el-form-item v-if="postInfoForm.post_status === PostStatusCode.Future" label="发布时间" prop="post_push_time">
                    <el-date-picker
                        v-model="postInfoForm.post_push_time.Time"
                        type="datetime"
                        placeholder="留空则为立刻发布"
                        :shortcuts="generateShortcuts('发布')"
                        :default-time="defaultTime"
                    />
                </el-form-item>

                <el-form-item label="过期时间" prop="post_expired_time">
                    <el-date-picker
                        v-model="postInfoForm.post_expired_time.Time"
                        type="datetime"
                        placeholder="留空则为永不过期"
                        :shortcuts="generateShortcuts('过期')"
                        :default-time="defaultTime"
                    />
                </el-form-item>
            </el-form>

            <div class="btns-footer">
                <el-button type="primary" class="save-post btns-footer-item" @click="submitForm(formRef as FormInstance)">
                    <j-icon :name="IconKeys.Save" custom-class="btns-footer-item-icon" />
                    <span>保存</span>
                </el-button>
            </div>
        </el-container>
    </section>

    <!-- 媒体文件选择弹窗 -->
    <SelectMedia v-if="mediaDialogVisible" v-model="mediaDialogVisible" @insert-data="insertData" />
</template>
<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { useIntersectionObserver, useResizeObserver } from "@vueuse/core"
import type { ElContainer, ElFormItem } from "element-plus"
import type { FormInstance } from "element-plus"
import { computed, onBeforeMount, onUnmounted, reactive, ref, toRefs, useTemplateRef, watch } from "vue"
import { useRouter } from "vue-router"

import { getPostStatusOptions, type InsertPostRequest, PostStatusCode, PostType } from "@/api/post/common"
import { type PostCategory, viewListPostCategoryAPI } from "@/api/postCategory/view"
import { ResponseCode } from "@/api/response"
import AddTag from "@/components/common/add-tag/index.vue"
import type { TableData } from "@/components/common/base-table"
import { IconKeys } from "@/components/common/icons"
import SelectMedia from "@/components/common/media-select/index.vue"
import SwitchGroup from "@/components/common/switch-group"
import { EditorStateManager } from "@/components/editor"
import JEditor from "@/components/editor/index.vue"
import { useEditor } from "@/components/hooks/useEditor"
import { PermissionNames } from "@/stores/permissionRole"
import { useUserStore } from "@/stores/user"
import { formatTime } from "@/utils/dateTime"
import { generateShortcuts } from "@/utils/dateTime"
import { MessageUtil } from "@/utils/message"

import { type PostInfoAboutTime, type PostUpsertProps, queryKey, type UpdatePostForm, type UpsertPostForm } from "./types"
import { useAdd } from "./useAdd"
import { useEdit } from "./useEdit"
import { useFormValidation } from "./useFormValidation"
import { useSnapshot } from "./useSnapshot"
import { useSwitchItem } from "./useSwitchItem"
import { createEmptyUpsertPostForm } from "./utils"

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
const isShowCategory = computed(() => postType === PostType.Post)
const isShowTag = computed(() => postType === PostType.Post)

const postInfoAboutTime = reactive<PostInfoAboutTime>({})

const elContainerRef = useTemplateRef<InstanceType<typeof ElContainer> | null>("elContainerRef")
const formRef = useTemplateRef<FormInstance>("formRef")
const seoDescriptionRef = useTemplateRef<InstanceType<typeof ElFormItem> | null>("seoDescriptionRef")
const editorContainerRef = useTemplateRef<HTMLDivElement | null>("editorContainerRef")
const editorPostRef = useTemplateRef<InstanceType<typeof JEditor>>("editorPostRef")

const stateManager = new EditorStateManager()
useEditor(stateManager)

const editorState = stateManager.getState()
const mediaDialogVisible = ref(false)

const userStore = useUserStore()

const router = useRouter()

// 监听编辑器宽度变化
const { stop: stopResizeObserver } = useResizeObserver(editorContainerRef, (entries) => {
    const entry = entries[0]!
    const { width } = entry.contentRect
    stateManager.setEditorWidth(width)
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
    defaultStatusIsShow,
    updateDefaultStatus,
    defaultStatus,
    rolePaidList,
    initRolePaidManagement,
    updateRolePaidList,
    commentStatus,
    updateCommentStatus,
    postShowMethod,
    updatePostShowMethod,
} = useSwitchItem(postInfoForm)

// 监控标题变化,更新 seo 标题
watch(
    () => postInfoForm.post_title,
    (newVal, oldVal) => {
        // 如果 seo 标题为空，则更新 seo 标题
        if (!postInfoForm.seo_title && newVal) {
            postInfoForm.seo_title = newVal
        }

        // 如果 seo 标题不为空，且和标题oldVal不相等，则不更新 seo 标题
        if (postInfoForm.seo_title && postInfoForm.seo_title !== oldVal) {
            return
        }

        // 如果 seo 标题不为空，且和标题oldVal相等，则更新 seo 标题
        if (postInfoForm.seo_title && postInfoForm.seo_title === oldVal && newVal) {
            postInfoForm.seo_title = newVal
        }
    },
)

// 监控文章内容变化,更新 seo 描述
watch(
    () => postInfoForm.post_content,
    (newVal, oldVal) => {
        // 如果 seo 描述为空，则更新 seo 描述
        if (!postInfoForm.seo_description && newVal) {
            postInfoForm.seo_description = newVal.slice(0, 200)
        }

        // 如果 seo 描述不为空，且和文章内容oldVal不相等，则不更新 seo 描述
        if (postInfoForm.seo_description && postInfoForm.seo_description !== oldVal.slice(0, 200)) {
            return
        }

        // 如果 seo 描述不为空，且和文章内容oldVal相等，则更新 seo 描述
        if (postInfoForm.seo_description && postInfoForm.seo_description === oldVal.slice(0, 200) && newVal) {
            postInfoForm.seo_description = newVal.slice(0, 200)
        }
    },
)

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

// 监控 seo 描述是否是否出现在视口
const seoDescriptionVisible = ref(false)
const { stop: stopIntersectionObserver } = useIntersectionObserver(seoDescriptionRef, ([entry]) => {
    seoDescriptionVisible.value = entry?.isIntersecting || false
})

// 监控 seo 描述显示状态变化,更新 seo 描述
watch(
    () => seoDescriptionVisible.value,
    () => {
        // 将编辑器内容赋值给 post_content
        postInfoForm.post_content = editorState.editorContent
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

        // 如果文章状态不为定时发布，则清空文章发布时间
        if (newVal !== PostStatusCode.Future) {
            postInfoForm.post_push_time = {
                Time: null,
                Valid: false,
            }
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
})

// 监控 category_ids 变化,手动执行校验
watch(
    () => postInfoForm.category_ids,
    () => {
        formRef.value?.validateField("category_ids")
    },
)

// 需要更新的数据
const dataOfUpdate: UpdatePostForm = reactive({}) as UpdatePostForm

const { submitForm: addSubmitForm } = useAdd(postInfoForm, queryKey, postInfoAboutTime, router, routeName)
const {
    getValueFromQuery,
    getDataOnBeforeMount,
    submitForm: editSubmitForm,
} = useEdit(postInfoForm, rolePaidList, commentStatus, queryKey, stateManager, dataOfUpdate, postInfoAboutTime, postShowMethod)

// 数据快照
const { isUpdate, updatedFields, updateSnapshot } = useSnapshot(postInfoForm)

// 更新编辑器状态
const updateEditorStatus = () => {
    // 将编辑器内容赋值给 post_content
    postInfoForm.post_content = editorState.editorContent
    // 将作者赋值给 post_author
    postInfoForm.post_author = userStore.data.user.id.toString()
}

const submitForm = async (formEl: FormInstance | undefined) => {
    // 判断走新增还是更新
    if (!postInfoForm.id) {
        await addSubmitForm(formEl).then((isFinish) => {
            // 如果新增成功，将快照更新
            if (isFinish) {
                updateSnapshot()
            }
        })
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

        // 需要更新的字段
        dataOfUpdate.update_fields = Object.keys(updatedFields) as (keyof InsertPostRequest)[]
        dataOfUpdate.id = postInfoForm.id

        await editSubmitForm(formEl).then((isFinish) => {
            // 如果更新成功，将快照更新
            if (isFinish) {
                updateSnapshot()
            }
        })
    }
}

const insertData = (data: TableData[]) => {
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
            content = `![alt](${item.img?.url})\n`
        }

        // TODO: 其他类型

        editorPostRef.value?.codemirror?.insertContent(content)
    }

    // 关闭弹窗
    mediaDialogVisible.value = false
}

onUnmounted(() => {
    stopResizeObserver()
    stopIntersectionObserver()
})

onBeforeMount(async () => {
    // 生成角色付费管理
    await initRolePaidManagement()
    await getCategoryList()
    await getValueFromQuery()
    if (postInfoForm.id) {
        await getDataOnBeforeMount()
    }
    await updateSnapshot()
})
</script>

<style scoped lang="scss">
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

.seo-switch {
    display: flex;
    align-items: center;
    margin: 16px 0;
    font-size: 14px;
    color: var(--jpz-text-color-primary);
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

.post-info {
    // margin: 10px 20px;
    padding: 10px 20px;
    width: calc(100% - 40px);
    height: 100%;
    overflow: auto;
    position: relative;
}

.input-number {
    width: 100%;
}
</style>
