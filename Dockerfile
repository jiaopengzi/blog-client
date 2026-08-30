# blog-client-nuxt Dockerfile
# 构建阶段: Node.js + pnpm 执行 lint/type-check/test/build, 产出 .output(nitro node-server)
# 运行阶段: nginx:1.31.3-alpine(与 spa 项目严格同版本) + 从官方镜像拷贝的 node 二进制,
#           单容器内 nginx(80/443 对外) + node(127.0.0.1:7364 SSR) 双进程, 由 docker-entrypoint.sh 编排

# ============================== 构建阶段 ==============================
# 使用官方 Node.js alpine 镜像作为构建环境(musl; 与运行阶段 nginx:1.31.3-alpine 的 libc 一致,
# 原因见下方运行阶段"仅拷贝 node 二进制"处注释)
FROM node:24.19.0-alpine AS builder

# 配置 pnpm 可执行目录, 确保后续 RUN 层可以直接调用 pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# 设置工作目录
WORKDIR /app

# 复制依赖清单和 pnpm 配置到容器中, 确保 allowBuilds 在镜像内生效
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# 从 package.json 解析 pnpm 版本, 并安装精确版本
RUN PNPM_VERSION="$(node -p 'JSON.parse(require("node:fs").readFileSync("./package.json", "utf8")).packageManager.match(/^pnpm@(.*)$/)[1]')" \
    && npm install -g "pnpm@${PNPM_VERSION}"

# 安装依赖项, 在 Docker 冷缓存环境中信任已提交的 lockfile, 避免 pnpm 的二次供应链复验错误拦截 exclusion.
RUN pnpm install --frozen-lockfile --config.trust-lockfile=true

# 构建期注入后端地址: 使 routeRules 中 /api/** 与 /sitemap* 的 proxy target 固化为容器网络地址
# (与 nginx.conf 的 blog-server:5426 一致, 绕过 nginx 直连 node 端口的流量也能正确转发;
# 运行时可用 docker run -e NUXT_API_BASE=... 覆盖 SSR 直连地址, 但 routeRules 需重建镜像才会变)
ENV NUXT_API_BASE=http://blog-server:5426
# 构建期注入正式站点地址(canonical/SEO 默认值, 运行时同样可被环境变量覆盖)
ENV NUXT_PUBLIC_BASE_URL=https://jiaopengzi.com

# 将源代码复制到容器中(.dockerignore 已排除 node_modules/.git 等本地目录)
COPY . .

# 运行 lint、类型检查、测试和构建命令
# 对齐 spa 流程: spa 的 pnpm lint 是只读检查(不带 --fix), spa 的 pnpm build 内部含 type-check;
# nuxt 的 lint script 带 --fix、build 不含 type-check, 故这里显式用等价命令
RUN pnpm exec oxlint && \
    pnpm type-check && \
    pnpm test && \
    pnpm build

# ============================== 运行阶段 ==============================
# 使用与 spa 项目一致的 nginx alpine 镜像(TLS 终端 + 静态资源 + 反向代理)
FROM nginx:1.31.3-alpine

# 安装 tzdata 包 设置时区; libstdc++/libgcc 为 node 二进制的运行依赖
RUN apk add --no-cache tzdata libstdc++ libgcc && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone
ENV TZ=Asia/Shanghai

# 仅拷贝 node 二进制(不含 npm/pnpm/corepack, 精简体积; 与构建阶段同为 24.19.0 官方 musl 构建)
#
# libc 一致性约束(为什么构建与运行都用 alpine 而不是 slim):
# - nitro 产物 .output/server/node_modules 内含按构建平台解析的原生依赖二进制, 典型如
#   @nuxt/image 图片处理用的 sharp(pnpm 按平台装 @img/sharp-linux*-x64 的 glibc 或 musl 变体);
# - 原生 .node 模块与 node 二进制必须同 libc 才能加载: 构建用 debian 系(glibc/slim)而运行用
#   alpine(musl)时, sharp 会 ERR_DLOPEN_FAILED, /_ipx 缩略图请求全部 500;
# - 本项目依赖树的原生模块均提供 musl 预构建(sharp/rolldown/oxlint/oxfmt/@parcel/watcher,
#   见 pnpm-lock.yaml 的 *-musl 条目; esbuild 为 Go 静态链接二进制, 天然跨 libc), alpine 全链路可行
COPY --from=node:24.19.0-alpine /usr/local/bin/node /usr/local/bin/node

# 更改 Nginx 缓存目录的所有权(修复问题使用非 root 用户来启动容器)
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    mkdir -p /app

# 将 nitro node-server 产物复制到容器中(server: node SSR 进程入口; public: 静态资源)
COPY --from=builder /app/.output /app/.output

# 静态资源同时交给 nginx 直出(保留 spa 的 nginx 静态缓存策略: _nuxt/fonts 长缓存,
# 以及 nitro compressPublicAssets 预压缩产物的 gzip_static 直发)
COPY --from=builder /app/.output/public /usr/share/nginx/html

# 从源码中添加 LICENSE 到 html 目录
COPY LICENSE /usr/share/nginx/html/LICENSE

# 复制自定义 Nginx 配置文件到当前镜像的 Nginx 配置文件目录
COPY nginx.conf /etc/nginx/nginx.conf

# 复制旧网址重定向映射文件(可选, 不需要时可删除此行及 redirects.map 文件)
COPY redirects.map /etc/nginx/redirects.map

# 复制双进程启动脚本(node SSR + nginx, 任一退出容器退出)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# node SSR 运行配置(均可在 docker run -e 覆盖):
# - NITRO_PORT: node 监听端口, 需与 nginx.conf 中 location / 的 proxy_pass 端口一致
# - NUXT_API_BASE: SSR 服务端直连后端地址(docker 服务名, 与 nginx /api/ 代理的 blog-server:5426 一致)
# - NUXT_PUBLIC_BASE_URL: 站点正式地址(canonical/SEO, 经 nginx https 对外)
ENV NITRO_PORT=7364 \
    NUXT_API_BASE=http://blog-server:5426 \
    NUXT_PUBLIC_BASE_URL=https://jiaopengzi.com

# 挂载 Nginx 配置文件(SSL 证书挂 /etc/nginx/ssl)
VOLUME ["/etc/nginx"]

# 暴露 Nginx 服务的默认端口
EXPOSE 80 443

# 设置启动命令
ENTRYPOINT ["/docker-entrypoint.sh"]
