#!/bin/bash
# FilePath    : blog-client\.gitalias\pr-clean.sh
# Author      : jiaopengzi
# Blog        : https://jiaopengzi.com
# Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
# Description : pr-clean.sh - 删除测试分支

# 设置 Git 别名命令:
# 在 .git/config 文件中添加以下内容：
# [alias]
#     pr-clean = "!bash ./.gitalias/pr-clean.sh"
# 运行命令: git pr-clean <PR_ID>

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ $# -eq 0 ]; then
    echo -e "${RED}错误：请提供 PR ID${NC}"
    echo -e "${YELLOW}用法：git pr-clean <PR_ID>${NC}"
    exit 1
fi

pr_id="$1"
branch_name="test-pr-$pr_id"

echo -e "${YELLOW}=== 清理 PR #$pr_id 测试分支 ===${NC}"

# 检查分支是否存在
if git show-ref --verify --quiet "refs/heads/$branch_name"; then
    # 切换到 dev 分支
    echo -e "${YELLOW}切换到 dev 分支...${NC}"
    git checkout dev
    
    # 删除本地分支
    echo -e "${YELLOW}删除本地分支 $branch_name...${NC}"
    git branch -d "$branch_name"
else
    echo -e "${YELLOW}本地分支 $branch_name 不存在${NC}"
fi

# 删除远程分支
if git ls-remote --exit-code --heads gitlab "$branch_name" &>/dev/null; then
    echo -e "${YELLOW}删除远程分支 gitlab/$branch_name...${NC}"
    git push gitlab --delete "$branch_name"
else
    echo -e "${YELLOW}远程分支 gitlab/$branch_name 不存在${NC}"
fi

echo -e "${GREEN}=== 清理完成 ===${NC}"