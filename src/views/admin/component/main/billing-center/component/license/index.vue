<!--
 * FilePath    : blog-client-dev\src\views\admin\component\main\billing-center\component\license\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心license信息组件
-->

<template>
    <section class="license-page">
        <section class="license-card">
            <div class="license-card-body">
                <div class="license-content" v-html="license.content"></div>
            </div>
            <footer class="card-footer">
                <div class="meta-item">
                    <span class="label">签发时间</span>
                    <span class="value">{{ license.issued_at }}</span>
                </div>

                <div class="meta-item">
                    <span class="label">最后修改</span>
                    <span class="value">{{ license.modified_at }}</span>
                </div>
                <div class="meta-item">
                    <span class="label">版本</span>
                    <span class="value">{{ license.version }}</span>
                </div>
            </footer>
        </section>
    </section>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue"
import type { BillingCenterLicenseRes } from "@/api/billingCenter/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { billingCenterGetLicenseAPI } from "@/api/billingCenter/getLicense"
import { MessageUtil } from "@/utils/message"
import createMarked from "@/pkg/marked/new-marked"
import { formatTime } from "@/utils/dateTime"

defineOptions({ name: "LicensePage" })

// 初始化许可证信息
const license = ref<BillingCenterLicenseRes>({
    version: "",
    content: "",
    issued_at: "",
    modified_at: "",
})

// 获取许可证信息
onBeforeMount(async () => {
    const res = await billingCenterGetLicenseAPI()
    if (res.data.code === ResponseCode.BillingCenterGetLicenseSuccess) {
        const licenseData = res.data.data
        license.value.issued_at = formatTime(licenseData.issued_at, undefined, "YYYY-MM-DD")
        license.value.modified_at = formatTime(licenseData.modified_at, undefined, "YYYY-MM-DD")
        license.value.version = licenseData.version ? `v${licenseData.version}` : ""
        license.value.content = createMarked().parse(licenseData.content).toString()
    } else {
        handleResErr(res.data)
        MessageUtil.error(handleResErr(res), 10000)
    }
})
</script>

<style lang="scss">
.license-page {
    padding: 28px 16px;
    color: var(--jpz-text-color-regular);
    background-color: var(--jpz-bg-color-page);
    font-family: "SimSun", "Songti SC", "Source Serif Pro", "PingFang SC", serif;
}

.license-card {
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

.license-card-body {
    margin-top: 0;
    background-color: transparent;
    padding: 0;
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

.license-content {
    color: var(--jpz-text-color-primary);
    line-height: 2;
    font-size: 1rem;
    word-break: break-word;
    padding: 0;
    background-color: transparent;
    border: none;
}

.license-content h1 {
    font-size: 1.6rem;
    text-align: center;
    margin: 36px 0 24px 0;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--jpz-color-primary);
    letter-spacing: 0.08em;
}

.license-content h2 {
    font-size: 21px;
    margin-top: 28px;
    width: 100%;
}

.license-content h3 {
    font-size: 1.15rem;
    margin: 22px 0 12px 0;
    padding-left: 10px;
    border-left: 3px solid var(--jpz-color-primary-light-3);
}

.license-content h4 {
    font-size: 1.05rem;
    margin: 18px 0 10px 0;
    padding-left: 8px;
    border-left: 2px solid var(--jpz-border-color);
}

.license-content h5,
.license-content h6 {
    font-size: 1rem;
    margin: 14px 0 8px 0;
}

.license-content h1,
.license-content h2,
.license-content h3,
.license-content h4,
.license-content h5,
.license-content h6 {
    color: var(--jpz-text-color-primary);
    font-weight: 700;
    page-break-after: avoid;
}

.license-content p {
    margin: 14px 0;
    text-align: justify;
    line-height: 2;
    // 仅对顶层段落应用首行缩进，避免影响列表内的段落
    text-indent: 2em;
}

.license-content ol {
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
.license-content ol {
    counter-reset: lvl1;
    list-style: none;
    /* 增加左侧内边距，给多字中文编号留出空间，避免错位 */
    padding-left: 3.6em;
}
.license-content ol > li {
    counter-increment: lvl1;
    position: relative;
    margin-bottom: 0.5em;
}
.license-content ol > li::before {
    content: counter(lvl1, cjk-ideographic) "、";
    position: absolute;
    // 将编号区域移入左侧留白并扩大宽度，防止两字编号（如“十一”）换行
    left: -3.6em;
    width: 3em;
    text-align: right;
    white-space: nowrap;
}

// 第二层用阿拉伯数字带括号
.license-content ol > li > ol {
    counter-reset: lvl2;
    margin-left: 1.5em;
}
.license-content ol > li > ol > li {
    counter-increment: lvl2;
}
.license-content ol > li > ol > li::before {
    content: "(" counter(lvl2, decimal) ")";
}

// 第三层可用小写字母带括号
.license-content ol > li > ol > li > ol {
    counter-reset: lvl3;
    margin-left: 1.2em;
}
.license-content ol > li > ol > li > ol > li {
    counter-increment: lvl3;
}
.license-content ol > li > ol > li > ol > li::before {
    content: "(" counter(lvl3, lower-alpha) ")";
}

.license-content strong,
.license-content b {
    font-weight: 700;
    color: var(--jpz-text-color-primary);
}
</style>
