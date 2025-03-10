<!--
 * @FilePath     : \blog-client\src\components\layout\footer\phone.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 底部 移动端
-->

<template>
    <footer>
        <div class="footer-main">
            <div class="footer-l">
                <h3>{{ footerData.left?.title }}</h3>
                <p>{{ footerData.left?.content }}</p>
            </div>
            <div class="footer-m">
                <ul>
                    <li class="footer-m-li" v-for="item in footerData.middle" :key="item.imgUrl">
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

                <div>
                    <a href="https://beian.miit.gov.cn/">{{ footerData.right?.beianMIIT }}</a>
                </div>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">
import type { FooterProps } from "./types"

defineOptions({ name: "FooterPhone" })

const { footerData } = defineProps<{ footerData: FooterProps }>()
</script>

<style scoped lang="scss">
footer {
    height: phone.$height-footer;
    background-color: var(--jpz-bg-color-footer);
    display: relative;
    align-items: center;
    justify-content: center;
    // width: calc(phone.$width-page - phone.$scrollbar-y-width);
    // border-top: 1px solid var(--jpz-border-color);
}

.footer-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin: 0;
    color: var(--jpz-text-color-placeholder);
    font-size: 15px;
}

.footer-l {
    width: 100%;
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
        color: var(--jpz-text-color-placeholder);

        :hover {
            background-color: transparent;
        }
    }
}
</style>
