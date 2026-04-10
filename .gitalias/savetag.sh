#!/bin/bash
# FilePath    : go-utils\.gitalias\savetag.sh
# Author      : jiaopengzi
# Blog        : https://jiaopengzi.com
# Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
# Description : 不保护 main 分支场景，直接在 main 上打 Tag 并推送到双仓库，根据 CHANGELOG.md 提交变更并打 Git 标签

# 设置 Git 别名命令:
# 在 .git/config 文件中添加以下内容：
# [alias]
#     savetag = "!bash ./.gitalias/savetag.sh"
# 运行命令: git savetag


set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 参数校验
if [ $# -gt 0 ]; then
    echo -e "${RED}❌ 错误: 此命令无需手动传入版本号。${NC}"
    echo -e "${YELLOW}   只需运行: git savetag${NC}"
    exit 1
fi

# 检查 CHANGELOG.md
if [ ! -f "CHANGELOG.md" ]; then
    echo -e "${RED}❌ 错误: 找不到 CHANGELOG.md 文件${NC}"
    exit 1
fi

# 提取版本号
VERSION=$(sed -n 's/^## \[\([^]]*\)\].*/\1/p' CHANGELOG.md | head -n 1)
if [ -z "$VERSION" ]; then
    echo -e "${RED}❌ 错误: 无法从 CHANGELOG.md 中提取版本号。${NC}"
    exit 1
fi

# 验证版本号格式
# 参考: https://semver.org/lang/zh-CN/ 要求示例 v1.2.3
# 判断版本号是否符合语义化版本规范并且必须以小写 v 开头 (使用 POSIX ERE via grep -E)
SEMVER_RE='^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-(0|[1-9][0-9]*|[0-9]*[A-Za-z-][0-9A-Za-z-]*)(\.(0|[1-9][0-9]*|[0-9]*[A-Za-z-][0-9A-Za-z-]*))*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$'
if ! printf '%s' "$VERSION" | grep -E -q "$SEMVER_RE"; then
    echo -e "${RED}❌ 错误: 版本号 '$VERSION' 不符合规范 (应以 v 开头，如 v1.2.3，且遵循语义化版本规范(SemVer)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 检测到版本号: $VERSION${NC}"

# 检查标签是否存在
if git rev-parse "$VERSION" >/dev/null 2>&1; then
    echo -e "${RED}❌ 错误: Git 标签 '$VERSION' 已存在${NC}"
    exit 1
fi

# 检查 CHANGELOG.md 是否有修改
if git diff --quiet HEAD -- CHANGELOG.md; then
    echo -e "${RED}❌ 错误: CHANGELOG.md 没有修改, 请先更新 CHANGELOG.md${NC}"
    exit 1
fi

# 获取当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📂 当前分支: $CURRENT_BRANCH${NC}"

# 确认操作
echo ""
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}准备在 main 分支上打标签并发布${NC}"
echo -e "${CYAN}  版本号:   ${GREEN}$VERSION${NC}"
echo -e "${CYAN}  当前分支: ${GREEN}$CURRENT_BRANCH${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo ""

read -p "确认继续？(y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}操作已取消${NC}"
    exit 1
fi

COMMIT_MSG="Release: $VERSION"

echo ""
echo -e "${YELLOW}[1/5] 提交 CHANGELOG.md...${NC}"
git add CHANGELOG.md
git commit -m "$COMMIT_MSG"

# 如果不在 main 分支，切换到 main
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}[2/5] 切换到 main 分支...${NC}"
    git checkout main
    git pull origin main
fi

# 合并当前分支的变更（如果不是 main）
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}[3/5] 合并 $CURRENT_BRANCH 到 main...${NC}"
    git merge "$CURRENT_BRANCH" --no-ff -m "chore: Merge $CURRENT_BRANCH for $VERSION"
else
    echo -e "${YELLOW}[3/5] 已在 main 分支，跳过合并${NC}"
fi

# 推送 main 分支
echo -e "${YELLOW}[4/5] 推送 main 分支到双仓库...${NC}"
git push origin main
git push gitlab main

# 创建并推送标签
echo -e "${YELLOW}[5/5] 创建并推送标签 $VERSION...${NC}"
git tag -a "$VERSION" -m "$COMMIT_MSG"
git push origin "$VERSION"
git push gitlab "$VERSION"

# 切回原分支
if [ "$CURRENT_BRANCH" != "main" ]; then
    git checkout "$CURRENT_BRANCH"
    echo -e "${YELLOW}已切换回分支: $CURRENT_BRANCH${NC}"
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}                    ✅ Tag 完成！                               ${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}版本:${NC}     $VERSION"