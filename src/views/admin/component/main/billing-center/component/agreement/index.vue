<!--
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\component\agreement\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心协议组件
-->

<template>
    <section class="agreement-page">
        <section class="agreement-card">
            <div class="agreement-card-body">
                <div v-if="isLoading" class="agreement-loading" aria-live="polite" aria-busy="true">
                    <el-skeleton animated>
                        <template #template>
                            <div class="agreement-loading-header">
                                <el-skeleton-item variant="h1" class="agreement-loading-title" />
                            </div>
                            <div class="agreement-loading-meta">
                                <el-skeleton-item variant="text" class="agreement-loading-meta-item" />
                                <el-skeleton-item variant="text" class="agreement-loading-meta-item" />
                                <el-skeleton-item variant="text" class="agreement-loading-meta-item" />
                            </div>
                            <div class="agreement-loading-body">
                                <el-skeleton-item v-for="index in 8" :key="index" variant="text" class="agreement-loading-line" />
                            </div>
                        </template>
                    </el-skeleton>
                </div>
                <div v-else class="agreement-content" v-stable-html="agreement.content"></div>
            </div>
            <footer v-if="!isLoading" class="card-footer">
                <div class="meta-item">
                    <span class="label">生效时间</span>
                    <span class="value">{{ agreement.issued_at }}</span>
                </div>

                <div class="meta-item">
                    <span class="label">最后修改</span>
                    <span class="value">{{ agreement.modified_at }}</span>
                </div>
                <div class="meta-item">
                    <span class="label">版本</span>
                    <span class="value">{{ agreement.version }}</span>
                </div>
            </footer>
        </section>
    </section>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue"
import type { BillingCenterAgreementRes } from "@/api/billingCenter/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { billingCenterGetAgreementAPI } from "@/api/billingCenter/getAgreement"
import { MessageUtil } from "@/utils/message"
import createMarked from "@/pkg/marked/new-marked"
import { formatTime } from "@/utils/dateTime"

defineOptions({ name: "AgreementPage" })

// 初始化许可证信息
const agreement = ref<BillingCenterAgreementRes>({
    version: "",
    content: "",
    issued_at: "",
    modified_at: "",
})

const isLoading = ref(true)

/**
 * fetchAgreement 获取远端协议内容, 并同步更新页面展示数据。
 * @returns Promise<void>.
 */
const fetchAgreement = async (): Promise<void> => {
    isLoading.value = true

    try {
        const res = await billingCenterGetAgreementAPI()
        if (res.data.code === ResponseCode.BillingCenterGetAgreementSuccess) {
            const agreementData = res.data.data
            agreement.value.issued_at = formatTime(agreementData.issued_at, undefined, "YYYY-MM-DD")
            agreement.value.modified_at = formatTime(agreementData.modified_at, undefined, "YYYY-MM-DD")
            agreement.value.version = agreementData.version ? `v${agreementData.version}` : ""
            agreement.value.content = createMarked().parse(agreementData.content).toString()
            return
        }

        handleResErr(res.data)
        MessageUtil.error(handleResErr(res), 10000)
    } catch {
        MessageUtil.error("协议加载失败, 请稍后重试", 10000)
    } finally {
        isLoading.value = false
    }
}

onBeforeMount(async () => {
    await fetchAgreement()
})
</script>

<style lang="scss">
.agreement-page {
    padding: 28px 16px;
    color: var(--jpz-text-color-regular);
    background-color: var(--jpz-bg-color-page);
    font-family: "SimSun", "Songti SC", "Source Serif Pro", "PingFang SC", serif;
}

.agreement-card {
    position: relative;
    max-width: 900px;
    margin: 20px auto;
    border-radius: 0;
    overflow: hidden;
    background-color: var(--jpz-bg-color);
    border: none;
    box-shadow: none;
    padding: 48px 72px;
}

.agreement-card-body {
    margin-top: 0;
    background-color: transparent;
    padding: 0;
}

.agreement-loading {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.agreement-loading-header {
    display: flex;
    justify-content: center;
    padding-top: 8px;
}

.agreement-loading-title {
    width: min(360px, 60%);
    height: 40px;
}

.agreement-loading-meta {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    padding: 16px 0 8px;
}

.agreement-loading-meta-item {
    width: 100%;
    height: 18px;
}

.agreement-loading-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.agreement-loading-line {
    width: 100%;
    height: 16px;
}

.agreement-loading-line:nth-child(3n) {
    width: 82%;
}

.agreement-loading-line:nth-child(4n) {
    width: 90%;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 32px;
    gap: 12px;
    border-top: 1px solid var(--jpz-border-color-light);
    margin-top: 40px;
}

.meta-item {
    display: flex;
    gap: 8px;
    align-items: center;
}

.meta-item .label,
.meta-item .value {
    color: var(--jpz-text-color-secondary);
    font-weight: 500;
    font-size: 0.88rem;
}

.agreement-content {
    color: var(--jpz-text-color-primary);
    line-height: 2;
    font-size: 1rem;
    word-break: break-word;
    padding: 0;
    background-color: transparent;
    border: none;
}

.agreement-content h1 {
    font-size: 1.6rem;
    text-align: center;
    margin: 36px 0 24px 0;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--jpz-color-primary);
    letter-spacing: 0.08em;
}

.agreement-content h2 {
    font-size: 21px;
    margin-top: 28px;
    width: 100%;
}

.agreement-content h3 {
    font-size: 1.15rem;
    margin: 22px 0 12px 0;
    padding-left: 10px;
    border-left: 3px solid var(--jpz-color-primary-light-3);
}

.agreement-content h4 {
    font-size: 1.05rem;
    margin: 18px 0 10px 0;
    padding-left: 8px;
    border-left: 2px solid var(--jpz-border-color);
}

.agreement-content h5,
.agreement-content h6 {
    font-size: 1rem;
    margin: 14px 0 8px 0;
}

.agreement-content h1,
.agreement-content h2,
.agreement-content h3,
.agreement-content h4,
.agreement-content h5,
.agreement-content h6 {
    color: var(--jpz-text-color-primary);
    font-weight: 700;
    page-break-after: avoid;
}

.agreement-content p {
    margin: 14px 0;
    text-align: justify;
    line-height: 2;
    // 仅对顶层段落应用首行缩进，避免影响列表内的段落
    text-indent: 2em;
}

.agreement-content ol {
    margin: 14px 0;
    padding-left: 1.5em;

    li {
        line-height: 2em;
        color: var(--jpz-text-color-primary);
        margin: 0 0 0.5em 0;
    }

    li p {
        margin: 0;
        // li 内段落不缩进
        text-indent: 0;
    }
}

// 第一层用中文序号
.agreement-content ol {
    counter-reset: lvl1;
    list-style: none;
    /* 增加左侧内边距，给多字中文编号留出空间，避免错位 */
    padding-left: 3.6em;
}
.agreement-content ol > li {
    counter-increment: lvl1;
    position: relative;
    margin-bottom: 0.5em;
}
.agreement-content ol > li::before {
    // 中文编号
    // content: counter(lvl1, cjk-ideographic) "、";

    // 阿拉伯数编号
    content: counter(lvl1, decimal) "、";
    position: absolute;
    // 将编号区域移入左侧留白并扩大宽度，防止两字编号（如“十一”）换行
    left: -3.6em;
    width: 3em;
    text-align: right;
    white-space: nowrap;
}

// 第二层用阿拉伯数字带括号
.agreement-content ol > li > ol {
    counter-reset: lvl2;
    margin-left: 1.5em;
}
.agreement-content ol > li > ol > li {
    counter-increment: lvl2;
}
.agreement-content ol > li > ol > li::before {
    content: "(" counter(lvl2, decimal) ")";
}

// 第三层可用小写字母带括号
.agreement-content ol > li > ol > li > ol {
    counter-reset: lvl3;
    margin-left: 1.2em;
}
.agreement-content ol > li > ol > li > ol > li {
    counter-increment: lvl3;
}
.agreement-content ol > li > ol > li > ol > li::before {
    content: "(" counter(lvl3, lower-alpha) ")";
}

.agreement-content strong,
.agreement-content b {
    font-weight: 700;
    color: var(--jpz-text-color-primary);
}

@media (max-width: 768px) {
    .agreement-card {
        margin: 0 auto;
        padding: 32px 20px;
    }

    .agreement-loading-meta,
    .card-footer {
        grid-template-columns: 1fr;
        display: grid;
        justify-content: initial;
    }

    .meta-item {
        justify-content: space-between;
    }
}
</style>
