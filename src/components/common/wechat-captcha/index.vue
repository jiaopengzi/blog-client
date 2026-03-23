<!--
 * FilePath    : blog-client-dev\src\components\common\wechat-captcha\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 微信公众号获取验证码组件
-->

<template>
    <div v-if="!isVerified" class="wechat-captcha-lock">
        <div class="wechat-captcha-info">
            <div class="wechat-captcha-title">关注微信公众号获取验证码</div>
            <div class="wechat-captcha-name">
                公众号：<span class="wechat-captcha-name-highlight">{{ name }}</span>
            </div>
            <div class="wechat-captcha-tip">
                在公众号中回复“<span class="reply-keyword">{{ reply }}</span
                >”获取验证码后输入查看隐藏内容。
            </div>
            <div class="wechat-captcha-form">
                <input v-model="inputCode" class="wechat-captcha-input" type="text" placeholder="请输入验证码" @keydown.enter.prevent="handleVerify" />
                <button type="button" class="wechat-captcha-btn" @click="handleVerify">验证</button>
            </div>
        </div>
        <div class="wechat-captcha-media">
            <img v-if="codeurl" class="wechat-captcha-qrcode" :src="codeurl" :alt="`${name} 二维码`" />
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
    padding: 32px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 8px;
    background-color: var(--jpz-bg-color);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
}

.wechat-captcha-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.wechat-captcha-media {
    flex-shrink: 0;
}

.wechat-captcha-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--jpz-text-color-primary);
}

.wechat-captcha-name {
    font-size: 14px;
    margin-bottom: 12px;
    color: var(--jpz-text-color-regular);

    .wechat-captcha-name-highlight {
        color: var(--jpz-color-primary);
        font-weight: 600;
    }
}

.wechat-captcha-tip {
    font-size: 14px;
    margin-bottom: 24px;
    color: var(--jpz-text-color-secondary);
    line-height: 1.6;

    .reply-keyword {
        color: var(--jpz-color-primary);
        font-weight: 600;
        margin: 0 4px;
    }
}

.wechat-captcha-qrcode {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid var(--jpz-border-color-lighter);
    box-shadow: var(--jpz-box-shadow-light);
}

.wechat-captcha-form {
    display: flex;
    gap: 12px;
    align-items: center;
    max-width: 400px;
}

.wechat-captcha-input {
    flex: 1;
    padding: 10px 14px;
    font-size: 14px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 6px;
    outline: none;
    color: var(--jpz-text-color-primary);
    background-color: transparent;
    transition: all 0.2s;

    &::placeholder {
        color: var(--jpz-text-color-placeholder);
    }

    &:focus {
        border-color: var(--jpz-color-primary);
    }
}

.wechat-captcha-btn {
    flex-shrink: 0;
    border: none;
    border-radius: 6px;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 500;
    background-color: var(--jpz-color-primary);
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        opacity: 0.9;
    }

    &:active {
        opacity: 0.8;
    }
}

@include respond-to("pad") {
    .wechat-captcha-lock {
        padding: 24px;
        gap: 24px;
    }
}

@include respond-to("phone") {
    .wechat-captcha-lock {
        flex-direction: column-reverse;
        padding: 24px 16px;
        text-align: center;
        gap: 24px;
    }

    .wechat-captcha-info {
        align-items: center;
    }

    .wechat-captcha-form {
        flex-direction: column;
        width: 100%;
        max-width: 100%;
    }

    .wechat-captcha-input {
        width: 100%;
        box-sizing: border-box;
    }

    .wechat-captcha-btn {
        width: 100%;
        box-sizing: border-box;
    }
}
</style>
