/*
 * FilePath    : blog-client-nuxt\src\customElements\constants.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 自定义元素常量 (Names / Attributes / CustomElementAttributes)
 */

/*
 * 补充说明:
 * 从 registerCustomElements.ts / base.ts 中拆出, 不引用 HTMLElement / customElements,
 * 供服务端同构管线 (utils/markdownRenderer.ts) 安全导入
 */

// 自定义元素名称
export enum Names {
    PayDownload = "pay-download", // 付费下载
    PayRead = "pay-read", // 付费阅读
    PayKey = "pay-key", // 付费密钥
    PayMembership = "pay-membership", // 付费会员
    PayVideo = "pay-video", // 付费视频
    WechatCaptcha = "wechat-captcha",
    LoginView = "login-view", // 登录查看
    VideoPlayer = "video-player", // 视频播放器
    PowerBi = "power-bi", // Power BI 嵌入
}

// 自定义元素属性
export enum Attributes {
    Id = "id", // 元素 id
    Class = "class", // 元素 class
    Name = "name", // 微信验证码等需要的名称
    CodeUrl = "codeurl", // 微信验证码等需要的验证码
    Key = "key", // 微信验证码等需要的 key
    Reply = "reply", // 微信验证码等需要的回复内容
    VideoType = "video-type", // 视频类型
    Poster = "poster", // 视频封面
    Src = "src", // 视频地址
    MaskColor = "maskcolor",
    Title = "title", // 标题
    Description = "description", // 描述
    HasMaterial = "has-material", // 付费视频是否携带资料内容
}

// 自定义元素开放属性
export const CustomElementAttributes: string[] = Object.values(Attributes)
