<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 20:51:41
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-26 15:12:20
 * @FilePath     : \blog-client\src\components\layout\header-nav\index.vue
 * @Description  : 导航栏
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="pc">
        <HeaderNavPC :nav-data="navData" />
    </div>
    <div class="phone">
        <HeaderNavPhone :nav-data="navData" />
    </div>
</template>
<script setup lang="ts">
import { IconKeys } from "@/components/common/icons"
import { routeObj } from "@/router/routeAll"

import HeaderNavPC from "./pc.vue"
import HeaderNavPhone from "./phone.vue"
import type { HeaderNavPropsItem } from "./types"

defineOptions({ name: "HeaderNav" })

const navData: HeaderNavPropsItem[] = [
    {
        title: "首页",
        path: routeObj.home.path,
    },
    {
        title: "文章",
        path: routeObj.post.path,
        iconKey: IconKeys.Article,
    },
    {
        title: "视频课",
        path: routeObj.video.path,
        iconKey: IconKeys.Video,
    },
    {
        title: "文档",
        path: routeObj.doc.path,
        iconKey: IconKeys.Doc,
    },
    {
        title: "工具下载",
        path: routeObj.tool.path,
        iconKey: IconKeys.Tool,
    },
    {
        title: "加入VIP",
        path: routeObj.vip.path,
        iconKey: IconKeys.VipRed,
        customClass: "my-icon-red",
    },
]
</script>
<style scoped lang="scss">
// @include respond-to('pc') {
//     .pc {
//         display: flex;
//     }

//     .phone {
//         display: none;
//     }

// }

// @include respond-to('pad') {
//     .pc {
//         display: none;
//     }

//     .phone {
//         display: flex;
//     }
// }

// @include respond-to('phone') {
//     .pc {
//         display: none;
//     }

//     .phone {
//         display: flex;
//     }
// }
:deep(.my-icon-red) {
    fill: rgb(222, 0, 0);
}
</style>
