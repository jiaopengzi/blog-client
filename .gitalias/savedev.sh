#!/bin/bash
# FilePath    : go-utils\.gitalias\savedev.sh
# Author      : jiaopengzi
# Blog        : https://jiaopengzi.com
# Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
# Description : 保存 dev 分支的修改并推送到 GitLab

# 设置 Git 别名命令:
# 在 .git/config 文件中添加以下内容：
# [alias]
#     savedev = "!bash ./.gitalias/savedev.sh"
# 运行命令: git savedev "提交信息"


set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否提供了提交信息
if [ $# -eq 0 ]; then
    echo -e "${RED}错误：请提供提交信息${NC}"
    echo -e "${YELLOW}用法：git savedev \"提交信息\"${NC}"
    exit 1
fi

# 获取提交信息
commit_msg="$*"

# 获取当前分支
current_branch=$(git branch --show-current)

# 如果不是 dev 分支，询问是否继续
if [ "$current_branch" != "dev" ]; then
    echo -e "${YELLOW}警告：当前在 $current_branch 分支，而不是 dev 分支${NC}"
    read -p "是否继续在 $current_branch 分支操作？(y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}操作已取消${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}=== 开始保存并推送 ===${NC}"

# 添加所有更改
echo -e "${YELLOW}[1/3] 添加所有更改...${NC}"
git add -A

# 提交更改
echo -e "${YELLOW}[2/3] 提交更改：$commit_msg${NC}"
git commit -m "$commit_msg" || {
    echo -e "${RED}提交失败（可能没有更改）${NC}"
    exit 1
}

# 推送到 GitLab
echo -e "${YELLOW}[3/3] 推送到 GitLab...${NC}"
git push gitlab "$current_branch"

echo -e "${GREEN}=== 完成！已推送到 GitLab/$current_branch ===${NC}"