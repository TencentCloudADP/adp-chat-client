#!/bin/bash

# EdgeOne Pages 部署脚本
export EDGEONE_PAGES_PROJECT_NAME=adp-chat-client-docs

echo "开始构建项目..."
npm run export

echo "项目构建完成，准备部署到 EdgeOne Pages..."
echo "项目名称: $EDGEONE_PAGES_PROJECT_NAME"
echo "构建目录: out/"

# 提示用户手动部署或等待集成工具支持
echo ""
echo "✓ 构建完成！"
echo "部署目录: $(pwd)/out/"
echo ""
echo "请通过 IDE 的 EdgeOne 集成工具部署，或手动上传 out/ 目录到 EdgeOne Pages"
