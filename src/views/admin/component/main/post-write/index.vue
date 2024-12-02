<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 10:04:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-02 14:28:23
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
                <el-button
                    type="primary"
                    class="save-post btns-header-item"
                    @click="submitForm(formRef as FormInstance)"
                >
                    <Icon :name="IconKeys.Save" custom-class="btns-header-item-icon" />
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
                <el-input v-model="postInfoForm.post_title" placeholder="添加标题" />
            </el-form-item>

            <!-- 编辑器 -->
            <div ref="editorContainerRef" class="editor md-layout-fs">
                <EditorPost :editor-state="editorState" />

                <!-- 创建时间和更新时间 -->
                <div v-if="postInfoAboutTime.created_at" class="about-time">
                    <span>创建时间：{{ formatTime(postInfoAboutTime.created_at || "") }}</span>
                    <span>更新时间：{{ formatTime(postInfoAboutTime.updated_at || "") }}</span>
                </div>
            </div>

            <div class="seo-switch">
                <span>常规设置</span>
                <SwitchGroup :switch-items="seoStatus" @update-status="updateSeoStatus" />
            </div>

            <el-form-item
                v-show="seoIsShow"
                label="SEO自定义文章标题，留空则为文章标题。"
                prop="seo_title"
            >
                <el-input v-model="postInfoForm.seo_title" />
            </el-form-item>

            <el-form-item
                ref="seoDescriptionRef"
                v-show="seoIsShow"
                label="SEO文章描述，留空则自动截取首段一定字数作为文章描。"
                prop="seo_description"
            >
                <el-input v-model="postInfoForm.seo_description" :rows="5" type="textarea" />
            </el-form-item>

            <el-form-item
                v-show="seoIsShow"
                label="SEO文章关键词，多个关键词用英文半角逗号隔开，留空则自动将文章标签做为关键词。"
                prop="seo_keywords"
            >
                <el-input v-model="postInfoForm.seo_keywords" />
            </el-form-item>

            <el-form-item v-show="seoIsShow" label="别名，留空则使用默认ID值。" prop="slug">
                <el-input v-model="postInfoForm.slug" />
            </el-form-item>

            <el-form-item label="手动设置缩略图,如果没有则随机显示一张图片。" prop="thumbnail">
                <el-input v-model="postInfoForm.thumbnail" />
            </el-form-item>

            <el-form-item label="销售价格 为空则为免费。" prop="price">
                <el-input v-model="postInfoForm.price" />
            </el-form-item>

            <el-form-item label="文章分类管理" prop="category_ids">
                <div class="category">
                    <el-checkbox-group v-model="postInfoForm.category_ids">
                        <el-checkbox
                            class="category-item"
                            v-for="item in allCategories"
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
                        :tag-list-in="postInfoForm.tag_names || []"
                        @update-tag-list="updateTagListIn"
                    />
                </div>
            </el-form-item>

            <el-form-item label="付费管理" prop="pay_roles">
                <SwitchGroup :switch-items="rolePaidList" @update-status="updateRolePaidList" />
            </el-form-item>

            <el-form-item label="评论管理" prop="comment_status">
                <SwitchGroup :switch-items="commentStatus" @update-status="updateCommentStatus" />
            </el-form-item>

            <el-form-item label="文章状态" prop="post_status">
                <el-radio-group v-model="postInfoForm.post_status">
                    <el-radio
                        v-for="item in radioOptions()"
                        :key="item.value"
                        :value="item.value"
                        >{{ item.label }}</el-radio
                    >
                </el-radio-group>
            </el-form-item>

            <el-form-item
                v-if="postInfoForm.post_status === PostStatusCode.Password"
                label="文章密码"
                prop="post_password"
                with="200"
            >
                <el-input v-model="postInfoForm.post_password" />
            </el-form-item>

            <el-form-item
                v-if="postInfoForm.post_status === PostStatusCode.Future"
                label="文章发布时间"
                prop="post_push_time"
            >
                <el-date-picker
                    v-model="postInfoForm.post_push_time.Time"
                    type="datetime"
                    placeholder="留空则为立刻发布"
                    :shortcuts="generateShortcuts('发布')"
                    :default-time="defaultTime"
                />
            </el-form-item>

            <el-form-item label="文章过期时间" prop="post_expired_time">
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
            <el-button
                type="primary"
                class="save-post btns-footer-item"
                @click="submitForm(formRef as FormInstance)"
            >
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
    watch,
} from "vue"
import { useResizeObserver, useIntersectionObserver } from "@vueuse/core"
import { EditorStateManager, EditorPost } from "@/components/editor"
import { IconKeys } from "@/components/common/icons"
import type { SwitchItem, SwitchItemLabel } from "@/components/common/switch-group"
import SwitchGroup from "@/components/common/switch-group"
import { AdminSideMenu } from "@/views/admin/component/aside"
import type { ElContainer, ElFormItem } from "element-plus"
import { useUserStore } from "@/stores/user"
import { viewListPostCategoryAPI, type PostCategory } from "@/api/postCategory/view"
import { ResponseCode, LocalStorageKey } from "@/api/responseCode"
import { getRolesList } from "@/utils/permissionRole"
import {
    PostStatusCode,
    CommentStatusCode,
    gegPostStatusOptions,
    type InsertPostRequest,
} from "@/api/post/common"
import { useFormValidation } from "./hooks"
import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { PermissionNames } from "@/utils/permissionRole"
import {
    queryKey,
    createEmptyUpsertPostForm,
    type UpsertPostForm,
    type PostInfoAboutTime,
    type UpdatePostForm,
} from "./index"
import AddTag from "@/components/common/add-tag"
import { ShowMsgTip } from "@/utils/message"
import { useAdd } from "./useAdd"
import { useEdit } from "./useEdit"
import { deepClone, getUpdatedFields } from "@/utils/obj"
import { formatTime } from "@/utils/dateTime"

defineOptions({ name: AdminSideMenu.PostWrite })

// 初始化表单数据
const postInfoForm = reactive<UpsertPostForm>(createEmptyUpsertPostForm())
const postInfoAboutTime = reactive<PostInfoAboutTime>({})

const elContainerRef = useTemplateRef<InstanceType<typeof ElContainer> | null>("elContainerRef")
const formRef = useTemplateRef<FormInstance>("formRef")
const seoDescriptionRef = useTemplateRef<InstanceType<typeof ElFormItem> | null>(
    "seoDescriptionRef",
)
const editorContainerRef = useTemplateRef<HTMLDivElement | null>("editorContainerRef")

const stateManager = new EditorStateManager()
const editorState = stateManager.getState()

const userStore = useUserStore()
userStore.setIsEditing(true)

// 监听编辑器宽度变化
const { stop: stopResizeObserver } = useResizeObserver(editorContainerRef, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect
    stateManager.setEditorWidth(width)
})

// 所有分类列表
const allCategories = ref<PostCategory[]>([])

const showWarningCategory = () => {
    if (allCategories.value.length === 0) {
        ShowMsgTip(ShowMsgTip.MsgType.warning, "请添加文章分类后在进入文章编辑")
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

// SEO状态
const seoIsShow = ref(localStorage.getItem(LocalStorageKey.IsShowSeoAtPostWrite) == "true")
const seoStatus: SwitchItem[] = reactive([
    {
        name: "seoStatus",
        display: "SEO状态",
        status: localStorage.getItem(LocalStorageKey.IsShowSeoAtPostWrite) == "true",
        label: {
            labelTrue: "展开",
            labelFalse: "折叠",
        },
    },
])

// 更新SEO状态
const updateSeoStatus = (items: SwitchItem[]) => {
    seoIsShow.value = items[0].status
    localStorage.setItem(LocalStorageKey.IsShowSeoAtPostWrite, items[0].status.toString())
}

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
        if (
            postInfoForm.seo_description &&
            postInfoForm.seo_description === oldVal.slice(0, 200) &&
            newVal
        ) {
            postInfoForm.seo_description = newVal.slice(0, 200)
        }
    },
)

// 监控文章标签变化,更新 seo 关键词
watch(
    () => postInfoForm.tag_names,
    (newVal, oldVal) => {
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
const { stop: stopIntersectionObserver } = useIntersectionObserver(
    seoDescriptionRef,
    ([entry], observerElement) => {
        seoDescriptionVisible.value = entry?.isIntersecting || false
    },
)

// 监控 seo 描述显示状态变化,更新 seo 描述
watch(
    () => seoDescriptionVisible.value,
    () => {
        // 将编辑器内容赋值给 post_content
        postInfoForm.post_content = editorState.editor
    },
)

// 更新 slug
watch(
    () => postInfoForm.id,
    (newVal, oldVal) => {
        // 如果 slug 为空，且 id 不为空，则更新 slug
        if (!postInfoForm.slug && newVal) {
            postInfoForm.slug = newVal
        }
    },
)

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
            namePosition: "left",
            status: false,
            label: rolePaidLabel,
            minWidth: 180,
        }
        rolePaidList.push(switchItem)
    })

    // TODO 从商城角色列表获取角色列表
}

// 更新角色付费管理
const updateRolePaidList = (items: SwitchItem[]) => {
    // 更新 postInfoForm.pay_roles,筛选出 status 为 true 的角色
    postInfoForm.pay_roles = items
        .filter((i) => i.status)
        .map((i) => {
            return i.name
        })
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

// 更新评论状态
const updateCommentStatus = (items: SwitchItem[]) => {
    // 更新 postInfoForm.comment_status
    postInfoForm.comment_status = items[0].status ? CommentStatusCode.Open : CommentStatusCode.Close
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

// 文章信息快照，用于判断是否有更新
let postInfoSnapshot: UpsertPostForm = deepClone(postInfoForm)

// 需要更新的数据
const dataOfUpdate: UpdatePostForm = reactive({}) as UpdatePostForm

const { submitForm: addSubmitForm } = useAdd(postInfoForm, queryKey, postInfoAboutTime)
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
)

const submitForm = async (formEl: FormInstance | undefined) => {
    // 判断文章内容是否为空
    if (editorState.editor === "") {
        ShowMsgTip(ShowMsgTip.MsgType.warning, "文章内容不能为空", 6000)
        return
    }

    // 将编辑器内容赋值给 post_content
    postInfoForm.post_content = editorState.editor

    // 将作者赋值给 post_author
    postInfoForm.post_author = userStore.data.user.id.toString()

    // 判断走新增还是更新
    if (!postInfoForm.id) {
        await addSubmitForm(formEl).then((isFinish) => {
            // 如果新增成功，将快照更新
            if (isFinish) {
                postInfoSnapshot = deepClone(postInfoForm)
            }
        })
    } else {
        // 获取已经更新字段
        const updatedFields = getUpdatedFields(postInfoSnapshot, postInfoForm, "id")

        // 判断是否有更新
        if (Object.keys(updatedFields).length === 0) {
            ShowMsgTip(ShowMsgTip.MsgType.warning, "没有任何修改")
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
                postInfoSnapshot = deepClone(postInfoForm)
            }
        })
    }
}

onBeforeMount(async () => {
    // 生成角色付费管理
    await initRolePaidManagement()
    await getCategoryList()
    getValueFromQuery()
    if (postInfoForm.id) {
        await getDataOnBeforeMount()
        postInfoSnapshot = deepClone(postInfoForm)
    }
})

// 监听页面关闭事件,即用户手动修改ULR或关闭页面
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (userStore.isEditing) {
        // 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/beforeunload_event
        event.preventDefault()
        event.returnValue = ""
    }
}

onMounted(() => {
    window.addEventListener("beforeunload", handleBeforeUnload)
})

onBeforeUnmount(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload)
    stopResizeObserver()
    stopIntersectionObserver()
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

.about-time {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    font-size: 14px;
    color: var(--text-color);
}

.seo-switch {
    display: flex;
    align-items: center;
    margin: 16px 0;
    font-size: 14px;
    color: var(--text-color);
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
</style>
