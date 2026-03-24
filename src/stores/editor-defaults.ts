/*
 * FilePath    : blog-client\src\stores\editor-defaults.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : markdown 编辑器插入默认值的存储与构建工具函数
 */

import { LocalStorageKey } from "@/stores/local"

// PowerBI 插入默认值
export interface PowerBiDefaults {
    maskcolor: string
}

// WechatCaptcha 插入默认值
export interface WechatCaptchaDefaults {
    name: string
    codeurl: string
}

// PowerBi 静态回退内容
const POWER_BI_FALLBACK_CONTENT = '<power-bi src="" maskcolor=""></power-bi>'

// WechatCaptcha 静态回退前缀
const WECHAT_CAPTCHA_FALLBACK_PREFIX =
    '\n<wechat-captcha name="您的公众号名称" codeurl="您的公众号二维码链接" key="您在公众号回复用户的验证码" reply="用户需要在公众号回复获取验证码的内容">\n\n'

/**
 * 将 PowerBi 默认值保存到 localStorage.
 * @param defaults - PowerBiDefaults 对象
 */
export function savePowerBiDefaults(defaults: PowerBiDefaults): void {
    localStorage.setItem(LocalStorageKey.EditorDefaultsPowerBi, JSON.stringify(defaults))
}

/**
 * 将 WechatCaptcha 默认值保存到 localStorage.
 * @param defaults - WechatCaptchaDefaults 对象
 */
export function saveWechatCaptchaDefaults(defaults: WechatCaptchaDefaults): void {
    localStorage.setItem(LocalStorageKey.EditorDefaultsWechatCaptcha, JSON.stringify(defaults))
}

/**
 * 从 localStorage 读取 PowerBi 默认值.
 * @returns PowerBiDefaults 或 null(键不存在或解析失败时)
 */
export function loadPowerBiDefaults(): PowerBiDefaults | null {
    const raw = localStorage.getItem(LocalStorageKey.EditorDefaultsPowerBi)
    if (!raw) return null
    try {
        return JSON.parse(raw) as PowerBiDefaults
    } catch {
        return null
    }
}

/**
 * 从 localStorage 读取 WechatCaptcha 默认值.
 * @returns WechatCaptchaDefaults 或 null(键不存在或解析失败时)
 */
export function loadWechatCaptchaDefaults(): WechatCaptchaDefaults | null {
    const raw = localStorage.getItem(LocalStorageKey.EditorDefaultsWechatCaptcha)
    if (!raw) return null
    try {
        return JSON.parse(raw) as WechatCaptchaDefaults
    } catch {
        return null
    }
}

/**
 * 根据默认值构建 power-bi 自定义元素的插入内容字符串.
 * @param defaults - PowerBiDefaults 或 null
 * @returns 插入内容字符串
 */
export function buildPowerBiContent(defaults: PowerBiDefaults | null): string {
    if (defaults !== null) {
        return `<power-bi src="" maskcolor="${defaults.maskcolor}"></power-bi>`
    }
    return POWER_BI_FALLBACK_CONTENT
}

/**
 * 根据默认值构建 wechat-captcha 自定义元素的插入前缀字符串.
 * @param defaults - WechatCaptchaDefaults 或 null
 * @returns 插入前缀字符串
 */
export function buildWechatCaptchaPrefix(defaults: WechatCaptchaDefaults | null): string {
    if (defaults !== null) {
        return `\n<wechat-captcha name="${defaults.name}" codeurl="${defaults.codeurl}" key="您在公众号回复用户的验证码" reply="用户需要在公众号回复获取验证码的内容">\n\n`
    }
    return WECHAT_CAPTCHA_FALLBACK_PREFIX
}

/**
 * 清除 localStorage 中保存的 PowerBi 默认值.
 */
export function clearPowerBiDefaults(): void {
    localStorage.removeItem(LocalStorageKey.EditorDefaultsPowerBi)
}

/**
 * 清除 localStorage 中保存的 WechatCaptcha 默认值.
 */
export function clearWechatCaptchaDefaults(): void {
    localStorage.removeItem(LocalStorageKey.EditorDefaultsWechatCaptcha)
}
