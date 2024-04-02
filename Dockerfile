# blog-client Dockerfile
# 使用官方 Node.js 镜像作为构建环境
FROM node:20.11.0 as builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml 到容器中
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm@latest

# 安装依赖项
RUN pnpm install --frozen-lockfile

# 将源代码复制到容器中
COPY . .

# 编译 Vue 项目
RUN pnpm build

# 使用一个较小的基础镜像以减小构建产物的体积
FROM nginx:1.24.0-alpine

# 将构建产物从 builder 镜像中复制到当前镜像中的 Nginx 的静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置文件到当前镜像的 Nginx 配置文件目录
COPY nginx.conf /etc/nginx/nginx.conf

# 挂载 Nginx 配置文件
VOLUME ["/etc/nginx"]
VOLUME ["/etc/nginx/ssl"]

# 暴露 Nginx 服务的默认端口
EXPOSE 80

# 设置启动命令
CMD ["nginx", "-g", "daemon off;"]
