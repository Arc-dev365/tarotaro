# GitHub Pages 部署指南

本指南将帮助您将塔罗牌应用部署到 GitHub Pages。

## 部署步骤

### 1. 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 仓库名称建议使用：`my-vue3-project_0_3`（与vite.config.js中的base路径匹配）
4. 设置为 Public（GitHub Pages 免费版需要公开仓库）
5. 点击 "Create repository"

### 2. 推送代码到 GitHub

在项目根目录执行以下命令：

```bash
# 初始化 git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"

# 添加远程仓库（替换为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/my-vue3-project_0_3.git

# 推送到主分支
git branch -M main
git push -u origin main
```

### 3. 配置环境变量

1. 在 GitHub 仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单中选择 "Secrets and variables" > "Actions"
3. 点击 "New repository secret"
4. 添加以下密钥：
   - Name: `VITE_QIANWEN_API_KEY`
   - Secret: 您的通义千问API密钥

### 4. 启用 GitHub Pages

1. 在仓库的 "Settings" 页面
2. 滚动到 "Pages" 部分
3. 在 "Source" 下拉菜单中选择 "GitHub Actions"
4. 保存设置

### 5. 触发部署

推送代码到 main 分支后，GitHub Actions 会自动开始构建和部署：

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push
```

### 6. 访问您的网站

部署完成后，您的网站将在以下地址可用：
```
https://YOUR_USERNAME.github.io/my-vue3-project_0_3/
```

## 重要注意事项

### API 密钥安全
- 绝对不要在代码中硬编码 API 密钥
- 使用 GitHub Secrets 来存储敏感信息
- 确保 `.env` 文件已添加到 `.gitignore`

### 路径配置
- vite.config.js 中的 `base` 路径必须与仓库名称匹配
- 如果更改仓库名称，需要同时更新 vite.config.js

### 功能验证
部署后请测试以下功能：
- [ ] 页面正常加载
- [ ] 塔罗牌图片显示正常
- [ ] AI 解读功能正常工作
- [ ] 页面间导航正常
- [ ] 本地存储功能正常

## 故障排除

### 构建失败
1. 检查 GitHub Actions 日志
2. 确保所有依赖都在 package.json 中
3. 验证环境变量配置正确

### 页面显示异常
1. 检查浏览器控制台错误
2. 验证资源路径是否正确
3. 确认 base 路径配置

### API 调用失败
1. 检查 API 密钥是否正确配置
2. 验证 CORS 设置
3. 检查网络连接

## 自定义域名（可选）

如果您有自定义域名：

1. 在 `.github/workflows/deploy.yml` 中取消注释 `cname` 行并填写您的域名
2. 在域名提供商处配置 CNAME 记录指向 `YOUR_USERNAME.github.io`

## 更新部署

每次推送到 main 分支都会自动触发重新部署：

```bash
git add .
git commit -m "Update application"
git push
```

部署通常需要 2-5 分钟完成。您可以在仓库的 "Actions" 选项卡中查看部署进度。