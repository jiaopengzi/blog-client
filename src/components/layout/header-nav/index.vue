<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 20:51:41
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 22:46:30
 * @FilePath     : \blog-client\src\components\layout\header-nav\index.vue
 * @Description  : 导航栏
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <section class="pc">
        <HeaderNavPC :navData="navData" />
    </section>
    <section class="phone">
        <HeaderNavPhone :navData="navData" />
    </section>
</template>
<script setup lang="ts">
import { IconKeys } from '@/components/common/icons'
import type { HeaderNavPropsItem } from '@/components/layout/header-nav'
import HeaderNavPC from './pc.vue'
import HeaderNavPhone from './phone.vue'
import { routeObj } from '@/router/routeAll'

defineOptions({ name: 'HeaderNav' })

const navData: HeaderNavPropsItem[] = [
    {
        title: '首页',
        path: routeObj.home.path,
    },
    {
        title: '文章',
        path: routeObj.post.path,
        iconKey: IconKeys.article,
    },
    {
        title: '视频课',
        path: routeObj.video.path,
        iconKey: IconKeys.video,
    },
    {
        title: '文档',
        path: routeObj.doc.path,
        iconKey: IconKeys.doc,
    },
    {
        title: '工具下载',
        path: routeObj.tool.path,
        iconKey: IconKeys.tool,
    },
    {
        title: '加入VIP',
        path: routeObj.vip.path,
        iconKey: IconKeys['vip-red'],
        customClass: 'my-icon-red'
    }
]
</script>
<style scoped lang="scss">
:deep(.my-icon-red) {
    fill: rgb(222, 0, 0);
}

// @include respond-to('pc') {
//     .pc {
//         display: flex;
//     }

//     .phone {
//         display: none;
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
</style>