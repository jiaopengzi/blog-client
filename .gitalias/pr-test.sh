#!/bin/bash
# FilePath    : blog-client\.gitalias\pr-test.sh
# Author      : jiaopengzi
# Blog        : https://jiaopengzi.com
# Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
# Description : pr-test.sh - 拉取 GitHub PR 并推送到 GitLab 测试

# 设置 Git 别名命令:
# 在 .git/config 文件中添加以下内容：
# [alias]
#     pr-test = "!bash ./.gitalias/pr-test.sh"
# 运行命令: git pr-test <PR_ID>


set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查参数
if [ $# -eq 0 ]; then
    echo -e "${RED}错误：请提供 PR ID${NC}"
    echo -e "${YELLOW}用法：git pr <PR_ID>${NC}"
    echo -e "${YELLOW}示例：git pr 123${NC}"
    exit 1
fi

pr_id="$1"

echo -e "${GREEN}=== 开始处理 PR #$pr_id ===${NC}"
echo ""

# 1. 拉取 PR 代码到本地
echo -e "${YELLOW}[1/5] 拉取 PR #$pr_id 到本地分支 pr-$pr_id...${NC}"
git fetch origin pull/$pr_id/head:pr-$pr_id

# 2. 切换到该 PR 分支
echo -e "${YELLOW}[2/5] 切换到分支 pr-$pr_id...${NC}"
git checkout pr-$pr_id

# 3. 基于此分支创建测试分支
echo -e "${YELLOW}[3/5] 创建测试分支 test-pr-$pr_id...${NC}"
git checkout -b test-pr-$pr_id

# 4. 推送到 GitLab 触发 CI 测试
echo -e "${YELLOW}[4/5] 推送 test-pr-$pr_id 到 GitLab 触发 CI 测试...${NC}"
git push gitlab test-pr-$pr_id

# 5. 删除 pr-<PR_ID> 分支
echo -e "${YELLOW}[5/5] 清理临时分支 pr-$pr_id...${NC}"
git branch -d pr-$pr_id

echo ""
echo -e "${GREEN}=== PR #$pr_id 处理完成 ===${NC}"
echo ""
echo -e "${BLUE}当前分支：test-pr-$pr_id${NC}"
echo -e "${BLUE}已推送到：gitlab/test-pr-$pr_id${NC}"
echo ""
echo -e "${YELLOW}后续操作建议：${NC}"
echo -e "  1. 在 GitLab 查看 CI 测试结果"
echo -e "  2. 测试通过后，合并到 dev："
echo -e "     ${GREEN}git checkout dev${NC}"
echo -e "     ${GREEN}git pull gitlab dev${NC}"
echo -e "     ${GREEN}git merge test-pr-$pr_id --no-ff${NC}"
echo -e "     ${GREEN}git push gitlab dev${NC}"
echo -e "  3. 删除测试分支："
echo -e "     ${GREEN}git branch -d test-pr-$pr_id${NC}"
echo -e "     ${GREEN}git push gitlab --delete test-pr-$pr_id${NC}"