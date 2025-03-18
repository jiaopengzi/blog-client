<!--
 * @FilePath     : \blog-client\src\components\layout\footer\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 底部
-->

<template>
    <footer v-if="isShowFooter">
        <div class="footer-main">
            <div class="footer-l" v-if="footerData.left?.title">
                <h3 class="title">{{ footerData.left?.title }}</h3>
                <p class="content">{{ footerData.left?.content }}</p>
            </div>
            <div class="footer-m" v-if="(footerData.middle ?? []).length > 0">
                <ul>
                    <li class="footer-m-li" v-for="item in footerData.middle" :key="item.imgUrl">
                        <img :src="item.imgUrl" :alt="item.display" />
                        <span>{{ item.display }}</span>
                    </li>
                </ul>
            </div>
            <div class="footer-r" v-if="footerData.right">
                <div class="footer-r-item" v-if="footerData.right?.title">
                    <h3 class="title">{{ footerData.right?.title }}</h3>
                    <p class="content">{{ footerData.right?.content }}</p>
                </div>

                <div class="footer-r-beian footer-r-item">
                    <img v-if="footerData.right?.beian_mps_icon" :src="footerData.right?.beian_mps_icon" />
                    <a :href="footerData.right?.beian_mps_link">{{ footerData.right?.beian_mps_id }}</a>
                </div>

                <div class="footer-r-beian footer-r-item">
                    <img v-if="footerData.right?.beian_miit_icon" :src="footerData.right?.beian_miit_icon" />
                    <a :href="footerData.right?.beian_miit_link">{{ footerData.right?.beian_miit_id }}</a>
                </div>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">
import "./style.scss"

import { useOptionsStore } from "@/stores/options" // 网站配置选项
defineOptions({ name: "LayoutFooter" })

// 获取网站配置选项
const optionsStore = useOptionsStore()
const footerData = optionsStore.getFooterInfo
const isShowFooter = optionsStore.isShowFooter
</script>
