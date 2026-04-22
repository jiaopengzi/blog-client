# blog-client

一个基于 Vue3, Vite 和 TypeScript 构建的博客系统前端. 它不仅包含公开博客站点, 还覆盖了登录注册, markdown 写作, 评论互动, **付费阅读** **付费下载** **付费视频** **视频播放**, 以及完整的后台管理能力.

效果展示：[https://jiaopengzi.com](https://jiaopengzi.com)

## 功能概览

### 面向访客与普通用户

- 浏览首页, 文章列表, 归档页, 独立页面与友情链接页.
- 阅读文章详情, 查看作者信息, 标签分类与文章元数据.
- 评论互动, 点赞, 收藏等内容交互.
- 注册, 登录, 社交登录回调, 重置密码.
- 查看个人中心与公开用户主页.
- 阅读密码保护内容, 购买付费文章或付费视频.
- 使用站内搜索快速定位内容.
- 播放 HLS 视频内容, 支持较完整的媒体展示能力.

### 面向管理员

- 后台仪表盘与基础统计.
- 文章创建, 编辑, 批量管理.
- 分类, 标签, 评论, 用户等管理能力.
- 上传相关配置与资源管理.
- 优惠券, 账单中心, 支付相关管理能力.
- 站点配置, 导航配置, 社交登录配置等系统设置.

### 内容编辑能力

- 内置 Markdown 编辑器.
- 支持工具栏, 实时预览, 目录导航, 主题切换等编辑体验.
- 基于 CodeMirror 扩展了图片上传, Markdown lint, 预览联动等能力.
- 编辑器能力被直接用于后台写文章流程.

## 技术栈

- Vue3
- Vite8
- TypeScript
- Pinia
- Vue Router
- Element Plus
- Axios
- Vitest
- CodeMirror

包管理器以 `pnpm` 为主, 仓库中包含 `pnpm-lock.yaml`.

## 快速开始

### 1. 安装依赖

```bash
pnpm i
```

### 2. 启动开发环境

```bash
pnpm dev
```

### 3. 常用命令

```bash
pnpm dev
pnpm build
pnpm preview
pnpm type-check
pnpm lint
pnpm lint:fix
pnpm test
```

## 与后端联调

接口文档需使用 [blog-tool](https://github.com/jiaopengzi/blog-tool) 工具部署后端服务后，在`app.yaml` 中将 `enable_api_doc` 设置为 `true` 开启.

在后端服务启动后，通过访问 `http://your-server-ip:5426/api/v1/docs/index.html` 可以查看接口文档.

当前前端通过相对路径访问后端接口, 统一接口前缀为 `/api/v1`.

- 路由组定义位于 `src/api/request/routerGroup.ts`.
- 请求封装位于 `src/api/request/axios.ts`.
- 开发环境代理位于 `vite.config.ts`.

开发模式下, Vite 会把 `/api` 代理到 `vite.config.ts` 中配置的目标地址. 如果你本地运行的是自己的后端实例, 需要先把该代理目标改成你的本地服务地址.

推荐的本地联调方式:

1. 先启动后端服务.
2. 根据你的本地环境调整 `vite.config.ts` 中 `/api` 代理目标.
3. 再执行 `pnpm dev` 启动前端.

## 环境变量

项目会读取 Vite 环境变量, 并在启动或构建前通过 `scripts/set-env-version.js` 自动补充版本信息.

常见变量包括:

- `VITE_BASE_URL`
- `VITE_DOMAIN`
- `VITE_CLIENT_HTTP_PORT`
- `VITE_CLIENT_HTTPS_PORT`
- `VITE_HTTPS_KEY`
- `VITE_HTTPS_CERT`
- `VITE_GIT_TAG`
- `VITE_GIT_COMMIT`
- `VITE_BUILD_TIME`

其中 `VITE_GIT_TAG`, `VITE_GIT_COMMIT`, `VITE_BUILD_TIME` 会在执行开发或构建脚本时自动写入 `.env.development` 与 `.env.production`.

## 项目结构

```text
blog-client/
├─ public/                    # 静态资源与 VERSION 文件
├─ scripts/                   # 开发与构建辅助脚本
├─ src/
│  ├─ api/                    # 按领域拆分的接口调用
│  ├─ components/             # 通用组件, 编辑器, 播放器等
│  ├─ pkg/                    # 编辑器, Markdown, HLS 等内置功能模块
│  ├─ router/                 # 路由定义与中间件链路
│  ├─ stores/                 # Pinia 状态管理
│  ├─ views/                  # 页面与后台功能模块
│  └─ main.ts                 # 应用入口
├─ vite.config.ts             # Vite 配置与开发代理
├─ vitest.config.ts           # Vitest 配置
└─ package.json               # 项目脚本与依赖声明
```

## 架构说明

### 应用启动

入口文件为 `src/main.ts`, 负责挂载 Vue 应用, 注册 Pinia, Router, 指令与页面 Head 管理.

### 路由系统

路由定义位于 `src/router/routes.ts`, 路由实例位于 `src/router/router.ts`. 项目采用中间件链的方式统一处理鉴权, 编辑器访问控制, 结算页逻辑, 页面元信息更新等横切逻辑.

### 状态管理

项目使用 Pinia. 其中 `src/stores/user.ts` 负责用户登录态与令牌, `src/stores/options.ts` 负责站点配置, 导航, 支付开关, 轮播图, 滑块验证等前台运行时配置.

### 请求层

请求统一通过 Axios 封装, 并在拦截器中附加 `Bearer` Token. 项目内还实现了 access token 刷新与登录态失效处理逻辑, 便于与后端的认证体系协同工作.

## 适合从哪里开始阅读代码

如果你准备贡献代码, 建议按下面顺序了解项目:

1. `package.json`, 了解脚本与依赖.
2. `src/main.ts`, 了解应用启动流程.
3. `src/router/`, 了解页面组织与中间件机制.
4. `src/stores/`, 了解全局状态来源.
5. `src/api/`, 了解接口组织方式.
6. `src/views/admin/`, 了解后台管理功能入口.
7. `src/components/editor/` 与 `src/components/common/post-upsert/`, 了解文章编辑体验.

## 测试与质量检查

项目已提供基础质量命令:

- `pnpm type-check`
- `pnpm lint`
- `pnpm test`

在提交 PR 之前, 建议至少运行以上命令, 确保类型, 规范与测试状态正常.

## 贡献说明

欢迎提交 Issue 与 PR.

建议贡献流程:

1. Fork 本仓库并创建特性分支.
2. 完成开发后运行类型检查, lint 与测试.
3. 提交清晰的变更说明, 方便评审理解修改目的.

## License

MIT
