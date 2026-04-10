#!/bin/bash
# FilePath    : .gitalias/b-del.sh
# Author      : jiaopengzi
# Blog        : https://jiaopengzi.com
# Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
# Description : 删除本地和远程分支（支持双仓库）

# 设置 Git 别名命令:
# 在 .git/config 文件中添加以下内容：
# [alias]
#     b-del = "!bash ./.gitalias/b-del.sh"
# 运行命令: git b-del <BRANCH_NAME>
#          git b-del -r <BRANCH_NAME>  (同时删除两个远程仓库的分支)
#          git b-del -f <BRANCH_NAME>  (强制删除本地分支)

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ========== 函数定义 ==========

# 显示帮助信息
show_help() {
    echo ""
    echo -e "${CYAN}=== b-del.sh 使用说明 ===${NC}"
    echo ""
    echo -e "${GREEN}用法:${NC}"
    echo "  git b-del <分支名>              删除本地分支"
    echo "  git b-del -r <分支名>           删除本地和两个远程仓库的分支"
    echo "  git b-del -f <分支名>           强制删除本地分支"
    echo "  git b-del -rf <分支名>          强制删除本地和远程分支"
    echo "  git b-del --list                列出所有分支（本地+远程）"
    echo "  git b-del --help                显示此帮助"
    echo ""
    echo -e "${GREEN}示例:${NC}"
    echo "  git b-del feature/old-login          # 删除本地 feature/old-login"
    echo "  git b-del -r feature/old-login       # 删除本地及双仓库的 feature/old-login"
    echo "  git b-del -f feature/old-login       # 强制删除未合并的本地分支"
    echo ""
}

# 列出所有分支
list_branches() {
    echo ""
    echo -e "${CYAN}=== 本地分支 ===${NC}"
    git branch -vv
    echo ""
    echo -e "${CYAN}=== origin (GitHub) 远程分支 ===${NC}"
    git branch -r | grep "origin/" | grep -v "HEAD"
    echo ""
    echo -e "${CYAN}=== gitlab 远程分支 ===${NC}"
    if git remote | grep -q "gitlab"; then
        git branch -r | grep "gitlab/" | grep -v "HEAD"
    else
        echo -e "${YELLOW}  未配置 gitlab 远程仓库${NC}"
    fi
    echo ""
}

# 检查分支是否存在（本地）
check_local_branch() {
    local branch=$1
    if git show-ref --verify --quiet "refs/heads/$branch"; then
        return 0
    else
        return 1
    fi
}

# 检查分支是否存在（远程）
check_remote_branch() {
    local remote=$1
    local branch=$2
    if git ls-remote --exit-code --heads "$remote" "$branch" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# 检查是否是当前分支
check_current_branch() {
    local branch=$1
    local current=$(git branch --show-current)
    if [ "$branch" = "$current" ]; then
        return 0
    else
        return 1
    fi
}

# 检查是否是保护分支
check_protected_branch() {
    local branch=$1
    local protected=("main" "master" "dev" "develop")
    
    for p in "${protected[@]}"; do
        if [ "$branch" = "$p" ]; then
            return 0
        fi
    done
    return 1
}

# ========== 参数解析 ==========

DELETE_REMOTE=false
FORCE=false
LIST=false
BRANCH_NAME=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h|help)
            show_help
            exit 0
            ;;
        --list|-l)
            LIST=true
            shift
            ;;
        -r)
            DELETE_REMOTE=true
            shift
            ;;
        -f)
            FORCE=true
            shift
            ;;
        -rf|-fr)
            DELETE_REMOTE=true
            FORCE=true
            shift
            ;;
        -*)
            echo -e "${RED}❌ 错误: 未知选项 $1${NC}"
            show_help
            exit 1
            ;;
        *)
            BRANCH_NAME="$1"
            shift
            ;;
    esac
done

# 列出分支模式
if [ "$LIST" = true ]; then
    list_branches
    exit 0
fi

# 检查是否提供了分支名
if [ -z "$BRANCH_NAME" ]; then
    echo -e "${RED}❌ 错误: 请提供要删除的分支名${NC}"
    echo -e "${YELLOW}   用法: git b-del <分支名>${NC}"
    echo -e "${YELLOW}   查看所有分支: git b-del --list${NC}"
    exit 1
fi

# ========== 主流程 ==========

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}                    删除分支: $BRANCH_NAME${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo ""

# 检查是否是保护分支
if check_protected_branch "$BRANCH_NAME"; then
    echo -e "${RED}⚠️  警告: '$BRANCH_NAME' 是保护分支！${NC}"
    read -p "确定要删除保护分支吗？(yes/N) " -r
    echo
    if [ "$REPLY" != "yes" ]; then
        echo -e "${YELLOW}操作已取消${NC}"
        exit 0
    fi
fi

# 检查是否是当前分支
if check_current_branch "$BRANCH_NAME"; then
    echo -e "${YELLOW}当前正在 '$BRANCH_NAME' 分支上${NC}"
    echo -e "${YELLOW}将自动切换到 dev 或 main 分支...${NC}"
    
    # 尝试切换到 dev 或 main
    if git show-ref --verify --quiet "refs/heads/dev"; then
        git checkout dev
    elif git show-ref --verify --quiet "refs/heads/main"; then
        git checkout main
    elif git show-ref --verify --quiet "refs/heads/master"; then
        git checkout master
    else
        echo -e "${RED}❌ 错误: 无法切换到其他分支，请手动切换后再删除${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ 已切换到 $(git branch --show-current) 分支${NC}"
fi

# 删除本地分支
if check_local_branch "$BRANCH_NAME"; then
    echo -e "${YELLOW}[1/2] 删除本地分支 '$BRANCH_NAME'...${NC}"
    
    if [ "$FORCE" = true ]; then
        git branch -D "$BRANCH_NAME"
        echo -e "${GREEN}✅ 已强制删除本地分支 '$BRANCH_NAME'${NC}"
    else
        # 检查是否已合并
        if git branch -d "$BRANCH_NAME" 2>/dev/null; then
            echo -e "${GREEN}✅ 已删除本地分支 '$BRANCH_NAME'${NC}"
        else
            echo -e "${RED}❌ 分支 '$BRANCH_NAME' 未完全合并${NC}"
            echo -e "${YELLOW}   使用 -f 选项强制删除: git b-del -f $BRANCH_NAME${NC}"
            
            if [ "$DELETE_REMOTE" = false ]; then
                exit 1
            fi
        fi
    fi
else
    echo -e "${YELLOW}本地分支 '$BRANCH_NAME' 不存在，跳过${NC}"
fi

# 删除远程分支
if [ "$DELETE_REMOTE" = true ]; then
    echo ""
    echo -e "${YELLOW}[2/2] 删除远程分支...${NC}"
    
    # 删除 origin (GitHub) 远程分支
    if check_remote_branch "origin" "$BRANCH_NAME"; then
        echo -e "${YELLOW}  删除 origin/$BRANCH_NAME...${NC}"
        git push origin --delete "$BRANCH_NAME"
        echo -e "${GREEN}  ✅ 已删除 origin/$BRANCH_NAME${NC}"
    else
        echo -e "${YELLOW}  远程分支 origin/$BRANCH_NAME 不存在，跳过${NC}"
    fi
    
    # 删除 gitlab 远程分支
    if git remote | grep -q "gitlab"; then
        if check_remote_branch "gitlab" "$BRANCH_NAME"; then
            echo -e "${YELLOW}  删除 gitlab/$BRANCH_NAME...${NC}"
            git push gitlab --delete "$BRANCH_NAME"
            echo -e "${GREEN}  ✅ 已删除 gitlab/$BRANCH_NAME${NC}"
        else
            echo -e "${YELLOW}  远程分支 gitlab/$BRANCH_NAME 不存在，跳过${NC}"
        fi
    fi
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}                    ✅ 完成！                                   ${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""

# 清理本地已删除的远程分支引用
read -p "是否清理本地过期的远程分支引用？(y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git remote prune origin
    if git remote | grep -q "gitlab"; then
        git remote prune gitlab
    fi
    echo -e "${GREEN}✅ 已清理过期引用${NC}"
fi