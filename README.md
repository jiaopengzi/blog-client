# blog-client-nuxt

一个基于 Nuxt 4, Vue3 和 TypeScript 构建的博客系统前端(SSR). 它不仅包含公开博客站点, 还覆盖了登录注册, markdown 写作, 评论互动, **付费阅读** **付费下载** **付费视频** **视频播放**, 以及完整的后台管理能力.

由已上线的纯 SPA 项目 [blog-client](https://github.com/jiaopengzi/blog-client) 迁移而来, 页面渲染升级为 SSR + ISR(swr), 交互行为与 SPA 版保持一致.

效果展示：[https://jiaopengzi.com](https://jiaopengzi.com)

## 功能概览

### [🚀点击我！体验在线编辑器](https://jiaopengzi.com/md)

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

- Nuxt 4
- Vue 3
- TypeScript
- Pinia
- Vue Router
- Element Plus
- ofetch
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
pnpm dev          # 开发服务器(端口 7364)
pnpm dev:fresh    # 清理 nuxt 缓存后重新启动
pnpm build        # 生产构建(产出 .output)
pnpm preview      # 本地预览生产构建
pnpm type-check   # vue-tsc 全量类型检查
pnpm lint         # oxlint 检查(--fix)
pnpm fmt          # oxfmt 格式化 src/
pnpm test         # vitest 单次运行
```

## 与后端联调

接口文档需使用 [blog-tool](https://github.com/jiaopengzi/blog-tool) 工具部署后端服务后，在`app.yaml` 中将 `enable_api_doc` 设置为 `true` 开启.

在后端服务启动后，通过访问 `http://your-server-ip:5426/api/v1/docs/index.html` 可以查看接口文档.

当前前端通过相对路径访问后端接口, 统一接口前缀为 `/api`.

- SSR 服务端直连地址由环境变量 `NUXT_API_BASE` 控制(见 `.env`).
- 开发环境 `/api` 代理位于 `nuxt.config.ts` 的 `nitro.devProxy`.
- 请求封装位于 `src/api/request/ofetch.ts`(保持 axios 风格调用签名).

开发模式下, `/api` 与 `/sitemap` 会代理到后端. 如果你本地运行的是自己的后端实例, 需要先把代理目标与 `NUXT_API_BASE` 改成你的本地服务地址.

推荐的本地联调方式:

1. 先启动后端服务.
2. 根据你的本地环境调整 `.env` 中 `NUXT_API_BASE` 与 `nuxt.config.ts` 中 `nitro.devProxy` 的目标地址.
3. 再执行 `pnpm dev` 启动前端.

## 环境变量

项目会读取 Nuxt 惯例的 `NUXT_*` 环境变量(本地开发配置在 `.env`), 构建时由本地模块 `src/modules/set-env-version.ts` 自动生成 `public/VERSION`(git tag, 供外部探活).

常见变量包括:

- `NUXT_API_BASE` — SSR 服务端直连的后端 API 地址
- `NUXT_PUBLIC_BASE_URL` — 正式站点地址(canonical/SEO)
- `NUXT_DOMAIN` — 监听域名或 IP(默认 `0.0.0.0`)
- `NUXT_CLIENT_HTTP_PORT` / `NUXT_CLIENT_HTTPS_PORT` — 前端端口(默认 7364)
- `NUXT_HTTPS_KEY` / `NUXT_HTTPS_CERT` — HTTPS 证书路径(社交登录需要)
- `NITRO_PORT` / `PORT` — `pnpm preview` 的监听端口

## Docker 部署

SPA 版是纯静态文件 + nginx; Nuxt 版页面由 SSR 实时渲染, 因此最终镜像为 **单容器双进程**: `nginx`(80/443, TLS 终端 + 静态资源 + 反向代理) + `node`(`.output/server/index.mjs`, 容器内 `127.0.0.1:7364`, 与开发端口统一), 由 `docker-entrypoint.sh` 编排, 任一进程退出容器即退出.

| 文件 | 作用 |
| --- | --- |
| `Dockerfile` | 完整构建(lint + type-check + test + build), 运行层 `nginx:1.31.3-alpine` + node 二进制 |
| `Dockerfile.env` | 仅安装依赖的基础镜像(`blog-client:env`), 加速迭代构建 |
| `Dockerfile.dev` | 基于 `blog-client:env` 的快速构建(跳过 lint/test) |
| `nginx.conf.template` | nginx 主配置模板, 与 SPA 版保持一致, 仅四处 SSR 必要调整(文件头注释有说明); 域名/后端上游用 `${NGINX_SERVER_NAME}` / `${NUXT_API_BASE}` 占位, 容器启动时由 entrypoint 以 envsubst 白名单替换生成 |
| `redirects.map` | 旧网址 301 重定向映射(可选) |
| `docker-entrypoint.sh` | 容器入口: 先由模板生成 nginx 主配置并 `nginx -t` 校验, node 就绪后启动 nginx, 双进程互相监控 |

镜像内置环境变量(均可在 `docker run -e` 覆盖):

- `NODE_ENV=production` — Node 生产运行标识
- `NITRO_PORT=7364` — node SSR 监听端口(容器内部, 与开发端口统一), 与 `nginx.conf.template` 的 `proxy_pass` 对应
- `NUXT_API_BASE=http://blog-server:5426` — 后端上游地址, 同时供 node SSR 直连与 nginx 代理复用(docker 服务名, 需与后端容器同网络)
- `NUXT_PUBLIC_BASE_URL=https://jiaopengzi.com` — 正式站点地址
- `NGINX_SERVER_NAME=jiaopengzi.com` — nginx `server_name` 域名(模板占位符的默认值)

构建层与运行层统一使用 alpine(musl): 运行层基线 `nginx:1.31.3-alpine` 与 SPA 一致; 且 nitro 产物 `.output/server/node_modules` 内的原生依赖二进制(sharp 等)按构建平台的 libc 打包, 必须与运行时一致, 因此构建层用 `node:24.19.0-alpine`, 运行层从同版本 alpine 镜像拷贝 node 二进制. **勿把构建层换成 slim/debian 系**: glibc 构建出的 sharp 在 musl node 下加载失败(ERR_DLOPEN_FAILED), `/_ipx` 缩略图会全部 500.

健康检查: `GET /nginx-health`(nginx)与 `GET /VERSION`(node 直出, 探活). SSL 证书挂载到 `/etc/nginx/ssl`(cert.pem / cert.key).

nginx 配置验证(需先做与 entrypoint 相同的占位符替换; 示例 NUXT_API_BASE 用 127.0.0.1 避免验证容器解析不了 blog-server 服务名; 验证容器无 ssl 证书, `nginx -t` 报证书文件缺失即代表语法已通过——nginx 先完成配置解析才会去加载证书):

```bash
NGINX_SERVER_NAME=jiaopengzi.com NUXT_API_BASE=http://127.0.0.1:5426 \
sudo docker run --rm -e NGINX_SERVER_NAME -e NUXT_API_BASE \
  -v $(pwd)/nginx.conf.template:/etc/nginx/nginx.conf.template \
  nginx:1.31.3-alpine sh -c "envsubst '\${NGINX_SERVER_NAME} \${NUXT_API_BASE}' \
    < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -t"
```

## 项目结构

```text
blog-client-nuxt/
├─ public/                    # 静态资源与 VERSION 文件
├─ server/                    # nitro 服务端路由与中间件(legacy 重定向 / robots / api 反代兜底)
├─ src/
│  ├─ api/                    # 按领域拆分的接口调用(一接口一文件)
│  ├─ components/             # 通用组件, 编辑器, 播放器等(common/views/editor/layout/player)
│  ├─ composables/            # useSiteOptions / useSeo 等
│  ├─ layouts/                # default / bare-shell
│  ├─ middleware/             # 路由中间件(admin/auth/legacy/setup)
│  ├─ modules/                # 本地 Nuxt 模块(set-env-version)
│  ├─ pages/                  # 文件路由(28 个页面)
│  ├─ pkg/                    # 编辑器, Markdown, HLS 等内置功能模块封装
│  ├─ plugins/                # Nuxt 插件(指令注册 / stores 初始化 / payload 瘦身等)
│  ├─ stores/                 # Pinia 状态管理(显式导入)
│  ├─ theme/                  # 主题域(预设 / 运行时 / 状态 / UI)
│  └─ utils/                  # 通用工具
├─ nuxt.config.ts             # Nuxt 配置(routeRules / nitro / vite)
├─ vitest.config.ts           # Vitest 配置
└─ package.json               # 项目脚本与依赖声明
```

## 架构说明

### 应用启动

Nuxt 接管应用入口, 自动导入已全部关闭(`components: false`, `imports.dirs: []`), 组件 / 工具 / store 一律显式 `import`.

### 渲染策略

路由级渲染策略在 `nuxt.config.ts` 的 `routeRules` 中声明: 公开页走 SSR + ISR(swr), 后台 / 搜索 / 编辑器 / 结算等页面走纯 CSR. 公开页取数统一 `useAsyncData`, 站点配置由 `useSiteOptions()` 共享同一 key 去重.

### 状态管理

项目使用 Pinia. 其中 `src/stores/user.ts` 负责用户登录态与令牌, `src/stores/options.ts` 负责站点配置, 导航, 支付开关, 轮播图, 滑块验证等前台运行时配置. stores 初始化延后到 `onNuxtReady`, 避免 hydration mismatch.

### 请求层

请求统一通过 ofetch 封装(保持 axios 风格签名), 客户端注入 `Bearer` Token, 并实现了 access token 刷新与登录态失效处理逻辑, 便于与后端的认证体系协同工作.

## 适合从哪里开始阅读代码

如果你准备贡献代码, 建议按下面顺序了解项目:

1. `package.json`, 了解脚本与依赖.
2. `nuxt.config.ts`, 了解构建与渲染策略.
3. `src/pages/`, 了解页面组织与路由.
4. `src/stores/`, 了解全局状态来源.
5. `src/api/`, 了解接口组织方式.
6. `src/components/views/admin/`, 了解后台管理功能入口.
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
3. 提交清晰的变更说明, 方便评审理解修改.

## License

MIT
