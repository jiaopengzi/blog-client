/**
 * FilePath    : blog-client-dev\src\utils\cssDemo.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义样式 CSS 示例
 */

// 自定义样式 CSS 示例
export const cssExample = (): string => {
    return `
/*
自定义样式 CSS 示例
注释状态
如需自定义可以将当前注释块删除后进行自定义，注意当前字符串最末尾还有一个结束注释符号。

/******************** 网站主题样式开始 ******************/

/**
 * 浅色主题的主色调副色调
 */
html.light {
  --jpz-color-primary: #1e2858;
  --jpz-color-secondary: #c89828;
}

/**
 * 暗色主题的主色调副色调
 */
html.dark {
  --jpz-color-primary: #c89828;
  --jpz-color-secondary: #bb1818;
}


html {
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
 * 各级标题
 */
#preview h1 {
  font-size: 2em;
  display: table;
  border-bottom: 2px solid var(--jpz-color-primary);
  text-align: center;
  margin: 20px auto;
}

#preview h2 {
  font-size: 1.8em;
  margin: 0.5em 1em 0.5em 0;
}

#preview h3 {
  font-size: 1.5em;
  margin: 0.5em 1em 0.5em 0;
}

#preview h4 {
  font-size: 1.2em;
  margin: 0.5em 1em 0.5em 0;
}

#preview h5,
#preview h6 {
  font-size: 1em;
  margin: 0.5em 1em 0.5em 0;
}

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
 * 有序列表
 */
#preview ol {
  list-style: decimal;
  padding-left: 2em;
}

/**
 * 有序列表子项
 */
#preview ol li {
  line-height: 2em;
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
}

/**
 * 无序列表子项
 */
#preview ul > li {
  list-style-type: disc;
  line-height: 2em;
}

/**
 * 二级无序列表
 */
#preview ul > li > ul > li {
  list-style-type: square;
  line-height: 2em;
}

/**
 * 三级无序列表
 */
#preview ul > li > ul > li > ul > li {
  list-style-type: circle;
  line-height: 2em;
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
 * 上标
 */
#preview sup {
  vertical-align: super;
  font-size: 0.75em;
}

/**
 * 上标
 */
#preview sub {
  vertical-align: sub;
  font-size: 0.75em;
}

/**
 * 下标
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
 * 段落
 */
#preview p {
  margin: 0.5em 0;
  line-height: 1.8em;
  word-break: break-all;
  color: var(--jpz-text-color-primary);
}

/**
 * 表格
 */
#preview .jpz-marked-table-container {
  width: 100%;
  max-height: 400px;
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

#preview a[data-footnote-ref] {
  color: var(--footnote-sup-color);
  text-decoration: underline;
  text-underline-offset: 0.2rem;
  font-size: 10.5px;
}

/**
 * 明细项的摘要
 */
#preview summary {
  cursor: pointer;
  font-weight: 500;
  color: var(--jpz-text-color-primary);
}
/******************** 文章模块主题结束 ******************/

*/

`
}
