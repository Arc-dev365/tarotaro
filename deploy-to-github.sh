#!/bin/bash

# GitHub Pages 部署脚本
# 使用方法: ./deploy-to-github.sh YOUR_GITHUB_USERNAME

set -e

# 检查参数
if [ $# -eq 0 ]; then
    echo "错误: 请提供您的 GitHub 用户名"
    echo "使用方法: ./deploy-to-github.sh YOUR_GITHUB_USERNAME"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="my-vue3-project_0_3"
REMOTE_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "🚀 开始部署到 GitHub Pages..."
echo "GitHub 用户名: ${GITHUB_USERNAME}"
echo "仓库名称: ${REPO_NAME}"
echo "远程地址: ${REMOTE_URL}"
echo ""

# 检查是否已经是 git 仓库
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
else
    echo "✅ Git 仓库已存在"
fi

# 检查是否有 .env 文件
if [ -f ".env" ]; then
    echo "⚠️  检测到 .env 文件，请确保已将 API 密钥添加到 GitHub Secrets"
    echo "   访问: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings/secrets/actions"
    echo "   添加密钥: VITE_QIANWEN_API_KEY"
    echo ""
fi

# 添加所有文件
echo "📁 添加文件到 Git..."
git add .

# 检查是否有更改需要提交
if git diff --staged --quiet; then
    echo "ℹ️  没有新的更改需要提交"
else
    echo "💾 提交更改..."
    git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 检查是否已添加远程仓库
if git remote get-url origin >/dev/null 2>&1; then
    echo "✅ 远程仓库已配置"
    CURRENT_REMOTE=$(git remote get-url origin)
    if [ "$CURRENT_REMOTE" != "$REMOTE_URL" ]; then
        echo "⚠️  当前远程地址: $CURRENT_REMOTE"
        echo "⚠️  期望远程地址: $REMOTE_URL"
        read -p "是否更新远程地址? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git remote set-url origin "$REMOTE_URL"
            echo "✅ 远程地址已更新"
        fi
    fi
else
    echo "🔗 添加远程仓库..."
    git remote add origin "$REMOTE_URL"
fi

# 设置主分支
echo "🌿 设置主分支..."
git branch -M main

# 推送到 GitHub
echo "⬆️  推送到 GitHub..."
git push -u origin main

echo ""
echo "🎉 部署完成!"
echo ""
echo "📋 接下来的步骤:"
echo "1. 访问 GitHub 仓库: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo "2. 在 Settings > Secrets and variables > Actions 中添加 API 密钥"
echo "3. 在 Settings > Pages 中启用 GitHub Actions 作为源"
echo "4. 等待 GitHub Actions 构建完成"
echo "5. 访问您的网站: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo ""
echo "📖 详细说明请查看 DEPLOY.md 文件"