<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-03-13 18:50:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 18:02:26
 * @FilePath     : \blog-client\src\views\404\pc.vue
 * @Description  : 404 页面 pc
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
                        将在 <span class="countdown">{{ props.countdown }}</span> 秒后，返回首页。
                    </p>
                </el-empty>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ArrowRight, Location } from "@element-plus/icons-vue"
import { routeObj } from "@/router/routeAll"

defineOptions({ name: "NotFound404PC" })
const props = defineProps({
    countdown: Number,
})
</script>
<style scoped lang="scss">
.content {
    width: pc.$width-page-main;
    display: flex;
    flex-direction: column;
    height: calc(100vh - pc.$height-footer);
}

.breadcrumb {
    width: pc.$width-page-main;
    height: 40px;
    color: #333;
    border: 0;
    margin: 0;
    margin-top: pc.$height-header;
    padding: 0;
    vertical-align: baseline;
    display: flex;
    align-items: center;
}

.breadcrumb-item {
    margin-right: 5px;
}

.breadcrumb-logo {
    color: $secondary-color;
}

.not-found {
    text-align: center;
    padding-top: 100px;
    font-size: 24px;
    color: $primary-color;

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
