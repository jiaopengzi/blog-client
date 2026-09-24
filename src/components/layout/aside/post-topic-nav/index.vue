<!--
 * FilePath    : blog-client\src\components\layout\aside\post-topic-nav\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 专题导航卡片 (专题文章详情页独占右侧栏, bf-260924-01)
-->

<!--
 * 补充说明:
 * 数据组件内 useAsyncData 自取 (固定 key 单数据槽, 结果天然进 payload, SSR 直出 + 水合一致), layout-aside 经 settled 事件只读判定结果;
 * 互斥时序 (第3轮反馈#2): 判定结果经 settled 事件上抛 (数据 settle 即通知, 含 IsNone 的 false),
 * layout-aside 据此决定 4 卡片去留与补拉时机, 侧栏水合后挂载时组件 async setup 的请求可能晚于父级 onMounted;
 * 同专题文章切换 (第1轮反馈#3): 现有树已含目标文章时直接复用 (零请求), 仅当前高亮随路由变化; 跨专题/非专题文章才重新请求;
 * 手风琴 (第1轮反馈#2): 同一分组下同时只展开一个子分组, 嵌套各层同理互斥; 默认展开当前文章所在分组链, 切换文章自动重算;
 * 链路递归高亮 (第2轮反馈#1): 当前文章所在分组链从直属分组到根递归保持 active, 展开其他章节折叠原链后仍可辨识当前文章位置;
 * 失败静默: 数据为 null 时卡片不渲染 + console.warn 一次, 正文与侧栏其余部分不受影响;
 * 登录态校准 (D4): SSR 恒匿名口径, 水合后 isInitStoresReady 且已登录则带 token 复拉覆盖 (补本人私密文章, 复刻 bf-260903-01);
 * 排序切换 (D3): icon 双态, 默认时间正序 = 后端原数组; 字母序仅前端按组内标题本地重排, 偏好 localStorage 记忆;
 * 分组顺序恒按后端 order, 不参与切换; localeCompare 只在客户端执行, 无水合风险.
-->

<template>
    <div v-if="navData" ref="cardRef" class="topic-nav-card">
        <div class="topic-nav-head">
            <h2 class="topic-nav-title"><j-icon :name="IconKeys.Toc" custom-class="topic-nav-icon" />{{ navData.root_category.name }}</h2>
            <el-tooltip :content="sortTooltip" placement="top" :show-after="300">
                <button class="topic-nav-sort" type="button" :aria-label="sortTooltip" @click="toggleSort">
                    <j-icon v-if="sortMode === TOPIC_NAV_SORT_TIME" :name="IconKeys.Time" custom-class="topic-nav-sort-icon" />
                    <span v-else class="topic-nav-sort-alpha">A-Z</span>
                </button>
            </el-tooltip>
        </div>

        <PostTopicNavNode :category="displayRoot" :level="0" :current-post-id="postId" :current-chain-ids="currentChainIds" />
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, provide, ref, useTemplateRef, watch } from "vue"

import { type PostTopicNav, type PostTopicNavCategory, viewTopicNavAPI } from "@/api/post/topicNav"
import { ResponseCode } from "@/api/response"
import { IconKeys } from "@/components/common/icons"
import { useUserStore } from "@/stores/user"
import { LocalStorageKey } from "@/stores/local"

import PostTopicNavNode from "./node.vue"
import { POST_TOPIC_NAV_DATA_KEY, TOPIC_NAV_EXPAND_KEY, TOPIC_NAV_ROOT_PARENT, TOPIC_NAV_SORT_ALPHA, TOPIC_NAV_SORT_TIME, type TopicNavSortMode } from "./types"

defineOptions({ name: "PostTopicNav" })

// settled: 专题判定结果上抛 (数据 settle 即通知, 含非专题 false; layout-aside 互斥与补拉时序依据)
const emit = defineEmits<{
    (event: "settled", isTopic: boolean): void
}>()

const route = useRoute()
const postId = computed(() => String(route.params.id ?? ""))

// 失败告警只输出一次 (跨导航复用同一实例, 避免 refetch 失败反复刷屏)
let hasWarned = false

// fetchNav 拉取指定文章的专题导航 (失败静默返回 null), 供首取/文章切换/登录校准共用
const fetchNav = async (id: string): Promise<PostTopicNav | null> => {
    try {
        const res = await viewTopicNavAPI({ post_id: id })
        const body = res.data
        if (body.code === ResponseCode.PostViewTopicNavSuccess && body.data) {
            return body.data
        }
        // 无数据码为正常业务分支 (非专题文章), 不告警
        if (body.code !== ResponseCode.PostViewTopicNavIsNone && !hasWarned) {
            hasWarned = true
            console.warn(`[post-topic-nav] 获取专题导航失败(post_id=${id}): code=${body.code} msg=${body.msg}`)
        }
    } catch (error) {
        if (!hasWarned) {
            hasWarned = true
            console.warn(`[post-topic-nav] 获取专题导航异常(post_id=${id}): ${error}`)
        }
    }

    return null
}

// collectTreePostIds 收集树内全部文章 ID (用于判断目标文章是否与现有树同专题)
const collectTreePostIds = (node: PostTopicNavCategory, into: Set<string>): Set<string> => {
    for (const post of node.posts ?? []) {
        into.add(post.id)
    }
    for (const child of node.children ?? []) {
        collectTreePostIds(child, into)
    }

    return into
}

// 数据自取: 固定 key 单数据槽 (layout-aside 互斥只读同 key); 换文章时先查现有树, 命中同专题直接复用零请求
const { data: navData } = await useAsyncData<PostTopicNav | null>(
    POST_TOPIC_NAV_DATA_KEY,
    async () => {
        const cached = useNuxtData<PostTopicNav>(POST_TOPIC_NAV_DATA_KEY).data.value
        if (cached && collectTreePostIds(cached.root_category, new Set()).has(postId.value)) {
            return cached
        }

        return await fetchNav(postId.value)
    },
    { watch: [postId], immediate: true },
)

// ---------- 手风琴展开状态 (第1轮反馈#2) ----------
// 展开表: 父分组 key → 该层当前展开的子分组 id; 同父覆盖写入天然形成同级互斥, 嵌套各层独立成对
const expandedByParent = ref<Record<string, string>>({})

const toggleGroup = (parentKey: string, groupId: string) => {
    expandedByParent.value =
        expandedByParent.value[parentKey] === groupId
            ? { ...expandedByParent.value, [parentKey]: "" } // 再点同一分组头 → 该层全折叠
            : { ...expandedByParent.value, [parentKey]: groupId } // 展开目标分组, 同父其余自动折叠
}

provide(TOPIC_NAV_EXPAND_KEY, { expandedByParent, toggleGroup })

// findCategoryChain 找到直属持有目标文章的分组链 (根 → ... → 直属分组, 同文章多分组取先序者), 无则 null
const findCategoryChain = (node: PostTopicNavCategory, targetPostId: string, path: string[]): string[] | null => {
    if (node.posts?.some((post) => post.id === targetPostId)) {
        return [...path, node.id]
    }

    for (const child of node.children ?? []) {
        const found = findCategoryChain(child, targetPostId, [...path, node.id])
        if (found) {
            return found
        }
    }

    return null
}

// syncExpandedByCurrent 按当前文章重算展开链: 链上每层展开、链外同层折叠 (文章切换后覆盖手动展开状态)
const syncExpandedByCurrent = () => {
    const root = navData.value?.root_category
    const next: Record<string, string> = {}

    if (root) {
        const chain = findCategoryChain(root, postId.value, [])
        if (chain) {
            for (let i = 0; i + 1 < chain.length; i++) {
                const parentKey = i === 0 ? TOPIC_NAV_ROOT_PARENT : chain[i]!
                next[parentKey] = chain[i + 1]!
            }
        }
    }

    expandedByParent.value = next
}

// 当前文章所在分组链 id 集合 (第2轮反馈#1): 链上分组头递归保持 active, 手风琴互斥折叠原章节后仍可辨识当前文章位置
const currentChainIds = computed<ReadonlySet<string>>(() => {
    const root = navData.value?.root_category
    if (!root) {
        return new Set<string>()
    }

    const chain = findCategoryChain(root, postId.value, [])

    return new Set<string>(chain ?? [])
})

// ---------- 排序切换 (D3) ----------
// SSR 与水合首帧恒为时间序 (双端一致), onMounted 后按 localStorage 偏好校准 (后续翻转为纯客户端响应式更新, 无水合风险)
const sortMode = ref<TopicNavSortMode>(TOPIC_NAV_SORT_TIME)

const sortTooltip = computed(() => (sortMode.value === TOPIC_NAV_SORT_TIME ? "按发布时间排序, 点击切换为字母排序" : "按字母排序, 点击切换为发布时间排序"))

// sortTopicNavCategoryPosts 字母序下按组内文章标题重排, 返回新节点 (不改动后端原数组, 切回时间序直接复用原树).
// 分组顺序 (children 顺序) 恒保持后端 order, 不参与字母序切换.
const sortTopicNavCategoryPosts = (category: PostTopicNavCategory): PostTopicNavCategory => ({
    ...category,
    posts: category.posts ? category.posts.toSorted((a, b) => a.post_title.localeCompare(b.post_title, "zh")) : null,
    children: category.children ? category.children.map(sortTopicNavCategoryPosts) : null,
})

const displayRoot = computed<PostTopicNavCategory>(() => {
    const root = navData.value?.root_category
    if (!root) {
        return { id: "", name: "", slug: "", order: 0, is_topic: false, posts: null, children: null }
    }

    return sortMode.value === TOPIC_NAV_SORT_ALPHA ? sortTopicNavCategoryPosts(root) : root
})

const toggleSort = () => {
    sortMode.value = sortMode.value === TOPIC_NAV_SORT_TIME ? TOPIC_NAV_SORT_ALPHA : TOPIC_NAV_SORT_TIME
    localStorage.setItem(LocalStorageKey.TopicNavSort, sortMode.value)
    void locateCurrent()
}

// ---------- 当前文章定位 ----------
const cardRef = useTemplateRef<HTMLElement | null>("cardRef")

// locateCurrent 滚动定位当前文章条目 (挂载/文章切换/排序切换/登录复拉后调用), 不改变用户横向滚动位置
const locateCurrent = async () => {
    await nextTick()
    const current = cardRef.value?.querySelector<HTMLElement>(".topic-nav-post.is-current")
    current?.scrollIntoView({ block: "nearest", behavior: "instant" })
}

// 文章切换 (树复用高亮随动) 与数据更新 (登录复拉) 后: 重算展开链 + 重新定位
watch(
    [postId, navData],
    () => {
        syncExpandedByCurrent()
        void locateCurrent()
    },
    { immediate: true },
)

// 判定结果上抛 (第3轮反馈#2): 数据 settle 即通知父级, 未 settle (undefined) 不通知;
// 同专题树复用时 data 引用不变不触发, 父级沿用上次结果即可
watch(
    navData,
    (val) => {
        if (val !== undefined) {
            emit("settled", !!val)
        }
    },
    { immediate: true },
)

// ---------- 登录态校准 (D4, 复刻 bf-260903-01 refreshLoginAwareAsideData 模式) ----------
onMounted(() => {
    // 排序偏好恢复: SSR 无 localStorage, 此处客户端读取 (首帧已按时间序渲染, 保持水合一致)
    const savedSort = localStorage.getItem(LocalStorageKey.TopicNavSort)
    if (savedSort === TOPIC_NAV_SORT_ALPHA || savedSort === TOPIC_NAV_SORT_TIME) {
        sortMode.value = savedSort
    }

    void (async () => {
        try {
            const { getInitStoresPromise, isInitStoresReady } = await import("@/stores/init")
            if (!isInitStoresReady()) {
                await getInitStoresPromise()
            }
        } catch {
            // initStores 异常不阻塞导航展示, 沿用匿名口径数据
            return
        }

        // 匿名不重复请求 (SSR 注水即匿名口径); 登录用户带 token 复拉, 补本人私密文章后覆盖数据槽
        if (useUserStore().isLogin) {
            const fresh = await fetchNav(postId.value)
            if (fresh) {
                navData.value = fresh
            }
            void locateCurrent()
        }
    })()
})
</script>

<style scoped lang="scss">
// 独占布局 (D1): 吸顶 + 视口限高 + 内部滚动, 全高侧栏形态
.topic-nav-card {
    position: sticky;
    top: calc(#{pc.$height-header} + 16px);
    max-height: calc(100vh - #{pc.$height-header} - 32px);
    overflow-y: auto;
    border: 1px solid var(--jpz-border-color);
    background-color: var(--jpz-bg-color);
    border-radius: 5px;
}

.topic-nav-head {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 10px 8px;
    background-color: var(--jpz-bg-color);
    border-bottom: 1px solid var(--jpz-border-color-lighter);
}

.topic-nav-title {
    display: flex;
    align-items: center;
    min-width: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--jpz-text-color-primary);
}

.topic-nav-icon {
    font-size: 20px;
    margin-right: 5px;
    flex-shrink: 0;
    fill: var(--jpz-color-secondary);
}

// 排序切换按钮 (icon 双态: 时钟 = 时间序, A-Z = 字母序)
.topic-nav-sort {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 5px;
    background-color: transparent;
    color: var(--jpz-color-secondary);
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        color 0.2s ease;

    &:hover {
        color: var(--jpz-color-primary);
        background-color: var(--jpz-bg-color-page);
    }
}

.topic-nav-sort-icon {
    font-size: 18px;
    fill: currentColor;
}

.topic-nav-sort-alpha {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1;
}

// 树容器贴卡片内边距 (分组缩进由 node 组件自行叠加)
.topic-nav-card > :deep(.topic-nav-node) {
    padding: 0 10px 10px;
}
</style>
