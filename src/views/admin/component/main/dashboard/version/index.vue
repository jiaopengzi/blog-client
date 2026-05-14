<!--
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\version\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 版本信息
-->
<template>
    <div class="version-container">
        <h4>版本信息</h4>
        <div class="version-status" v-if="remoteVersionLoading">
            <span class="loading-spinner"></span>
            <span>远端版本检查中...</span>
        </div>
        <div class="version-status version-status-error" v-else-if="remoteVersionError !== ''">
            <span>{{ remoteVersionError }}</span>
        </div>
        <div class="version-client">
            <span class="version">客户端版本：{{ versionClient.version }}</span>
            <!-- <span class="commit">提交哈希：{{ versionClient.commit.slice(0, 7) }} |</span> -->
            <!-- <span class="build-time">构建时间：{{ formatTime(versionClient.buildTime) }}</span> -->
            <span class="version-update" v-if="hasUpdateClient">新版本 {{ updateVersionClient!.version }} 现已可用！</span>
            <!-- <span class="version-update" v-if="hasUpdateClient">{{ updateVersionClient!.date }}</span> -->
        </div>
        <div class="version-server">
            <span class="version">服务端版本：{{ versionServer.version }}</span>
            <!-- <span class="commit">提交哈希：{{ versionServer.commit.slice(0, 7) }} |</span> -->
            <!-- <span class="build-time">构建时间：{{ formatTime(versionServer.build_time) }}</span> -->
            <span class="version-update" v-if="hasUpdateServer">新版本 {{ updateVersionServer!.version }} 现已可用！</span>
            <!-- <span class="version-update" v-if="hasUpdateServer">{{ updateVersionServer!.date }}</span> -->
        </div>
    </div>
</template>
<script setup lang="ts">
import { onBeforeMount } from "vue"

// import { formatTime } from "@/utils/dateTime"
import { useDashboard } from "../hooks"

defineOptions({ name: "DashboardVersion" })

const {
    versionClient,
    versionServer,
    getVersion,
    hasUpdateServer,
    hasUpdateClient,
    updateVersionServer,
    updateVersionClient,
    remoteVersionLoading,
    remoteVersionError,
    fetchChangelog,
} = useDashboard()

onBeforeMount(() => {
    void getVersion()
    void fetchChangelog()
})
</script>
<style scoped lang="scss">
.version-container {
    margin-top: 48px;
    margin-bottom: 48px;
    font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;

    h4 {
        font-size: 16px;
        font-weight: 600;
        color: var(--jpz-text-color-primary);
        margin-bottom: 16px;
        padding-left: 12px;
        border-left: 4px solid var(--jpz-text-color-primary);
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }

    .version-status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 12px;
        color: var(--jpz-text-color-secondary);
    }

    .version-status-error {
        color: var(--jpz-warning-color, #c27803);
    }

    .version-client,
    .version-server {
        margin: 6px 0;
        display: flex;
        align-items: center;
        gap: 16px;

        .version,
        .commit,
        .build-time {
            font-size: 14px;
            color: var(--jpz-text-color-secondary);
        }
    }

    .version-update {
        font-size: 12px;
        font-weight: 600;
        color: var(--jpz-text-color-primary);
        margin-left: 4px;
    }

    .loading-spinner {
        width: 12px;
        height: 12px;
        border: 2px solid color-mix(in srgb, var(--jpz-text-color-secondary) 20%, transparent);
        border-top-color: var(--jpz-text-color-primary);
        border-radius: 50%;
        animation: dashboard-version-spin 0.8s linear infinite;
    }
}

@keyframes dashboard-version-spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
