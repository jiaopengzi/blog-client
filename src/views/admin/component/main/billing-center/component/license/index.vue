<!--
 * FilePath    : blog-client-dev\src\views\admin\component\main\billing-center\component\license\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心license信息组件
-->

<template>
    <div class="license-page">
        <section class="license-card">
            <div class="card-decor"></div>
            <header class="card-header">
                <div class="license-hero">
                    <div class="hero-inner">
                        <div class="license-card-title"><span>许可证信息</span></div>
                        <div class="license-card-sub">计费中心 · License</div>
                    </div>
                    <div class="license-card-version">{{ license.version }}</div>
                </div>
            </header>

            <div class="license-card-body">
                <div class="license-content" v-html="license.content"></div>

                <div class="license-meta license-meta-bottom">
                    <div class="meta-item">
                        <span class="label">签发时间</span>
                        <span class="value">{{ license.issued_at || "—" }}</span>
                    </div>
                    <div class="meta-item">
                        <span class="label">最后修改</span>
                        <span class="value">{{ license.modified_at || "—" }}</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
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
/* 计费中心 License 页面样式 */
.license-page {
    padding: 32px 16px;
}
.license-card {
    position: relative;
    max-width: 820px;
    margin: 24px auto;
    border-radius: 20px;
    overflow: visible;
    background: linear-gradient(135deg, #f7fbff 40%, #eef6ff 100%);
    box-shadow: 0 8px 30px rgba(58, 74, 107, 0.08);
    padding: 20px;
    transition:
        box-shadow 0.25s ease,
        transform 0.18s ease;
}
.license-card:hover {
    box-shadow: 0 18px 50px rgba(58, 74, 107, 0.12);
    transform: translateY(-4px);
}
.card-decor {
    position: absolute;
    inset: -30% -10% auto auto;
    width: 280px;
    height: 160px;
    z-index: 0;
    background:
        radial-gradient(circle at 20% 20%, rgba(182, 227, 255, 0.45), transparent 30%),
        radial-gradient(circle at 80% 80%, rgba(106, 141, 246, 0.12), transparent 25%);
    filter: blur(18px);
    pointer-events: none;
}
.card-header {
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    z-index: 1;
    padding: 6px 0 2px 0;
}
.card-icon {
    flex: 0 0 auto;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(106, 141, 246, 0.08);
}
.title-wrap {
    display: flex;
    flex-direction: column;
}
.license-card-title {
    font-size: 1.6rem;
    color: #10203a;
    font-weight: 800;
    letter-spacing: -0.01em;
    position: relative;
    padding-left: 18px;
}
.license-card-title::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 40%;
    background: linear-gradient(180deg, #6a8df6, #b6e3ff);
    border-radius: 2px;
}
.license-card-sub {
    font-size: 0.85rem;
    color: #7a8da6;
    margin-top: 2px;
}
.license-card-version {
    margin-left: auto;
    font-weight: 700;
    font-size: 0.95rem;
    color: #fff;
    background: linear-gradient(90deg, #6a8df6, #4fb3ff);
    padding: 6px 10px;
    border-radius: 999px;
    box-shadow: 0 6px 18px rgba(106, 141, 246, 0.08);
}

.license-card-body {
    position: relative;
    z-index: 1;
    margin-top: 14px;
    background: rgba(255, 255, 255, 0.9);
    padding: 18px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(58, 74, 107, 0.04);
}
.license-meta {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
    margin-bottom: 12px;
}
.license-meta-bottom {
    margin-top: 14px;
    justify-content: flex-end;
}
.meta-item {
    display: flex;
    gap: 8px;
    align-items: center;
}
.meta-item .label {
    color: #6a8df6;
    font-weight: 600;
    font-size: 0.92rem;
}
.meta-item .value {
    color: #324165;
    font-weight: 500;
}

.license-content {
    color: #2b3a5a;
    line-height: 1.8;
    font-size: 1rem;
    font-family: "Source Serif Pro", "PingFang SC", serif;
    word-break: break-word;
}

.license-content h1,
.license-content h2,
.license-content h3 {
    color: #22314a;
}

.license-content p {
    margin: 8px 0;
}

.license-content a {
    color: #2b6df6;
    text-decoration: underline;
}

@media (max-width: 640px) {
    .license-card {
        margin: 12px;
        padding: 14px;
    }
    .license-card-body {
        padding: 12px;
    }
    .card-decor {
        display: none;
    }
}
</style>
