#!/bin/sh
# FilePath    : blog-client-nuxt\docker-entrypoint.sh
# Author      : jiaopengzi
# Blog        : https://jiaopengzi.com
# Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
# Description : 容器入口: envsubst 白名单生成 nginx 主配置 + 单容器双进程编排(node SSR + nginx),
#               任一进程退出则结束容器

# 设计说明:
# - spa 项目是纯静态文件 + nginx 单进程; nuxt4 迁移后页面由 node SSR 进程实时渲染,
#   最终交付仍要求单容器, 故由本脚本在同一容器内同时拉起 node(127.0.0.1:7364) 与 nginx(80/443);
# - nginx 依赖 node 先就绪(否则启动窗口期页面请求 502), 这里先起 node 并轮询端口就绪后再起 nginx;
# - 监控循环探测任一进程退出即整体退出(退出码交给 docker 重启策略, 避免出现"nginx 活着但页面
#   全 502"的半死状态);
# - nginx 主配置由 nginx.conf.template 在启动时生成(域名/后端上游用环境变量注入, 替换失败
#   或 nginx -t 校验不通过则直接退出, 不进入"起了一半"的状态);
# - 使用 busybox ash 兼容的 POSIX 语法(基础镜像为 nginx:*-alpine, envsubst 来自镜像自带的 gettext)。

set -u

NODE_PID=""
NGINX_PID=""

# 容器终止信号: 优雅停掉两个进程后退出
cleanup() {
    echo "[entrypoint] stopping container services..."
    if [ -n "$NGINX_PID" ]; then
        kill "$NGINX_PID" 2>/dev/null || true
    fi
    if [ -n "$NODE_PID" ]; then
        kill "$NODE_PID" 2>/dev/null || true
    fi
    wait 2>/dev/null || true
    echo "[entrypoint] container services stopped."
    exit 0
}
trap cleanup TERM INT

# 0. 由模板生成 nginx 主配置(放在双进程启动之前, 配置坏则快速失败)
#    envsubst 只替换白名单里的 ${NGINX_SERVER_NAME} / ${NUXT_API_BASE}, 不做全量替换——
#    全量替换会把 $host / $uri / $remote_addr 等 nginx 运行时变量一并替换成空值;
#    官方镜像的 docker-entrypoint.d/20-envsubst-on-templates.sh 机制等价, 但仅官方
#    ENTRYPOINT 启动时触发, 本容器是自定义双进程编排, 故在此显式完成
NGINX_SERVER_NAME="${NGINX_SERVER_NAME:-jiaopengzi.com}"
NUXT_API_BASE="${NUXT_API_BASE:-http://blog-server:5426}"
# 去掉上游地址的全部尾部斜杠: 正则 location 中的 proxy_pass 不允许带 URI 部分,
# 值形如 http://host:port/ 时尾斜杠会让 nginx 拒绝加载配置
NUXT_API_BASE="$(printf '%s' "$NUXT_API_BASE" | sed 's:/*$::')"
if [ -z "$NUXT_API_BASE" ]; then
    echo "[entrypoint] NUXT_API_BASE resolves to empty, abort."
    exit 1
fi
export NGINX_SERVER_NAME NUXT_API_BASE
echo "[entrypoint] rendering nginx.conf (NGINX_SERVER_NAME=${NGINX_SERVER_NAME}, NUXT_API_BASE=${NUXT_API_BASE})..."
envsubst '${NGINX_SERVER_NAME} ${NUXT_API_BASE}' \
    < /etc/nginx/nginx.conf.template \
    > /etc/nginx/nginx.conf

# 启动前校验生成的配置(语法 + 引用文件存在性), 避免带坏配置起 nginx 进入半死状态;
# set -u 只拦未定义变量不拦命令失败, 这里必须显式判断退出
if ! nginx -t; then
    echo "[entrypoint] nginx config check failed, abort."
    exit 1
fi

NITRO_PORT="${NITRO_PORT:-7364}"

# 1. 启动 node SSR 服务(nitro node-server 产物入口)
echo "[entrypoint] starting nuxt node server on 127.0.0.1:${NITRO_PORT}..."
node /app/.output/server/index.mjs &
NODE_PID=$!

# 2. 等待 node 端口就绪(最多 30 秒); 进程中途退出则直接失败退出
#    用 node 自带的 net 模块做 TCP 探测(镜像内必有 node, 不依赖 wget/nc 的发行版差异)
i=0
while [ "$i" -lt 30 ]; do
    if ! kill -0 "$NODE_PID" 2>/dev/null; then
        echo "[entrypoint] node server exited during startup, abort."
        exit 1
    fi

    if node -e "const s=require('node:net').connect(Number(process.env.NITRO_PORT||7364),'127.0.0.1');s.on('connect',()=>{s.destroy();process.exit(0)});s.on('error',()=>process.exit(1));s.setTimeout(1000,()=>{s.destroy();process.exit(1)})" 2>/dev/null; then
        echo "[entrypoint] node server is ready."
        break
    fi

    i=$((i + 1))
    sleep 1
done

# 3. 启动 nginx(前台模式)
echo "[entrypoint] starting nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# 4. 监控循环: 任一服务退出则结束容器
while kill -0 "$NODE_PID" 2>/dev/null && kill -0 "$NGINX_PID" 2>/dev/null; do
    sleep 1
done

echo "[entrypoint] a service exited, shutting down container."
cleanup
