# blog-client Dockerfile
# 使用官方 Node.js 镜像作为构建环境
FROM node:22.17.0 AS builder

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

# 编译 Vue 项目
RUN pnpm build

# 使用一个较小的基础镜像以减小构建产物的体积
FROM nginx:1.29.0-alpine

# 安装 tzdata 包 设置时区
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone
ENV TZ=Asia/Shanghai

# 更改 Nginx 缓存目录的所有权(修复问题使用非 root 用户来启动容器)
RUN chown -R nginx:nginx /var/cache/nginx

# 更改 /var/run/ 目录的权限 open() "/var/run/nginx.pid" failed (13: Permission denied)
RUN chmod 777 /var/run/

# 将构建产物从 builder 镜像中复制到当前镜像中的 Nginx 的静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置文件到当前镜像的 Nginx 配置文件目录
COPY nginx.conf /etc/nginx/nginx.conf

# 挂载 Nginx 配置文件
VOLUME ["/etc/nginx"]

# 暴露 Nginx 服务的默认端口
EXPOSE 80 443

# 设置启动命令
CMD ["nginx", "-g", "daemon off;"]
