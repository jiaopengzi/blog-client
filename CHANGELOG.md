# Changelog

本文件将记录本项目的所有重要变更。

该格式基于 [Keep a Changelog](https://keepachangelog.com),
本项目遵循 [语义化版本控制](https://semver.org/spec/v2.0.0.html)。

## [v1.1.1] - 2026-09-16

### ⚡️ Perf

- 减少不必要的日志噪音

### 🐞 Fix

- 在编辑器包含 power-bi 组件 管理后台的侧边栏宽度意外变化对齐 SPA
- 文章详情页面包屑进入首页轮播图图片加载失败
- swr 缓存没有限制造成的内存泄漏
- TypeError: e.classList.has is not a function
- tag 生成后未及时更新 `public\VERSION`
- 媒体编辑页面当视频上一个下一个没有更新视频，选择了字幕文件立即触发校验
- 浏览刷新登录态的视频水印同步使用用户名

### 📦 Build

- 依赖升级

### ✨ Feat

- 增加文章浏览量统计的日期维度

## [v1.1.0] - 2026-09-04

### ♻️ Refactor

- 使用 Nuxt4 从 SPA 迁移到 SSR 优化 SEO
- **v1.0.1以下的 nginx 配置不再适用，需升级到 v1.1.0 以上版本**

## [v1.0.1] - 2026-08-12

### 🐞 Fix

- 补全引用的拓展名

### 📦 Build

- 升级依赖 node 24.19.0

## [v1.0.0] - 2026-08-02

### Initial release

- 生产环境首次发布.
