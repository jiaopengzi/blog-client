<!--
 * FilePath    : blog-client-dev\src\components\common\wechat-captcha\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 微信公众号获取验证码组件
-->

<template>
    <div v-if="!isVerified" class="wechat-captcha-lock">
        <div class="wechat-captcha-title">关注微信公众号获取验证码</div>
        <div class="wechat-captcha-name">公众号：{{ name }}</div>
        <img v-if="codeurl" class="wechat-captcha-qrcode" :src="codeurl" :alt="`${name} 二维码`" />
        <div class="wechat-captcha-tip">在公众号中回复“{{ reply }}”获取验证码后输入查看隐藏内容。</div>
        <div class="wechat-captcha-form">
            <input v-model="inputCode" class="wechat-captcha-input" type="text" placeholder="请输入验证码" @keydown.enter.prevent="handleVerify" />
            <button type="button" class="wechat-captcha-btn" @click="handleVerify">验证</button>
        </div>
    </div>
    <div
        v-else
        :ref="
            (el) => {
                if (el) setContentRef(el as HTMLElement)
            }
        "
        class="wechat-captcha-content"
        v-html="hiddenHtml"
    ></div>
</template>

<script setup lang="ts">
import { mountVideoPlayerOnCustomElements } from "@/customElementsMount/VideoPlayer"
import { Names } from "@/customElements/registerCustomElements"
import { MessageUtil } from "@/utils/message"
import { nextTick, onMounted, ref, watch } from "vue"

defineOptions({ name: "WechatCaptcha" })

const {
    name = "",
    codeurl = "",
    verifyKey = "",
    reply = "",
    hiddenHtml = "",
    postId = "",
} = defineProps<{
    name?: string
    codeurl?: string
    verifyKey?: string
    reply?: string
    hiddenHtml?: string
    postId?: string
}>()

const inputCode = ref("")
const isVerified = ref(false)
const contentRef = ref<HTMLElement | null>(null)

const setContentRef = (el: HTMLElement | null) => {
    contentRef.value = el
}

/**
 * @description: 基于文章 ID 生成验证码缓存 key, 避免不同文章复用同一验证码时串数据.
 * @return {string} 文章级缓存 key, 若 postId 缺失则返回空字符串.
 */
const getStorageKey = (): string => {
    if (!postId.trim()) return ""
    return `wechat-captcha:${postId}`
}

/**
 * @description: 读取当前文章的验证码缓存状态.
 * @return {boolean} 当前文章是否已完成验证.
 */
const getCachedVerifiedState = (): boolean => {
    const storageKey = getStorageKey()
    if (!storageKey) return false
    return localStorage.getItem(storageKey) === "verified"
}

/**
 * @description: 缓存当前文章的验证成功状态.
 * @return {void}
 */
const cacheVerifiedState = (): void => {
    const storageKey = getStorageKey()
    if (!storageKey) return
    localStorage.setItem(storageKey, "verified")
}

const mountNestedCustomElements = (): void => {
    if (!contentRef.value) return

    mountVideoPlayerOnCustomElements(contentRef.value, Names.VideoPlayer)
}

/**
 * @description: 校验用户输入的验证码, 成功后解锁并缓存当前文章状态.
 * @return {void}
 */
const handleVerify = (): void => {
    if (inputCode.value.trim() === verifyKey.trim()) {
        cacheVerifiedState()
        isVerified.value = true
        return
    }

    inputCode.value = ""
    MessageUtil.error("验证码错误，请重新输入")
}

watch(
    () => isVerified.value,
    async (verified) => {
        if (!verified) return

        await nextTick()
        mountNestedCustomElements()
    },
)

onMounted(() => {
    isVerified.value = getCachedVerifiedState()
})
</script>

<style scoped lang="scss">
.wechat-captcha-lock {
    margin: 24px 0;
    padding: 24px;
    border: 1px dashed #67c23a;
    border-radius: 12px;
    background-color: #f6ffed;
    text-align: center;
}

.wechat-captcha-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #2f5d1b;
}

.wechat-captcha-name {
    margin-bottom: 12px;
    color: var(--jpz-text-color-primary);
}

.wechat-captcha-qrcode {
    width: 180px;
    height: 180px;
    object-fit: cover;
    margin-bottom: 12px;
    border-radius: 8px;
    border: 1px solid #d9ecff;
}

.wechat-captcha-tip {
    margin-bottom: 16px;
    color: var(--jpz-text-color-secondary);
    line-height: 1.6;
}

.wechat-captcha-form {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.wechat-captcha-input {
    width: 260px;
    padding: 10px 12px;
    border: 1px solid #c8d4e3;
    border-radius: 8px;
    outline: none;
}

.wechat-captcha-btn {
    border: none;
    border-radius: 8px;
    padding: 10px 18px;
    background-color: #07c160;
    color: #ffffff;
    cursor: pointer;
}
</style>
