/**
 * FilePath    : blog-client\src\utils\cssExample.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义样式 CSS 示例
 */

const DEFAULT_CSS_EXAMPLE_PREVIEW_SELECTOR = "#preview"

const THEME_CSS_EXAMPLE = `
/******************** 网站主题样式开始 ******************/

/**
 * 默认浅色主题的主色调副色调, 不影响 github, vue, tokyonight 等预设
 */
html[data-theme="light"] {
  --jpz-color-primary: #1e2858;
  --jpz-color-secondary: #c89828;
}

/**
 * 默认暗色主题的主色调副色调, 不影响 github, vue, tokyonight 等预设
 */
html[data-theme="dark"] {
  --jpz-color-primary: #c89828;
  --jpz-color-secondary: #bb1818;
}

/**
 * 浅色和暗色主题共用的基础变量.
 * 如果你只想统一调整背景, 文字, 边框, 表格等通用外观, 主要修改这一段即可.
 */
html[data-theme="light"],
html[data-theme="dark"] {
  /* 背景色 */
  --jpz-bg-color: var(--el-bg-color);
  --jpz-bg-color-page: var(--el-bg-color-page);
  --jpz-bg-color-footer: var(--el-bg-color);

  /* 边框颜色 */
  --jpz-border-color: var(--el-border-color);
  --jpz-border-color-hover: var(--el-border-color-hover);

  /* 阴影 */
  --jpz-box-shadow-lighter: var(--el-box-shadow-lighter);
  --jpz-box-shadow-light: var(--el-box-shadow-light);

  /* 主文章 hover 阴影 */
  --jpz-post-item-main-hover-shadow: 0 0 5px #ccc, 0 0 10px #ccc;

  /* 文字颜色 */
  --jpz-text-color-primary: var(--el-text-color-primary);
  --jpz-text-color-regular: var(--el-text-color-regular);
  --jpz-text-color-secondary: var(--el-text-color-secondary);
  --jpz-text-color-placeholder: var(--el-text-color-placeholder);
  --jpz-text-color-disabled: var(--el-text-color-disabled);

  /* 代码块 */
  --jpz-code-block-bg-color: var(--el-bg-color-page);
  --jpz-code-block-color: var(--el-bg-color-page);

  /* 行内代码块 */
  --code-bg-color: #dddddd;
  --code-color: #d63200;

  /* 高亮标记 */
  --jpz-mark-bg-color: #fff3bf;
  --jpz-mark-color: var(--jpz-text-color-primary);

  /* 引用块 */
  --jpz-blockquote-border-color: #f66;
  --jpz-blockquote-color: var(--el-text-color-primary);
  --jpz-blockquote-bg-color: var(--el-bg-color-page);

  /* 分割线样式 */
  --horizontal-divider-color: var(--jpz-color-primary);

  /* 表格 */
  --jpz-table-border-color: var(--el-border-color);
  --jpz-table-header-bg-color: var(--el-bg-color-page);
  --jpz-table-bg-color: var(--el-bg-color);
  --jpz-table-n2-bg-color: var(--el-bg-color-page);
  --jpz-table-n2-1-bg-color: var(--el-bg-color);

  /* 脚注上标颜色 */
  --footnote-sup-color: #0969da;

  /* 参考 github markdown 主题 */

  /* note: 主色 rgb(68, 147, 248) => #4493f8 */
  --markdown-alert-note-bg-color: #edf4fe; /* 背景 */
  --markdown-alert-note-border-color: #d0e4fd; /* 边框 */
  --markdown-alert-note-color: #4493f8; /* 文字 */
  --markdown-alert-note-title-color: #4493f8; /* 标题 */
  --markdown-alert-note-svg-fill-color: #4493f8; /* 图标 */

  /* tip: 主色 rgb(63, 185, 80) => #3fb950 */
  --markdown-alert-tip-bg-color: #ebf8ed;
  --markdown-alert-tip-border-color: #cfedd3;
  --markdown-alert-tip-color: #3fb950;
  --markdown-alert-tip-title-color: #3fb950;
  --markdown-alert-tip-svg-fill-color: #3fb950;

  /* important: 主色 rgb(171, 125, 248) => #ab7df8 */
  --markdown-alert-important-bg-color: #f6f2fe;
  --markdown-alert-important-border-color: #eadefd;
  --markdown-alert-important-color: #ab7df8;
  --markdown-alert-important-title-color: #ab7df8;
  --markdown-alert-important-svg-fill-color: #ab7df8;

  /* warning: 主色 rgb(210, 153, 34) => #d29922 */
  --markdown-alert-warning-bg-color: #faf5e8;
  --markdown-alert-warning-border-color: #f3e5c7;
  --markdown-alert-warning-color: #d29922;
  --markdown-alert-warning-title-color: #d29922;
  --markdown-alert-warning-svg-fill-color: #d29922;

  /* caution: 主色 rgb(248, 81, 73) => #f85149 */
  --markdown-alert-caution-bg-color: #feedec;
  --markdown-alert-caution-border-color: #fdd3d1;
  --markdown-alert-caution-color: #f85149;
  --markdown-alert-caution-title-color: #f85149;
  --markdown-alert-caution-svg-fill-color: #f85149;
}
/******************** 网站主题样式结束 ******************/
`

const ARTICLE_CSS_EXAMPLE = `
/******************** 文章模块主题开始 ******************/
/**
 * 文章容器.
 * 这里放的是整篇文章的基础排版变量和默认字号, 列表缩进也统一从这里出发.
 */
#preview {
  --preview-font-family-text: "roboto", "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --preview-font-family-title: "roboto", "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --preview-paragraph-indent: 2em;
  --preview-list-indent-step: 2em;
  --preview-list-marker-column-width: 0.5em;
  --preview-list-text-offset: 1.28em;
  --preview-task-list-icon-width: 1em;

  font-family: var(--preview-font-family-text);
  overflow-x: hidden;
  padding: 0 24px;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 1.75;
  color: var(--jpz-color-primary);
  height: var(--jpz-codemirror-height, 100%);
}

/**
 * 第一个子元素不额外增加顶部留白.
 * 这样文章一开头如果就是标题或段落, 顶部不会显得空一大块.
 */
#preview > :first-child {
  margin-top: 0;
}

/**
 * 各级标题的公共样式.
 * 这里统一标题字体, 颜色和字重, 每一级再单独设置字号和间距.
 */
#preview h1,
#preview h2,
#preview h3,
#preview h4,
#preview h5,
#preview h6 {
  font-family: var(--preview-font-family-title);
  color: var(--jpz-color-primary);
  font-weight: 700;
}

/**
 * 一级标题.
 * 使用居中 + 下边框的处理, 让文章主标题更醒目.
 */
#preview h1 {
  font-size: 2em;
  display: table;
  border-bottom: 2px solid var(--jpz-color-primary);
  text-align: center;
  margin: 1.5em auto 1em;
}

/**
 * 二级标题.
 * 标题下方保留细分割线, 方便区分章节.
 */
#preview h2 {
  font-size: 1.6em;
  margin: 2em 0 0.75em 0;
  padding-bottom: 0.4em;
  border-bottom: 1px solid var(--jpz-border-color);
}

/**
 * 三级标题.
 */
#preview h3 {
  font-size: 1.35em;
  margin: 1.75em 0 0.6em 0;
}

/**
 * 四级标题.
 */
#preview h4 {
  font-size: 1.15em;
  margin: 1.5em 0 0.5em 0;
}

/**
 * 五级和六级标题.
 */
#preview h5,
#preview h6 {
  font-size: 1em;
  margin: 1.25em 0 0.5em 0;
}

/**
 * 加粗.
 */
#preview strong {
  color: var(--jpz-text-color-primary);
  font-weight: 700;
}

/**
 * 斜体.
 */
#preview em {
  color: var(--jpz-text-color-primary);
  font-style: italic;
}

/**
 * 删除线.
 */
#preview del {
  text-decoration: line-through;
}

/**
 * 高亮标记.
 * 对应 Markdown 里的 ==高亮内容== 或自定义 mark 标签效果.
 */
#preview mark {
  background-color: var(--jpz-mark-bg-color);
  color: var(--jpz-mark-color);
  border-radius: 2px;
  padding: 0 2px;
}

/**
 * 有序列表.
 * 这里不再使用浏览器原生数字 marker, 统一改成自绘, 方便和 task list 图标对齐.
 */
#preview ol {
  list-style: none;
  padding-left: var(--preview-paragraph-indent);
  margin: 0.75em 0;
  counter-reset: preview-ordered-list;
}

/**
 * 无序列表.
 * 顶层列表和段落共用同一组缩进基线, 这样列表正文能和普通段落首行对齐.
 */
#preview ul {
  list-style: none;
  padding-left: var(--preview-paragraph-indent);
  position: relative;
  overflow-wrap: break-word;
  margin: 0.75em 0;
  color: var(--jpz-text-color-primary);
}

/**
 * 普通列表项使用固定 marker 列.
 * 这样数字, 圆点和 task list 图标都能落在同一条视觉基线上.
 */
#preview ol > li:not(.task-list-item),
#preview ul > li:not(.task-list-item) {
  position: relative;
  padding-left: var(--preview-list-text-offset);
  line-height: 2em;
  color: var(--jpz-text-color-primary);
}

/**
 * 有序列表项递增计数器.
 */
#preview ol > li:not(.task-list-item) {
  counter-increment: preview-ordered-list;
}

/**
 * 有序列表 marker.
 * 使用固定宽度列来承载数字, 可以避免浏览器默认数字右对齐产生的漂移.
 */
#preview ol > li:not(.task-list-item)::before {
  content: counter(preview-ordered-list) ".";
  position: absolute;
  left: 0;
  top: 0;
  width: var(--preview-list-marker-column-width);
  text-align: right;
  line-height: inherit;
  color: var(--jpz-text-color-primary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/**
 * 一级无序列表 marker.
 */
#preview ul > li:not(.task-list-item)::before {
  content: "";
  position: absolute;
  left: calc(var(--preview-list-marker-column-width) - 0.4em);
  top: 1em;
  width: 0.4em;
  height: 0.4em;
  border-radius: 50%;
  background-color: currentColor;
  transform: translateY(-50%);
}

/**
 * 第二层无序列表 marker.
 * 无论父级是有序还是无序, 这一层都统一用空心圆.
 */
#preview :is(ol, ul) > li > ul > li:not(.task-list-item)::before {
  width: 0.4em;
  height: 0.4em;
  border: 1px solid currentColor;
  border-radius: 50%;
  background-color: transparent;
}

/**
 * 第三层无序列表 marker.
 * 这一层统一改成实心方块, 覆盖混合嵌套列表场景.
 */
#preview :is(ol, ul) > li > :is(ol, ul) > li > ul > li:not(.task-list-item)::before {
  left: calc(var(--preview-list-marker-column-width) - 0.34em);
  width: 0.34em;
  height: 0.34em;
  border: 0;
  border-radius: 0;
  background-color: currentColor;
}

/**
 * 嵌套列表继续使用常规层级缩进.
 */
#preview ol ol,
#preview ol ul,
#preview ul ol,
#preview ul ul {
  padding-left: var(--preview-list-indent-step);
  margin: 0;
}

/**
 * 列表项中的段落取消首行缩进.
 * 这样松散列表里的 p 不会再把 marker 挤歪.
 */
#preview ol li > p,
#preview ul li > p {
  margin: 0;
  text-indent: 0;
}

/**
 * 同一个列表项里如果有多个段落, 后续段落保留自然段间距.
 */
#preview ol li > p + p,
#preview ul li > p + p {
  margin-top: 0.75em;
}

/**
 * task list.
 * 这里和普通列表共用同一组正文偏移, 只是 marker 换成 svg 图标.
 */
#preview .task-list-item {
  list-style-type: none;
  position: relative;
  display: block;
  padding-left: var(--preview-list-text-offset);
  line-height: 2em;
  word-break: break-all;
}

/**
 * task list 前面的勾选图标.
 * 图标绝对定位到 marker 列里, 这样和普通列表的数字或圆点能视觉对齐.
 */
#preview .task-list-item .task-list-icon {
  position: absolute;
  left: 0;
  top: 1em;
  height: var(--preview-task-list-icon-width);
  width: var(--preview-task-list-icon-width);
  flex-shrink: 0;
  transform: translateY(-50%);
  display: block;
}

/**
 * 引用块.
 */
#preview blockquote {
  border-left: 4px solid var(--jpz-blockquote-border-color);
  background-color: var(--jpz-blockquote-bg-color);
  padding: 0.75em 1em;
  margin: 1em 0;
  border-radius: 4px;
}

/**
 * 链接.
 */
#preview a {
  font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
  color: var(--jpz-color-primary);
  text-decoration: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.2rem;
  word-break: break-all;
}

/**
 * 分割线.
 */
#preview hr {
  border: none;
  border-bottom: 1px solid var(--horizontal-divider-color);
  margin: 1.5em 0;
}

/**
 * 上标.
 */
#preview sup {
  vertical-align: super;
  font-size: 0.75em;
}

/**
 * 下标.
 */
#preview sub {
  vertical-align: sub;
  font-size: 0.75em;
}

/**
 * 图片.
 */
#preview img {
  display: block;
  max-width: 100%;
  width: auto;
  margin: 4px auto;
  border-radius: 4px;
  cursor: pointer;
}

/**
 * 带图注的图片容器.
 * 如果你的文章图片支持标题说明, 可以一起修改下面这组样式.
 */
#preview .jpz-image-figure {
  margin: 1em 0;
  text-align: center;
}

#preview .jpz-image-figure .jpz-image-wrapper {
  display: block;
}

#preview .jpz-image-figure .jpz-image-wrapper img {
  display: block;
  max-width: 100%;
  width: auto;
  margin: 0 auto;
  border-radius: 4px;
  cursor: pointer;
}

/**
 * 图片下方的说明文字.
 */
#preview .jpz-image-figure .jpz-image-caption {
  display: block;
  margin-top: 4px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--jpz-text-color-placeholder);
  text-align: center;
}

/**
 * 没有图注时, 让图片上下留白更自然.
 */
#preview .jpz-image-figure--no-caption .jpz-image-wrapper img {
  margin: 4px auto;
}

/**
 * 段落.
 */
#preview p {
  margin: 0.75em 0;
  line-height: 1.8em;
  text-indent: 2em;
  overflow-wrap: break-word;
  color: var(--jpz-text-color-primary);
}

/**
 * 表格容器.
 * 宽表格在小屏上允许横向滚动, 避免把正文撑坏.
 */
#preview .jpz-marked-table-container {
  width: 100%;
  max-height: 400px;
  margin: 1em 0;
  overflow-x: auto;
  overflow-y: auto;
}

#preview .jpz-marked-table-container table {
  border-collapse: collapse;
  border-spacing: 0;
  margin: 1em auto;
  color: var(--jpz-text-color-primary);
}

#preview .jpz-marked-table-container th {
  border: 1px solid var(--jpz-table-border-color);
  background-color: var(--jpz-table-header-bg-color);
  line-height: 2em;
  font-weight: 700;
  color: var(--jpz-text-color-primary);
  padding: 0.5em 0.5em;
}

#preview .jpz-marked-table-container td {
  border: 1px solid var(--jpz-table-border-color);
  padding: 0.5em 0.5em;
  line-height: 1.6em;
}

#preview .jpz-marked-table-container table tr:nth-child(2n) {
  background-color: var(--jpz-table-n2-bg-color);
}

#preview .jpz-marked-table-container table tr:nth-child(2n + 1) {
  background-color: var(--jpz-table-n2-1-bg-color);
}

/**
 * 行内公式和块级公式里的 KaTeX.
 */
#preview .katex {
  color: var(--jpz-text-color-primary);
  padding: 0 4px 0 4px;
}

/**
 * 脚注标题.
 */
#preview .sr-only {
  color: var(--jpz-text-color-primary);
  font-size: 1.5em;
  margin: 0.5em 0 0.5em 0;
  display: block;
  padding-top: 0.5em;
}

/**
 * 脚注引用序号.
 * 文章里点这个小数字, 通常会跳到文末对应的脚注说明.
 */
#preview a[data-footnote-ref] {
  color: var(--footnote-sup-color);
  text-decoration: underline;
  text-underline-offset: 0.2rem;
  font-size: 10.5px;
}

/**
 * Markdown 提示块通用样式.
 * note, tip, warning 这些提示框都会先使用这组基础样式.
 */
#preview .markdown-alert {
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  margin: 1em 0;
}

#preview .markdown-alert p {
  text-indent: 0;
}

/**
 * 提示块标题行.
 * 通常会包含一个图标和标题文字.
 */
#preview .markdown-alert-title {
  display: flex;
  font-weight: 700;
  margin-bottom: 0.5rem;
  align-items: center;
}

#preview .markdown-alert-title svg {
  margin-right: 0.5rem;
}

/**
 * note 提示块.
 */
#preview .markdown-alert-note {
  border: none;
  background-color: var(--markdown-alert-note-bg-color);
}

#preview .markdown-alert-note .markdown-alert-title {
  color: var(--markdown-alert-note-title-color);
}

#preview .markdown-alert-note .markdown-alert-title svg {
  fill: var(--markdown-alert-note-svg-fill-color);
}

#preview .markdown-alert-note p {
  color: var(--markdown-alert-note-color);
}

/**
 * tip 提示块.
 */
#preview .markdown-alert-tip {
  border: 1px solid var(--markdown-alert-tip-border-color);
  background-color: var(--markdown-alert-tip-bg-color);
}

#preview .markdown-alert-tip .markdown-alert-title {
  color: var(--markdown-alert-tip-title-color);
}

#preview .markdown-alert-tip .markdown-alert-title svg {
  fill: var(--markdown-alert-tip-svg-fill-color);
}

#preview .markdown-alert-tip p {
  color: var(--markdown-alert-tip-color);
}

/**
 * important 提示块.
 */
#preview .markdown-alert-important {
  border: 1px solid var(--markdown-alert-important-border-color);
  background-color: var(--markdown-alert-important-bg-color);
}

#preview .markdown-alert-important .markdown-alert-title {
  color: var(--markdown-alert-important-title-color);
}

#preview .markdown-alert-important .markdown-alert-title svg {
  fill: var(--markdown-alert-important-svg-fill-color);
}

#preview .markdown-alert-important p {
  color: var(--markdown-alert-important-color);
}

/**
 * warning 提示块.
 */
#preview .markdown-alert-warning {
  border: 1px solid var(--markdown-alert-warning-border-color);
  background-color: var(--markdown-alert-warning-bg-color);
}

#preview .markdown-alert-warning .markdown-alert-title {
  color: var(--markdown-alert-warning-title-color);
}

#preview .markdown-alert-warning .markdown-alert-title svg {
  fill: var(--markdown-alert-warning-svg-fill-color);
}

#preview .markdown-alert-warning p {
  color: var(--markdown-alert-warning-color);
}

/**
 * caution 提示块.
 */
#preview .markdown-alert-caution {
  color: var(--markdown-alert-caution-color);
  border: 1px solid var(--markdown-alert-caution-border-color);
  background-color: var(--markdown-alert-caution-bg-color);
}

#preview .markdown-alert-caution .markdown-alert-title {
  color: var(--markdown-alert-caution-title-color);
}

#preview .markdown-alert-caution .markdown-alert-title svg {
  fill: var(--markdown-alert-caution-svg-fill-color);
}

#preview .markdown-alert-caution p {
  color: var(--markdown-alert-caution-color);
}

/**
 * details 折叠块.
 */
#preview details {
  margin: 1em 0;
}

/**
 * details 的摘要标题.
 */
#preview summary {
  cursor: pointer;
  font-weight: 500;
  color: var(--jpz-text-color-primary);
}

/**
 * 块级公式里的 KaTeX 容器.
 */
#preview .katex-display > .katex {
  display: inline-block;
}
/******************** 文章模块主题结束 ******************/
`

/**
 * 返回自定义样式 CSS 示例字符串.
 * 该示例用于给用户提供可直接复制和调整的预览样式模板.
 * @param previewSelector 预览根节点选择器, 默认使用主站预览容器.
 * @returns 自定义样式 CSS 示例内容.
 */
export const cssExample = (previewSelector: string = DEFAULT_CSS_EXAMPLE_PREVIEW_SELECTOR): string => {
    const normalizedPreviewSelector = previewSelector.trim() || DEFAULT_CSS_EXAMPLE_PREVIEW_SELECTOR

    return `${THEME_CSS_EXAMPLE}

${ARTICLE_CSS_EXAMPLE}`.replaceAll(DEFAULT_CSS_EXAMPLE_PREVIEW_SELECTOR, normalizedPreviewSelector)
}
