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
    text-indent: 2em;
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
    // margin: 28px 0 16px 0;
    margin-top: 28px;
    width: 100%;
    // display: block;
    // border-bottom: 2px solid #cc0000;
    // position: relative;

    // // 底部伪元素（延伸整行）
    // &::after {
    //     position: absolute;
    //     left: 0;
    //     right: 0;
    //     bottom: -2px;
    //     content: "";
    //     border-bottom: 2px solid green;
    // }
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
}

.license-content ul,
.license-content ol {
    margin: 14px 0;
    padding-left: 3em;
    line-height: 2;

    li {
        margin: 8px 0;
        text-indent: 0;

        &::marker {
            color: var(--jpz-color-primary);
            font-weight: bold;
        }
    }
}

.license-content strong,
.license-content b {
    font-weight: 700;
    color: var(--jpz-text-color-primary);
}

.license-content blockquote {
    margin: 16px 0;
    padding: 12px 20px;
    background-color: var(--jpz-bg-color-page);
    border-left: 4px solid var(--jpz-color-primary);
    color: var(--jpz-text-color-secondary);
    font-style: italic;
}

.license-content table {
    width: 100%;
    margin: 20px 0;
    border-collapse: collapse;
    font-size: 0.95rem;

    th,
    td {
        padding: 12px 16px;
        border: 1px solid var(--jpz-border-color);
        text-align: left;
        line-height: 1.8;
    }

    th {
        background-color: var(--jpz-bg-color-page);
        font-weight: 700;
        color: var(--jpz-text-color-primary);
    }

    tr:nth-child(even) {
        background-color: var(--jpz-bg-color-page);
    }
}

.license-content a {
    color: var(--jpz-color-primary);
    text-decoration: none;
    border-bottom: 1px dotted var(--jpz-color-primary);
}

.license-content .signature-area {
    margin-top: 48px;
    padding-top: 24px;
    text-align: right;

    .signer-name {
        font-weight: 700;
        margin-top: 40px;
    }

    .sign-date {
        margin-top: 8px;
        color: var(--jpz-text-color-secondary);
    }
}

@media (max-width: 768px) {
    .license-card {
        margin: 12px;
        padding: 32px 24px;

        &::before {
            height: 3px;
        }
    }
    .license-content {
        font-size: 0.95rem;
    }

    .license-content h1 {
        font-size: 1.4rem;
    }

    .license-content h2 {
        font-size: 1.2rem;
        display: block;
        height: auto;
        line-height: 1.4;
        border-bottom: 2px solid #cc0000;
        padding-bottom: 8px;
    }

    .license-content h3 {
        font-size: 1.1rem;
    }

    .card-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding-top: 20px;
        margin-top: 24px;
    }

    .footer-version {
        margin-top: 8px;
    }
}

@media (max-width: 480px) {
    .license-card {
        padding: 24px 16px;
    }
    .license-content {
        font-size: 0.9rem;
        line-height: 1.9;
    }

    .license-content h1 {
        font-size: 1.25rem;
    }

    .license-content h2 {
        font-size: 1.1rem;
        display: block;
        height: auto;
        line-height: 1.3;
        border-bottom: 2px solid #cc0000;
        padding-bottom: 6px;
    }

    .license-content p {
        margin: 10px 0;
    }
}
</style>
