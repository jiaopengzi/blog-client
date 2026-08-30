#!/bin/sh
# FilePath    : blog-client-nuxt\docker-entrypoint.sh
# Author      : jiaopengzi
# Blog        : https://jiaopengzi.com
# Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
# Description : 容器入口: 单容器双进程编排(node SSR + nginx), 任一进程退出则结束容器

# 设计说明:
# - spa 项目是纯静态文件 + nginx 单进程; nuxt4 迁移后页面由 node SSR 进程实时渲染,
#   最终交付仍要求单容器, 故由本脚本在同一容器内同时拉起 node(127.0.0.1:7364) 与 nginx(80/443);
# - nginx 依赖 node 先就绪(否则启动窗口期页面请求 502), 这里先起 node 并轮询端口就绪后再起 nginx;
# - 监控循环探测任一进程退出即整体退出(退出码交给 docker 重启策略, 避免出现"nginx 活着但页面
#   全 502"的半死状态);
# - 使用 busybox ash 兼容的 POSIX 语法(基础镜像为 nginx:*-alpine)。

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
