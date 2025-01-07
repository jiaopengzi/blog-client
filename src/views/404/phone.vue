<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-03-13 18:50:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 11:48:07
 * @FilePath     : \blog-client\src\views\404\phone.vue
 * @Description  : 404 页面 phone
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="content">
        <!-- 面包屑 -->
        <div class="breadcrumb">
            <span class="breadcrumb-item breadcrumb-logo">
                <el-icon>
                    <Location />
                </el-icon>
            </span>
            <span class="breadcrumb-item">
                <el-breadcrumb :separator-icon="ArrowRight">
                    <el-breadcrumb-item :to="routeObj.home.path">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>404</el-breadcrumb-item>
                </el-breadcrumb>
            </span>
        </div>

        <!-- 正文内容 -->
        <div class="common-layout">
            <div class="not-found">
                <el-empty description=" ">
                    <h1>404</h1>
                    <p>抱歉，您访问的页面不存在。</p>
                    <p>
                        将在 <span class="countdown">{{ countdown }}</span> 秒后，返回首页。
                    </p>
                </el-empty>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ArrowRight, Location } from "@element-plus/icons-vue"

import { routeObj } from "@/router/routeAll"

defineOptions({ name: "NotFound404Phone" })

const { countdown } = defineProps({
    countdown: Number,
})
</script>
<style scoped lang="scss">
.content {
    // width: pc.$width-page-main;
    display: flex;
    flex-direction: column;
    width: 94vw;
    height: calc(100vh - phone.$height-footer);
}

.breadcrumb-item {
    margin-right: 5px;
}

.breadcrumb-logo {
    color: var(--jpz-color-secondary);
}

.not-found {
    text-align: center;
    padding-top: 100px;
    font-size: 24px;
    color: var(--jpz-color-primary);

    h1 {
        font-size: 100px;
        margin: 0;
        font-weight: 700;
    }

    p {
        margin: 40px 0;

        .countdown {
            color: red;
            font-size: 24px;
            font-weight: 700;
        }
    }
}
</style>
