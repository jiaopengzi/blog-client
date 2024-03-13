<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 10:17:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-13 19:19:25
 * @FilePath     : \blog-client\src\components\layout\footer\phone.vue
 * @Description  : 底部 移动端
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <footer>
        <div class="footer-mian">
            <div class="footer-l">
                <h3>{{ footerData.left?.title }}</h3>
                <p>{{ footerData.left?.content }}</p>
            </div>
            <div class="footer-m">
                <ul>
                    <li class="footer-m-li" v-for="(item, index) in footerData.middle" :key="index">
                        <img :src="item.imgUrl" :alt="item.display" />
                        <span>{{ item.display }}</span>
                    </li>
                </ul>
            </div>
            <div class="footer-r">
                <div>
                    <h3>{{ footerData.right?.title }}</h3>
                    <p>{{ footerData.right?.content }}</p>
                </div>

                <div>
                    <a href="https://beian.mps.gov.cn/">{{ footerData.right?.beianMPS }}</a>
                </div>

                <div><a href="https://beian.miit.gov.cn/">{{ footerData.right?.beianMIIT }}</a></div>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">

import { toRefs } from 'vue'
import type { FooterProps } from "@/components/layout/footer";

defineOptions({ name: 'FooterPhone' })

const props = defineProps<{ footerData: FooterProps }>()
const { footerData } = toRefs(props)

</script>

<style scoped lang="scss">
footer {
    height: phone.$height-footer;
    background-color: $background-color-footer;
    display: relative;
    align-items: center;
    justify-content: center;
    z-index: 990;
    width: calc(phone.$width-page - phone.$scrollbar-y-width);
}

.footer-mian {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin: 0;
    color: #eee;
    font-size: 15px;
    background-color: $background-color-footer;
    border-top: 2px solid #ebebeb;
}

.footer-l {
    width: 100%;
    /* 设置合适的行间距值 */
    margin-bottom: 20px;

    h3 {
        text-align: center;
        line-height: 1.5;
        padding-top: 10px;
        margin: 5px 0;
    }

    p {
        text-align: left;
        line-height: 1.5;
        padding: 10px 5%;
    }
}


.footer-m {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;

    img {
        width: 80px;
        height: 80px;
    }

    ul {
        display: flex;
        justify-content: center;
        align-items: center;

        li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 0 20px;

            span {
                margin-top: 5px;
                /* 设置合适的间隙值 */
            }
        }
    }

    h3 {
        margin-bottom: 20px;
        font-weight: 600;
    }
}


.footer-r {
    width: 100%;
    text-align: center;
    margin-top: 3%;
    margin-bottom: 3%;

    h3 {
        margin: 10px 0;
        font-weight: 600;
    }

    p {
        text-align: center;
        line-height: 1.5;
        padding: 10px 5%;
    }

    div {
        margin: 10px 0;
    }

    a {
        color: #eee;

        :hover {
            background-color: transparent;
        }
    }
}
</style>