# GitHub Pages 部署设置指南

## ⚠️ 重要：必须完成的设置

**您的 GitHub Actions 失败的主要原因是 GitHub Pages 设置不正确！**

根据您提供的错误截图，所有 4 个工作流都失败了。这通常是因为 GitHub Pages 没有正确配置为使用 GitHub Actions 作为源。

## 🔧 必须完成的设置步骤

### 1. **启用 GitHub Pages**
   - 访问：https://github.com/Arc-dev365/tarotaro/settings/pages
   - 在 "Build and deployment" 部分
   - **Source** 必须选择 "**GitHub Actions**"（不是 "Deploy from a branch"）
   - 点击保存

### 2. **配置工作流权限**
   - 访问：https://github.com/Arc-dev365/tarotaro/settings/actions
   - 在 "Workflow permissions" 部分
   - 选择 "**Read and write permissions**"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"
   - 点击保存

### 3. **检查 Secrets 配置**
   - 访问：https://github.com/Arc-dev365/tarotaro/settings/secrets/actions
   - 确认 `VITE_QIANWEN_API_KEY` 已正确配置

### 4. **验证部署**
   - 完成上述设置后，访问 Actions 页面
   - 新的工作流应该会自动触发
   - 部署成功后，网站将在以下地址可用：
     https://arc-dev365.github.io/tarotaro/

## 故障排除

如果部署仍然失败，请检查：

1. **仓库权限**：确保仓库是公开的或者您有适当的权限
2. **GitHub Pages 限制**：确保您的 GitHub 账户支持 GitHub Pages
3. **工作流权限**：在仓库设置 > Actions > General 中，确保 "Workflow permissions" 设置为 "Read and write permissions"

## 最新修复

我们已经更新了 GitHub Actions 配置：
- 使用官方的 GitHub Pages 部署 action
- 添加了适当的权限设置
- 分离了构建和部署步骤
- 添加了构建输出检查

完成上述设置后，GitHub Actions 应该能够成功部署您的塔罗牌应用。