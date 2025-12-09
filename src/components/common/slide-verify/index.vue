<!--
 * @FilePath     : \blog-client\src\components\common\slide-verify\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 滑块验证
-->

<template>
    <div class="page" v-if="show_slide_verify">
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
import "vue3-slide-verify/dist/style.css"

import { storeToRefs } from "pinia"
import { computed, ref, useTemplateRef } from "vue"
import type { SlideVerifyInstance } from "vue3-slide-verify"
import SlideVerify from "vue3-slide-verify"

import { IconKeys } from "@/components/common/icons"
import { useOptionsStore } from "@/stores/options"

defineOptions({ name: "SlideVerify" })

// 拿到华东解锁图片列表
const optionsStore = useOptionsStore()
const { show_slide_verify, slide_verify_imgs } = storeToRefs(optionsStore)

const block = useTemplateRef<SlideVerifyInstance>("block") // 滑块实例
const msg = ref("") // 提示信息
const text = "请向右滑动->" // 滑块提示文字
const accuracy = 1 // 误差值

// 滑块图片列表
const imgs = computed(() => {
    return slide_verify_imgs.value.map((item) => item.imageUrl)
})

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
const onSuccess = async (times: number) => {
    msg.value = `验证通过, 用时${(times / 1000).toFixed(1)}s`
    emit("on-success", true)
    await optionsStore.closeSlideVerify()
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

// 关闭滑块验证 传参
const closeMe = () => {
    emit("on-close", false)
    optionsStore.closeSlideVerify()
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
    background-color: #00000099;
}
</style>
