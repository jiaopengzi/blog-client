# blog-client Dockerfile
# 使用官方 Node.js 镜像作为构建环境
FROM node:24.15.0 AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml 到容器中
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm@latest

# 安装依赖项
RUN pnpm install

# 将源代码复制到容器中
COPY . .

# 运行 lint、测试和构建命令
RUN pnpm lint && \
    pnpm test && \
    pnpm build

# 使用一个较小的基础镜像以减小构建产物的体积
FROM nginx:1.30.0-alpine

# 安装 tzdata 包 设置时区
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone
ENV TZ=Asia/Shanghai

# 更改 Nginx 缓存目录的所有权(修复问题使用非 root 用户来启动容器)
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx

# 将构建产物从 builder 镜像中复制到当前镜像中的 Nginx 的静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 从源码中添加 LICENSE 到 html 目录
COPY LICENSE /usr/share/nginx/html/LICENSE

# 复制自定义 Nginx 配置文件到当前镜像的 Nginx 配置文件目录
COPY nginx.conf /etc/nginx/nginx.conf

# 挂载 Nginx 配置文件
VOLUME ["/etc/nginx"]

# 暴露 Nginx 服务的默认端口
EXPOSE 80 443

# 设置启动命令
CMD ["nginx", "-g", "daemon off;"]
