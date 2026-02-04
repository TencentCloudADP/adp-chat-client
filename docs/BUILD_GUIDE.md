# ADP Chat Client 文档构建指南

## 构建选项

### 1. 默认构建（根路径部署）

适用于独立域名或根路径部署：

```bash
npm run build
```

生成的文件在 `out/` 目录，可以部署到：
- http://yourdomain.com/
- http://110.42.109.214:3000/

### 2. 子路径部署

适用于作为网站的一个子路径部署（例如 `/docs/`）：

```bash
NEXT_PUBLIC_BASE_PATH=/docs npm run build
```

生成的文件在 `out/` 目录，可以部署到：
- http://yourdomain.com/docs/
- http://110.42.109.214:3000/docs/

**重要**: 部署时需要将 `out/` 目录的内容放到服务器的 `/docs/` 路径下。

### 3. 多级子路径部署

如果需要部署到更深的路径（例如 `/projects/adp/docs/`）：

```bash
NEXT_PUBLIC_BASE_PATH=/projects/adp/docs npm run build
```

## 部署配置

### Nginx 配置示例

#### 根路径部署
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/adp-docs;
    index index.html;
    
    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

#### 子路径部署（/docs/）
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location /docs/ {
        alias /var/www/adp-docs/;
        index index.html;
        try_files $uri $uri/ $uri.html =404;
    }
}
```

### Apache 配置示例

创建 `.htaccess` 文件：

```apache
RewriteEngine On
RewriteBase /docs/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ $1.html [L,QSA]
```

## 常见问题

### Q1: 为什么不能直接用 file:// 协议打开？

**原因**: Next.js 使用绝对路径（`/`开头）引用资源，而 `file://` 协议无法正确解析这些路径。

**解决方案**: 
1. 使用本地 Web 服务器预览
2. 使用 `basePath` 构建并部署到真实服务器

### Q2: 如何在本地预览？

使用内置的预览脚本：

```bash
# 默认端口 8080
./preview.sh

# 自定义端口
./preview.sh 3000
```

或者手动启动：

```bash
cd out
python3 -m http.server 8080
# 访问 http://localhost:8080
```

### Q3: 子路径部署后样式丢失？

检查以下几点：

1. **构建时是否设置了 basePath**:
   ```bash
   NEXT_PUBLIC_BASE_PATH=/docs npm run build
   ```

2. **服务器配置是否正确**: 确保服务器将 `/docs/` 路径映射到正确的目录

3. **文件路径**: 部署后的 URL 应该是 `http://yourdomain.com/docs/`（注意末尾的 `/`）

### Q4: 如何部署到多个不同路径？

为每个路径分别构建：

```bash
# 构建用于 /docs/ 路径的版本
NEXT_PUBLIC_BASE_PATH=/docs npm run build
cp -r out/ dist-docs/

# 构建用于 /help/ 路径的版本
NEXT_PUBLIC_BASE_PATH=/help npm run build
cp -r out/ dist-help/
```

## 自动化部署脚本

### 部署到子路径

创建 `deploy-subpath.sh`:

```bash
#!/bin/bash
# 设置子路径
BASE_PATH="/docs"
REMOTE_HOST="110.42.109.214"
REMOTE_DIR="/var/www/html/docs"

# 构建
echo "构建文档（basePath: $BASE_PATH）..."
NEXT_PUBLIC_BASE_PATH=$BASE_PATH npm run build

# 部署
echo "部署到 $REMOTE_HOST:$REMOTE_DIR..."
ssh root@$REMOTE_HOST "mkdir -p $REMOTE_DIR"
rsync -avz --delete out/ root@$REMOTE_HOST:$REMOTE_DIR/

echo "部署完成！"
echo "访问地址: http://$REMOTE_HOST$BASE_PATH"
```

## 推荐部署方案

根据您的需求，推荐使用 **子路径部署** 方案：

```bash
# 1. 构建（设置为 /docs/ 子路径）
NEXT_PUBLIC_BASE_PATH=/docs npm run build

# 2. 部署到服务器的 /docs/ 目录
scp -r out/* root@110.42.109.214:/var/www/html/docs/

# 3. 访问
# http://110.42.109.214/docs/
```

这样可以确保文档作为网站的一部分，使用相对路径正常工作。
