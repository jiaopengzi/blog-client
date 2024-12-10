<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 20:56:51
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-10 17:59:16
 * @FilePath     : \blog-client\src\components\layout\header-nav\pc.vue
 * @Description  : 导航栏 pc 端
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="nav">
        <ul>
            <li v-for="item in props.navData" :key="item.path">
                <router-link :to="item.path" class="link">
                    <Icon
                        v-if="item.iconKey"
                        :name="item.iconKey"
                        :custom-class="'my-icon ' + item.customClass"
                    />
                    <span>{{ item.title }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import type { HeaderNavPropsItem } from "@/components/layout/header-nav"

defineOptions({ name: "HeaderNavPC" })

const props = defineProps<{ navData: HeaderNavPropsItem[] }>()
</script>
<style scoped lang="scss">
.nav ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 500px;
    height: 100%;

    li {
        height: 100%;
        text-align: center;
        line-height: 88px;
        font-size: 16px;
        font-weight: 600;
    }
}

.link {
    display: flex;
    align-items: center;
    text-decoration: none;
    padding-left: 8px;
    padding-right: 8px;
    color: var(--el-text-color-primary);

    &:hover {
        background-color: var(--jpz-color-secondary);
    }
}

span {
    display: flex;
    align-items: center;
}

.my-icon {
    font-size: 20px;
    fill: var(--el-text-color-primary);
    margin-right: 4px;
}

// .my-icon-red {
//     fill: rgb(222, 0, 0);
// }
</style>
