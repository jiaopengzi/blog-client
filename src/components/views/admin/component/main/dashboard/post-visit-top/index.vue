<!--
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\dashboard\post-visit-top\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 内容访问排行(文章/page 按期间浏览量 TopN, 含主题化交互反馈)
-->
<template>
    <div class="post-visit-top-container">
        <h4>内容访问排行</h4>
        <div class="post-visit-top-select">
            <!-- 时间范围选择 -->
            <div class="post-visit-top-select-item">
                <el-select v-model="valueRange" placeholder="Select" style="width: 120px">
                    <el-option v-for="item in optionsRange" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>

            <!-- TopN 数量: 步进按集合 {1,10,...,100} 对齐, 手动输入就近对齐 -->
            <div class="post-visit-top-select-item topn-control">
                <el-button :icon="Minus" text bg size="small" :disabled="valueTopN <= POST_VISIT_TOP_N_MIN" @click="onStepTopN(-1)" />
                <el-input v-model="topNInput" class="topn-input" @change="onManualTopN" />
                <el-button :icon="Plus" text bg size="small" :disabled="valueTopN >= POST_VISIT_TOP_N_MAX" @click="onStepTopN(1)" />
            </div>
        </div>

        <!-- 排行列表 -->
        <div class="post-visit-top-list">
            <template v-if="items.length > 0">
                <div
                    v-for="(item, index) in items"
                    :key="item.post_id"
                    class="post-visit-top-row"
                    :style="{ '--row-width': maxPV > 0 ? Math.round((item.pv / maxPV) * 100) : 0 }"
                >
                    <span class="row-rank" :class="{ 'row-rank-top': index < 3 }">{{ index + 1 }}</span>
                    <span class="row-type" :class="item.post_type === 'page' ? 'row-type-page' : 'row-type-post'">
                        {{ item.post_type === "page" ? "页面" : "文章" }}
                    </span>
                    <a class="row-title" :href="item.post_url_path" target="_blank" rel="noopener" :title="item.post_title">{{ item.post_title }}</a>
                    <span class="row-pv">{{ item.pv }}</span>
                </div>
            </template>
            <div v-else class="no-data">no data</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, type Ref, ref, watch } from "vue"

import { Minus, Plus } from "@element-plus/icons-vue"
import { ElButton, ElInput, ElOption, ElSelect } from "element-plus"

import { getPostVisitTopAPI, type PostVisitTopItem } from "@/api/dashboard/postVisitTop"
import { ResponseCode } from "@/api/response"

import { getSavedPostVisitTopSelection, persistPostVisitTopSelection } from "./hooks"
import {
    alignPostVisitTopN,
    POST_VISIT_TOP_N_DEFAULT,
    POST_VISIT_TOP_N_MAX,
    POST_VISIT_TOP_N_MIN,
    postVisitRangeToDimension,
    PostVisitRange,
    PostVisitRangeDisplay,
    stepPostVisitTopN,
} from "./types"

defineOptions({ name: "DashboardPostVisitTop" })

const savedSelection = getSavedPostVisitTopSelection()

// 时间范围选择项和值
const optionsRange = ref(Object.values(PostVisitRange).map((value) => ({ label: PostVisitRangeDisplay[value], value })))
const valueRange: Ref<PostVisitRange> = ref(savedSelection?.range ?? PostVisitRange.Today)

// 排行数量(默认 10, 集合 {1,10,...,100} 内取值)
const valueTopN: Ref<number> = ref(savedSelection?.topN ?? POST_VISIT_TOP_N_DEFAULT)

// 输入框展示值(字符串, 手动输入任意数字, 失焦后对齐回集合)
const topNInput = ref(String(valueTopN.value))

// 排行数据
const items: Ref<PostVisitTopItem[]> = ref([])

// 排行条目的最大浏览量(用于条形背景宽度)
const maxPV = computed(() => {
    return items.value.reduce((max, item) => Math.max(max, item.pv), 0)
})

/**
 * onStepTopN 点击加减号: 步进到集合中的上一个/下一个值(1 加 -> 10, 11 加 -> 20, 11 减 -> 10).
 * @param dir - 1 表示加, -1 表示减.
 */
const onStepTopN = (dir: 1 | -1) => {
    valueTopN.value = stepPostVisitTopN(valueTopN.value, dir)
    topNInput.value = String(valueTopN.value)
}

/**
 * onManualTopN 手动输入失焦后就近对齐回集合(5 -> 10, 14 -> 10, 15 -> 20).
 */
const onManualTopN = () => {
    valueTopN.value = alignPostVisitTopN(Number(topNInput.value))
    topNInput.value = String(valueTopN.value)
}

/**
 * getPostVisitTop 拉取当前筛选下的访问排行.
 */
const getPostVisitTop = async () => {
    const { dimension, isCurrent } = postVisitRangeToDimension(valueRange.value)

    const res = await getPostVisitTopAPI({
        dimension,
        is_current: isCurrent,
        top_n: valueTopN.value,
    })

    if (res.data.code === ResponseCode.DashboardGetPostVisitTopSuccess) {
        items.value = res.data.data.items
    }
}

// 监听变化
watch(
    [valueRange, valueTopN],
    ([newRange, newTopN]) => {
        persistPostVisitTopSelection(newRange, newTopN)
        void getPostVisitTop()
    },
    { immediate: true },
)
</script>
<style scoped lang="scss">
/*
 * 设计说明: 安静的编辑感数据榜.
 * 全部取 theme 体系变量(--jpz-*)并以 color-mix 派生, 跟随 8 套预设与明暗模式;
 * 前三名用主题 primary 徽章收束视线, 其余名次退为细数字; 占比条用伪元素承载,
 * 宽度与颜色均可平滑过渡, hover 时整行反馈(背景 + 标题 + 条同时加深).
 */
.post-visit-top-container {
    margin-top: 48px;

    h4 {
        font-size: 16px;
        font-weight: 600;
        color: var(--jpz-text-color-primary);
        margin-bottom: 24px;
        padding-left: 12px;
        border-left: 4px solid var(--jpz-text-color-primary);
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }

    .post-visit-top-select {
        margin-bottom: 24px;
        padding: 16px;
        background-color: var(--jpz-bg-color);
        border: 1px solid var(--jpz-border-color-lighter);
        border-radius: 6px;
        display: inline-flex;
        gap: 16px;
        box-shadow: var(--jpz-box-shadow-lighter);
        align-items: center;
    }

    .topn-control {
        display: inline-flex;
        align-items: center;
        border: 1px solid var(--jpz-border-color);
        border-radius: 4px;
        overflow: hidden;

        .el-button {
            margin: 0;
            border: none;
            border-radius: 0;
        }

        .topn-input {
            width: 56px;

            :deep(.el-input__wrapper) {
                border-radius: 0;
                box-shadow: none;
                background-color: transparent;
            }

            :deep(input) {
                text-align: center;
                font-family: "JBMonoWOFF2", monospace;
            }
        }
    }

    .post-visit-top-list {
        background-color: var(--jpz-bg-color);
        border: 1px solid var(--jpz-border-color-lighter);
        border-radius: 6px;
        box-shadow: var(--jpz-box-shadow-light);
        padding: 10px 20px;
    }

    .post-visit-top-row {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        margin: 2px 0;
        border-radius: 4px;
        transition:
            background-color 0.18s ease,
            box-shadow 0.18s ease;

        // 行分隔线用极淡主题边色, 最后一行不留
        & + .post-visit-top-row::after {
            content: "";
            position: absolute;
            top: -2px;
            left: 40px;
            right: 0;
            height: 1px;
            background-color: var(--jpz-border-color-lighter);
        }

        // 浏览量占比条: 伪元素承载, 宽度按 maxPV 等比, 颜色为主题 primary 低浓度派生
        &::before {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: calc(var(--row-width, 0) * 1%);
            border-radius: 4px;
            background-color: color-mix(in srgb, var(--jpz-color-primary) 10%, var(--jpz-bg-color));
            transition:
                width 0.25s ease,
                background-color 0.18s ease;
            pointer-events: none;
        }

        // 整行交互反馈独立于比例条, 低 PV 条目也能明确看出可操作范围
        &:is(:hover, :focus-within) {
            background-color: color-mix(in srgb, var(--jpz-color-primary) 8%, var(--jpz-bg-color));
            box-shadow: inset 3px 0 0 color-mix(in srgb, var(--jpz-color-primary) 78%, var(--jpz-bg-color));

            &::before {
                background-color: color-mix(in srgb, var(--jpz-color-primary) 20%, var(--jpz-bg-color));
            }

            .row-title {
                color: var(--jpz-color-primary);
            }
        }
    }

    // 行内内容盖在占比条之上
    .row-rank,
    .row-type,
    .row-title,
    .row-pv {
        position: relative;
        z-index: 1;
    }

    .row-rank {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "JBMonoWOFF2", monospace;
        font-size: 12px;
        font-weight: 600;
        color: var(--jpz-text-color-placeholder);

        // 前三名: 主题 primary 实心徽章, 文字用背景色保证对比
        &.row-rank-top {
            color: var(--jpz-bg-color);
            background-color: color-mix(in srgb, var(--jpz-color-primary) 86%, var(--jpz-bg-color));
            border-radius: 50%;
        }
    }

    .row-type {
        flex-shrink: 0;
        font-size: 11px;
        line-height: 1;
        padding: 3px 7px;
        border-radius: 3px;
        border: 1px solid transparent;

        // 文章: primary 派生; 页面: secondary 派生 —— 跟随主题而非硬编码色
        &.row-type-post {
            color: var(--jpz-color-primary);
            background-color: color-mix(in srgb, var(--jpz-color-primary) 9%, var(--jpz-bg-color));
            border-color: color-mix(in srgb, var(--jpz-color-primary) 22%, var(--jpz-bg-color));
        }

        &.row-type-page {
            color: var(--jpz-color-secondary);
            background-color: color-mix(in srgb, var(--jpz-color-secondary) 9%, var(--jpz-bg-color));
            border-color: color-mix(in srgb, var(--jpz-color-secondary) 22%, var(--jpz-bg-color));
        }
    }

    .row-title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--jpz-text-color-primary);
        font-size: 14px;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.15s ease;

        &:hover {
            text-decoration: underline;
            text-underline-offset: 3px;
        }

        &:focus-visible {
            outline: 2px solid var(--jpz-color-primary);
            outline-offset: 2px;
            border-radius: 2px;
        }
    }

    .row-pv {
        flex-shrink: 0;
        min-width: 48px;
        text-align: right;
        font-family: "JBMonoWOFF2", monospace;
        font-size: 13px;
        font-weight: 600;
        color: var(--jpz-text-color-regular);

        // 单位弱化, 数字为主
        &::after {
            content: " 次";
            font-size: 11px;
            font-weight: 400;
            color: var(--jpz-text-color-placeholder);
        }
    }

    .no-data {
        text-align: center;
        font-size: 16px;
        color: var(--jpz-text-color-disabled);
        padding: 32px 0;
        font-family: "JBMonoWOFF2", monospace;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
}
</style>
