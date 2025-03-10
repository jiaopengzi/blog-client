<!--
 * @FilePath     : \blog-client\src\components\layout\header-nav\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 导航栏
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
import { RouteNames } from "@/router"

import HeaderNavPC from "./pc.vue"
import HeaderNavPhone from "./phone.vue"
import type { HeaderNavPropsItem } from "./types"

defineOptions({ name: "HeaderNav" })

const navData: HeaderNavPropsItem[] = [
    {
        title: "首页",
        name: RouteNames.Home,
    },
    {
        title: "文章",
        name: RouteNames.Post,
        iconKey: IconKeys.Article,
    },
    {
        title: "视频课",
        name: RouteNames.Video,
        iconKey: IconKeys.Video,
    },
    {
        title: "文档",
        name: RouteNames.Doc,
        iconKey: IconKeys.Doc,
    },
    {
        title: "工具下载",
        name: RouteNames.Tool,
        iconKey: IconKeys.Tool,
    },
    {
        title: "加入VIP",
        name: RouteNames.Vip,
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
