<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 10:16:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-10 17:47:54
 * @FilePath     : \blog-client\src\components\layout\footer\pc.vue
 * @Description  : 底部 PC端
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
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
// import { toRefs } from 'vue'
import type { FooterProps } from "@/components/layout/footer"

defineOptions({ name: "FooterPC" })

const props = defineProps<{ footerData: FooterProps }>()
// const { footerData } = toRefs(props)
const { footerData } = props
</script>

<style scoped lang="scss">
footer {
    height: pc.$height-footer;
    background-color: var(--jpz-bg-color);
    display: relative;
    align-items: center;
    justify-content: center;
    z-index: -1;
    width: calc(pc.$width-page - pc.$scrollbar-y-width);

    border-top: 1px solid var(--jpz-border-color);
}

.footer-main {
    width: pc.$width-page-main;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    height: 100%;
    margin: 0 auto;
    color: var(--jpz-text-color-placeholder);
    font-size: 15px;
    flex-grow: 1;
}

// 为 footer-l、footer-m 和 footer-r 添加 flex: 1 三等分
.footer-l,
.footer-m,
.footer-r {
    flex: 1;
}

.footer-l {
    text-align: left;
    padding-top: 40px;
    line-height: 1.2;

    p {
        margin: auto 20px;
    }
}

.footer-m {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

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
}

h3 {
    margin-bottom: 20px;
    font-weight: 600;
    text-align: center;
}

.footer-r {
    text-align: center;
    padding-top: 40px;

    div {
        margin-bottom: 10px;
    }

    a {
        color: var(--jpz-text-color-placeholder);

        :hover {
            background-color: transparent;
        }
    }
}
</style>
