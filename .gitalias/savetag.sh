#!/bin/bash
# FilePath    : go-utils\.gitalias\savetag.sh
# Author      : jiaopengzi
# Blog        : https://jiaopengzi.com
# Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
# Description : 根据 CHANGELOG.md 提交变更并打 Git 标签

# 设置 Git 别名命令:
# git config --global alias.savetag '!bash ./.gitalias/savetag.sh'
# 设置好别名后, 只需运行命令: git savetag 即可.

# 参数校验: 不允许传参
if [ $# -gt 0 ]; then
    echo "❌ 错误: 此命令无需手动传入版本号。"
    echo "   只需运行: git savetag"
    exit 1
fi

# 检查 CHANGELOG.md 是否存在
if [ ! -f "CHANGELOG.md" ]; then
    echo "❌ 错误: 找不到 CHANGELOG.md 文件"
    exit 1
fi

# 从 CHANGELOG.md 提取第一个 ## [版本号]
VERSION=$(sed -n 's/^## \[\([^]]*\)\].*/\1/p' CHANGELOG.md | head -n 1)
if [ -z "$VERSION" ]; then
    echo "❌ 错误: 无法从 CHANGELOG.md 中提取版本号。"
    exit 1
fi

# 参考: https://semver.org/lang/zh-CN/ 要求示例 v1.2.3
# 判断版本号是否符合语义化版本规范并且必须以小写 v 开头 (使用 POSIX ERE via grep -E)
SEMVER_RE='^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-(0|[1-9][0-9]*|[0-9]*[A-Za-z-][0-9A-Za-z-]*)(\.(0|[1-9][0-9]*|[0-9]*[A-Za-z-][0-9A-Za-z-]*))*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$'
if ! printf '%s' "$VERSION" | grep -E -q "$SEMVER_RE"; then
    echo "❌ 错误: 提取的版本号 '$VERSION' 不符合要求; 必须以小写字母 v 开头(例如 v1.2.3), 且遵循语义化版本规范(SemVer)."
    exit 1
fi

echo "✅ 检测到版本号:  $VERSION"

# # 检查 Git 仓库是否有未提交的更改
# if ! git diff --quiet || ! git diff --cached --quiet; then
#     echo "❌ 错误: 发现未提交的更改，请先提交或暂存这些更改。"
#     exit 1
# fi

# 检查是否已存在相同的 Git 标签
if git rev-parse "$VERSION" >/dev/null 2>&1; then
    echo "❌ 错误: Git 标签 '$VERSION' 已存在，请更新 CHANGELOG.md 中的版本号。"
    exit 1
fi

# 检查 CHANGELOG.md 是否有修改
if git diff --quiet HEAD -- CHANGELOG.md; then
    echo "❌ 错误: CHANGELOG.md 没有检测到修改, 请先更新 CHANGELOG.md 文件"
    exit 1
fi

COMMIT_MSG="Release:  $VERSION"
TAG_NAME="$VERSION"

echo "📦 准备提交并打标签: $TAG_NAME"
git add CHANGELOG.md && git commit -m "$COMMIT_MSG" && git push && git tag "$TAG_NAME" && git push origin "$TAG_NAME"
