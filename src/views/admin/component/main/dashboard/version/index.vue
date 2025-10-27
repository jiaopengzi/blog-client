<!--
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\version\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 版本信息
-->

<template>
    <div class="version-container">
        <div class="version-client">
            <span class="version">client version：{{ versionClient.version }} |</span>
            <span class="commit">commit：{{ versionClient.commit.slice(0, 7) }} |</span>
            <span class="build-time">build time：{{ formatTime(versionClient.buildTime) }}</span>
        </div>
        <div class="version-server">
            <span class="version">server version：{{ versionServer.version }} |</span>
            <span class="commit">commit：{{ versionServer.commit.slice(0, 7) }} |</span>
            <span class="build-time">build time：{{ formatTime(versionServer.build_time) }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onBeforeMount } from "vue"

import { formatTime } from "@/utils/dateTime"

import { useDashboard } from "../hooks"

defineOptions({ name: "DashboardVersion" })

const { versionClient, versionServer, getVersion } = useDashboard()

onBeforeMount(async () => {
    await getVersion()
})
</script>
<style scoped lang="scss">
.version-container {
    font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;

    .version-client,
    .version-server {
        margin: 10px 0;
        display: flex;
        gap: 10px;

        .version,
        .commit,
        .build-time {
            font-size: 14px;
            color: var(--jpz-text-color-secondary);
        }
    }
}
</style>
