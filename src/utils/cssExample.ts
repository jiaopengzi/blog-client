/**
 * FilePath    : blog-client\src\utils\cssExample.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义样式 CSS 示例
 */

const DEFAULT_CSS_EXAMPLE_PREVIEW_SELECTOR = "#preview"

/**
 * 返回自定义样式 CSS 示例字符串.
 * 该示例用于给用户提供可直接复制和调整的预览样式模板.
 * @param previewSelector 预览根节点选择器, 默认使用主站预览容器.
 * @returns 自定义样式 CSS 示例内容.
 */
export const cssExample = (previewSelector: string = DEFAULT_CSS_EXAMPLE_PREVIEW_SELECTOR): string => {
    const normalizedPreviewSelector = previewSelector.trim() || DEFAULT_CSS_EXAMPLE_PREVIEW_SELECTOR

    return `
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

/******************** 文章模块主题开始 ******************/
/**
 * 文章容器
 */
#preview {
  font-family: "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
  overflow-x: hidden;
  padding: 0 20px;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 1.5;
  color: var(--jpz-color-primary);
  height: var(--jpz-codemirror-height, 100%);
}

/**
 * 第一个子元素不额外增加顶部留白.
 * 这样文章一开始如果就是标题或段落, 顶部不会显得空一大块.
 */
#preview > :first-child {
  margin-top: 0;
}

/**
 * 各级标题
 */
#preview h1,
#preview h2,
#preview h3,
#preview h4,
#preview h5,
#preview h6 {
  font-family: "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
  color: red;
  font-weight: 700;
  padding-bottom: 2px;
}

/**
 * 一级标题单独增强显示效果.
 * 这里额外设置了居中, 下边框和更大的字号, 让文章主标题更醒目.
 */
#preview h1 {
  font-size: 2em;
  display: table;
  border-bottom: 2px solid var(--jpz-color-primary);
  text-align: center;
  margin: 20px auto;
}

/**
 * 二级到六级标题共用外边距.
 * 这样可以把标题之间的上下留白统一管理, 后面每一级只需要关心自己的字号.
 */
#preview h2,
#preview h3,
#preview h4,
#preview h5,
#preview h6 {
  margin: 0.5em 1em 0.5em 0;
}

#preview h2 {
  font-size: 1.8em;
}

#preview h3 {
  font-size: 1.5em;
}

#preview h4 {
  font-size: 1.2em;
}

#preview h5,
#preview h6 {
  font-size: 1em;
}

/**
 * 加粗
 */
#preview strong {
  color: var(--jpz-text-color-primary);
  font-weight: 700;
}

/**
 * 斜体
 */
#preview em {
  color: var(--jpz-text-color-primary);
  font-style: italic;
}

/**
 * 删除线
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
 * 有序列表
 */
#preview ol {
  list-style: decimal;
  padding-left: 2em;
  margin: 0.75em 0;
}

/**
 * 有序列表子项
 */
#preview ol li {
  color: var(--jpz-text-color-primary);
}

/**
 * 无序列表
 */
#preview ul {
  padding-left: 2em;
  position: relative;
  word-break: break-all;
  color: var(--jpz-text-color-primary);
  margin: 0.75em 0;
}

/**
 * 统一所有列表项的行高.
 * 包括有序列表, 无序列表以及更深层级的子列表, 避免每一级都重复写同样的间距.
 */
#preview ol li,
#preview ul > li,
#preview ul > li > ul > li,
#preview ul > li > ul > li > ul > li {
  line-height: 2em;
}

/**
 * 无序列表子项
 */
#preview ul > li {
  list-style-type: disc;
}

/**
 * 二级无序列表
 */
#preview ul > li > ul > li {
  list-style-type: square;
}

/**
 * 三级无序列表
 */
#preview ul > li > ul > li > ul > li {
  list-style-type: circle;
}

/**
 * 嵌套列表不再额外增加外边距.
 * 这样多层列表会更紧凑, 不会越嵌套越松散.
 */
#preview ol ol,
#preview ol ul,
#preview ul ol,
#preview ul ul {
  margin: 0;
}

/**
 * 任务列表
 */
#preview .task-list-item {
  list-style-type: none;
  display: flex;
  align-items: center;
  word-break: break-all;
  margin-left: -1.5em;
}

/**
 * 任务列表前面的勾选图标.
 * 这里固定图标大小和右侧间距, 避免图标和文本贴得太近.
 */
#preview .task-list-item .task-list-icon {
  height: 1em;
  width: 1em;
  flex-shrink: 0;
  vertical-align: middle;
  margin-right: 0.5em;
  display: inline-block;
}

/**
 * 引用
 */
#preview blockquote {
  border-left: 4px solid var(--jpz-blockquote-border-color);
  background-color: var(--jpz-blockquote-bg-color);
  padding: 0.5em 1em;
  margin: 0.5em 0;
  border-radius: 4px;
}

/**
 * 链接
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
 * 分割线
 */
#preview hr {
  border: none;
  border-bottom: 1px solid var(--horizontal-divider-color);
  margin: 1em 0;
}

/**
 * 上标和下标共用字号.
 * 这样脚注序号, 化学式, 数学公式里的小字会统一缩小显示.
 */
#preview sup,
#preview sub {
  font-size: 0.75em;
}

/**
 * 上标
 */
#preview sup {
  vertical-align: super;
}

/**
 * 下标
 */
#preview sub {
  vertical-align: sub;
}

/**
 * 图片
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
  margin: 0.5em 0;
  line-height: 1.8em;
  text-indent: 2em;
  word-break: break-all;
  color: var(--jpz-text-color-primary);
}

/**
 * 表格
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
  line-height: 1em;
}

#preview .jpz-marked-table-container table tr:nth-child(2n) {
  background-color: var(--jpz-table-n2-bg-color);
}

#preview .jpz-marked-table-container table tr:nth-child(2n+1) {
  background-color: var(--jpz-table-n2-1-bg-color);
}

/**
 * 公式
 */
#preview .katex {
  color: var(--jpz-text-color-primary);
  padding: 0 4px 0 4px;
}

/**
 * 脚注
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
 * Markdown 警告提示块的通用容器.
 * note, tip, warning 这些提示框都会先使用这组基础样式.
 */
#preview .markdown-alert {
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  margin: 1em 0;
}

#preview .markdown-alert p {
  /*首行不缩进*/
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
  background-color: var(--markdown-alert-note-bg-color);
  border: 1px solid var(--markdown-alert-note-border-color);
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
  background-color: var(--markdown-alert-tip-bg-color);
  border: 1px solid var(--markdown-alert-tip-border-color);
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
  background-color: var(--markdown-alert-important-bg-color);
  border: 1px solid var(--markdown-alert-important-border-color);
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
  background-color: var(--markdown-alert-warning-bg-color);
  border: 1px solid var(--markdown-alert-warning-border-color);
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
  background-color: var(--markdown-alert-caution-bg-color);
  border: 1px solid var(--markdown-alert-caution-border-color);
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
 * details 折叠块容器.
 * 点击 summary 后, 这里会展开或收起详细内容.
 */
#preview details {
  margin: 1em 0;
}

/**
 * 明细项的摘要
 */
#preview summary {
  cursor: pointer;
  font-weight: 500;
  color: var(--jpz-text-color-primary);
}

/**
 * 块级公式里的 KaTeX 容器.
 * 让大公式也按块显示, 避免布局异常.
 */
#preview .katex-display > .katex {
  display: inline-block;
}
/******************** 文章模块主题结束 ******************/

`.replaceAll(DEFAULT_CSS_EXAMPLE_PREVIEW_SELECTOR, normalizedPreviewSelector)
}
