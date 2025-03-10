<!--
 * @FilePath     : \blog-client\src\components\layout\footer\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 底部
-->

<template>
    <div class="pc">
        <FooterPC :footer-data="footerData()" />
    </div>
    <div class="phone">
        <FooterPhone :footer-data="footerData()" />
    </div>
</template>
<script setup lang="ts">
import FooterPC from "./pc.vue"
import FooterPhone from "./phone.vue"
import type { FooterProps } from "./types"

defineOptions({ name: "LayoutFooter" })
// 箭头函数返回 约束 FooterProps
const footerData = (): FooterProps => {
    return {
        left: {
            title: "本站简介",
            content: "我们主要玩：Power BI、Power Pivot、Power Query、Power BI Report Server及DAX等相关数据分析的内容。",
        },
        middle: [
            {
                imgUrl: "https://jiaopengzi.com/wp-content/uploads/2020/03/weixin.png",
                display: "微信",
            },
            {
                imgUrl: "https://jiaopengzi.com/wp-content/uploads/2021/11/weixingongzhonghao.png",
                display: "公众号",
            },
            {
                imgUrl: "https://jiaopengzi.com/wp-content/uploads/2021/12/qq1618582.png",
                display: "QQ:1618582",
            },
        ],
        right: {
            title: "焦棚子",
            content: "焦棚子 版权所有",
            beianMPS: "川公网安备 51019002002570号",
            beianMIIT: "蜀ICP备20003928号-1",
        },
    }
}
</script>
<style scoped lang="scss"></style>
