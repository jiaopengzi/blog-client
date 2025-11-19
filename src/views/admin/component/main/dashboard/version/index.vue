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

const { versionClient, versionServer, getVersion, hasUpdateServer, hasUpdateClient, updateVersionServer, updateVersionClient, fetchChangelog } = useDashboard()

onBeforeMount(async () => {
    await getVersion()
    await fetchChangelog()
})
</script>
<style scoped lang="scss">
.version-container {
    margin-top: 40px;
    font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;

    h4 {
        font-size: 18px;
        font-weight: 600;
        color: var(--jpz-text-color-primary);
        margin-bottom: 10px;
    }

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
    .version-update {
        font-size: 14px;
        color: var(--jpz-text-color-primary);
    }
}
</style>
