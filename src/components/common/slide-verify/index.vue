<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 18:55:56
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-10 14:14:01
 * @FilePath     : \blog-client\src\components\common\slide-verify\index.vue
 * @Description  : 滑块验证
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="page">
        <!-- @touchmove.prevent.stop 阻止触摸事件传播并阻止默认行为。确保滑动验证码不会导致页面滑动。 -->
        <div class="verify-main" @touchmove.prevent.stop>
            <h4>
                <span class="title">拖动下方滑块完成拼图</span>
                <button type="button" class="close-btn" @click="closeMe">
                    <j-icon :name="IconKeys.Close" custom-class="icon-close" />
                </button>
            </h4>

            <slide-verify
                ref="block"
                :l="42"
                :r="10"
                :w="280"
                :h="186"
                :slider-text="text"
                :accuracy="accuracy"
                :show="true"
                :imgs="imgs"
                @again="onAgain"
                @success="onSuccess"
                @fail="onFail"
                @refresh="onRefresh"
            ></slide-verify>
            <div>{{ msg }}</div>
        </div>
        <div class="verify-backdrop"></div>
    </div>
</template>

<script setup lang="ts">
// 引用图标
import "vue3-slide-verify/dist/style.css"

import { ref, useTemplateRef } from "vue"
import type { SlideVerifyInstance } from "vue3-slide-verify"
import SlideVerify from "vue3-slide-verify"

import { IconKeys } from "@/components/common/icons"

defineOptions({ name: "SlideVerify" })

const block = useTemplateRef<SlideVerifyInstance>("block") // 滑块实例
const msg = ref("") // 提示信息
const text = "请向右滑动->" // 滑块提示文字
const accuracy = 1 // 误差值

// 子组件 传参
const emit = defineEmits<{
    (e: "on-close", status: boolean): void
    (e: "on-success", status: boolean): void
}>()

// 重新验证
const onAgain = () => {
    msg.value = "请再试一次吧~"
    // 刷新
    block.value?.refresh()
}

// 验证成功
const onSuccess = (times: number) => {
    msg.value = `验证通过, 用时${(times / 1000).toFixed(1)}s`
    emit("on-success", true)
}

// 验证失败
const onFail = () => {
    msg.value = "验证失败，请重试！"
}

// 刷新
const onRefresh = () => {
    msg.value = "滑块已重置，请重试！"
}

// 点击按钮刷新
// const handleClick = () => {
//     // 刷新
//     block.value?.refresh();
//     msg.value = "";
// };

// 构造图片地址
const baseUrl = "https://image.jiaopengzi.com/slide-verify-images/"
const totalImages = 8 // 图片总数
const imgs = Array.from({ length: totalImages }, (_, index) => {
    return `${baseUrl}${index}.jpg`
})

// 关闭滑块验证 传参
const closeMe = () => {
    emit("on-close", false)
}
</script>

<style lang="scss" scoped>
.verify-main {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 899;

    h4 {
        height: 40px;
        font-size: 16px;
        font-weight: 600;
        color: #333;
        text-align: center;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        background-color: var(--jpz-bg-color);

        .title {
            text-align: center;
            flex-grow: 1;
        }

        .close-btn {
            border: none;
            background-color: transparent;
            cursor: pointer;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;

            .icon-close {
                font-size: 32px;
                fill: #666;
            }
        }
    }
}

.verify-backdrop {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 897;
    background-color: rgba(0, 0, 0, 0.6);
}
</style>
