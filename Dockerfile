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
# (与 nginx 模板的 NUXT_API_BASE 默认值一致, 绕过 nginx 直连 node 端口的流量也能正确转发;
# 运行时可用 docker run -e NUXT_API_BASE=... 覆盖 SSR 直连地址与 nginx 代理上游, 但 routeRules 需重建镜像才会变)
ENV NUXT_API_BASE=http://blog-server:5426
# 构建期注入正式站点地址(canonical/SEO 默认值, 运行时同样可被环境变量覆盖)
ENV NUXT_PUBLIC_BASE_URL=https://jiaopengzi.com

# 将源代码复制到容器中(.dockerignore 已排除 node_modules/.git 等本地目录)
COPY . .

# 运行 lint、类型检查、测试和构建命令
# 对齐 spa 流程: spa 的 pnpm lint 是只读检查(不带 --fix), spa 的 pnpm build 内部含 type-check;
# nuxt 的 lint script 带 --fix、build 不含 type-check, 故这里显式用等价命令
# LICENSE 先复制进 public/, 由 nitro 构建自然带入产物(nginx 静态 root 目录可直出);
# build 后把 public 从 .output 挪出: 镜像里静态资源只保留一份(见运行阶段 symlink 说明)
# 末尾同层清理 .nuxt 与构建缓存(层 diff 只留产物, 与 Dockerfile.dev 的 bugfix 260830-04 同因:
# 缩小单层落盘量, 避免磁盘紧张的 runner 在 buildkit 提交层时 EIO)
RUN cp LICENSE public/LICENSE && \
    pnpm exec oxlint && \
    pnpm type-check && \
    pnpm test && \
    pnpm build && \
    mv .output/public /output-public && \
    rm -rf .nuxt node_modules/.cache node_modules/.vite

# ============================== 运行阶段 ==============================
# 使用与 spa 项目一致的 nginx alpine 镜像(TLS 终端 + 静态资源 + 反向代理)
FROM nginx:1.31.3-alpine

# 运行阶段依赖: tzdata(时区数据), libstdc++/libgcc(node 二进制的运行时库);
# 同层完成: 时区固定上海 + nginx 缓存目录属主(支持非 root 启动) + 清理镜像自带死文件
# (conf.d/default.conf: 本镜像主配置不 include conf.d; /usr/share/nginx/html 欢迎页:
#  先清空, 稍后只填入构建产物 public, 保证目录内无历史残留——外围工具 blog-tool 依赖该目录)
RUN apk add --no-cache tzdata libstdc++ libgcc && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    mkdir -p /app && \
    rm -f /etc/nginx/conf.d/default.conf && \
    rm -rf /usr/share/nginx/html
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

# 将 nitro node-server 产物复制到容器中(server: node SSR 进程入口; public 已在构建层挪出,
# 静态资源只在镜像中保留 html 一份)
COPY --from=builder /app/.output /app/.output

# 静态资源交给 nginx 直出(保留 spa 的 nginx 静态缓存策略: _nuxt/fonts 长缓存,
# 以及 nitro compressPublicAssets 预压缩产物的 gzip_static 直发);
# html 目录已在上方 apk 层清空, 这里只填入构建产物(LICENSE 已随构建期 cp 进入 public)
COPY --from=builder /output-public /usr/share/nginx/html

# .output/public 必须存在但改为指向 html 的 symlink(单份省 ~13MB):
# - node SSR 的 serveStatic 依赖 .output/public 服务未被 nginx 静态正则拦截的文件
#   (VERSION 探活 / LICENSE / _payload.json 等, 实测移除即 500);
# - symlink 让 node 与 nginx 共读同一份数据, 两个路径内容永远一致;
# - nitro 运行时回写(如 payload 落盘 / favicon.ico 镜像同步, 见 server/utils/favicon.ts)
#   经 symlink 写入 html 目录. 容器可能以 nginx 用户运行, 因此静态目录必须由 nginx 用户持有,
#   否则保存 app-option 时 favicon/logo 同步会因 EACCES 失败(260901-01 bug03).
RUN ln -s /usr/share/nginx/html /app/.output/public && \
    chown -R nginx:nginx /usr/share/nginx/html

# 复制 nginx 主配置模板(占位符 ${NGINX_SERVER_NAME} / ${NUXT_API_BASE} 由
# docker-entrypoint.sh 启动时 envsubst 白名单替换生成 /etc/nginx/nginx.conf)
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# 复制旧网址重定向映射文件(可选, 不需要时可删除此行及 redirects.map 文件)
COPY redirects.map /etc/nginx/redirects.map

# 复制双进程启动脚本(node SSR + nginx, 任一退出容器退出; --chmod 免去单独的 chmod 层)
COPY --chmod=755 docker-entrypoint.sh /docker-entrypoint.sh

# 运行配置(均可在 docker run -e 覆盖):
# - NODE_ENV: Node 生产运行标识, 避免依赖按开发环境分支执行
# - NITRO_PORT: node 监听端口, 需与 nginx.conf.template 中 location / 的 proxy_pass 端口一致
# - NUXT_API_BASE: 后端上游地址, 同时供 node SSR 直连与 nginx 代理复用(单一来源保证一致;
#   默认 docker 服务名, 需与后端容器在同一自定义网络)
# - NUXT_PUBLIC_BASE_URL: 站点正式地址(canonical/SEO, 经 nginx https 对外)
# - NGINX_SERVER_NAME: nginx server_name 域名(模板占位符的默认值)
ENV NODE_ENV=production \
    NITRO_PORT=7364 \
    NUXT_API_BASE=http://blog-server:5426 \
    NUXT_PUBLIC_BASE_URL=https://jiaopengzi.com \
    NGINX_SERVER_NAME=jiaopengzi.com

# 挂载 Nginx 配置文件(SSL 证书挂 /etc/nginx/ssl)
VOLUME ["/etc/nginx"]

# 暴露 Nginx 服务的默认端口
EXPOSE 80 443

# 设置启动命令
ENTRYPOINT ["/docker-entrypoint.sh"]
