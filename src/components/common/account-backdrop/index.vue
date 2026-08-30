<!--
 * FilePath    : blog-client-nuxt\src\components\common\account-backdrop\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 账号表单页纯 CSS 背景氛围层 (注册/注册管理员/重置密码/数据库配置)
-->

<!--
 * 补充说明:
 * 设计语言与 components/common/error-hero 同源: 细网格纹理 + 主色/辅色双柔光 + 顶部发丝线,
 * 全部走 --jpz-* 主题变量并带亮色预设(light)回退值, 主题切换(含暗色预设)自动适配;
 * fixed 全屏 + pointer-events:none, 不参与布局与交互; 定位元素会盖住普通流内容,
 * 页面内容卡片需自持 position:relative 保证叠放 (各接入页面已处理)
-->

<template>
    <div class="account-backdrop" aria-hidden="true">
        <div class="account-backdrop__grid" />
        <div class="account-backdrop__glow account-backdrop__glow--primary" />
        <div class="account-backdrop__glow account-backdrop__glow--secondary" />
    </div>
</template>

<script lang="ts" setup>
defineOptions({ name: "AccountBackdrop" })
</script>

<style scoped lang="scss">
// 主题变量回退值与默认亮色预设(light)保持一致, 与 error-hero 的回退策略对齐
.account-backdrop {
    --ab-primary: var(--jpz-color-primary, #1e2858);
    --ab-secondary: var(--jpz-color-secondary, #c89828);

    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
}

// 顶部发丝线: 主色到辅色再到主色的低透明渐变, 收束页面顶边, 视觉上更"设计过"
.account-backdrop::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    opacity: 0.6;
    background: linear-gradient(
        90deg,
        transparent 0%,
        color-mix(in srgb, var(--ab-primary) 55%, transparent) 28%,
        color-mix(in srgb, var(--ab-secondary) 45%, transparent) 50%,
        color-mix(in srgb, var(--ab-primary) 55%, transparent) 72%,
        transparent 100%
    );
}

// 细网格纹理: 与 error-hero__aura 同参数 (48px 网格 + radial mask 边缘淡出), 低透明度仅作层次
.account-backdrop__grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(color-mix(in srgb, var(--ab-primary) 6%, transparent) 1px, transparent 1px),
        linear-gradient(90deg, color-mix(in srgb, var(--ab-primary) 6%, transparent) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 90% 70% at 50% 32%, #000 25%, transparent 72%);
}

// 主题色柔光: 左上主色 / 右下辅色, 大半径 blur 柔化, 静态无动画 (天然满足 reduce-motion)
.account-backdrop__glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);

    &--primary {
        top: -12%;
        left: 4%;
        width: 44%;
        aspect-ratio: 1;
        background: color-mix(in srgb, var(--ab-primary) 13%, transparent);
    }

    &--secondary {
        right: -8%;
        bottom: -18%;
        width: 38%;
        aspect-ratio: 1;
        background: color-mix(in srgb, var(--ab-secondary) 11%, transparent);
    }
}
</style>
