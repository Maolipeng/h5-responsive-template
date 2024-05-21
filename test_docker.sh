#!/bin/bash

proxy_server=$1

if [ -z "$proxy_server" ]; then
  echo -e "\033[31mError: proxy_server not provided\033[0m"
  exit 1
fi

port=${2:-8088}
PROJECT_NAME=${PWD##*/}
DOCKER_NAME=$PROJECT_NAME
tag=$(date +%Y%m%d%H%M%S)
echo $DOCKER_NAME

# 获取当前系统架构
arch=$(uname -m)

# 根据架构来决定要构建的镜像平台
if [ "$arch" == "x86_64" ]; then
  platform="linux/amd64"
else
  platform="linux/arm64/v8"
fi

# 1. 生成dist目录
pnpm run build
# 2. 创建一个临时目录，用于构建镜像
mkdir temp_docker_build
# 3. 将必要的文件拷贝到临时目录中
cp -R dist temp_docker_build/
cp -R nginx temp_docker_build/
cp Dockerfile temp_docker_build/
# 4. 进入临时目录
cd temp_docker_build
# 5. 构建Docker镜像
docker build --platform $platform -t $DOCKER_NAME:$tag .
# 启动docker镜像
docker run -d --name $DOCKER_NAME_$tag -e PROXY_PASS=$proxy_server -p $port:80 $DOCKER_NAME:$tag
# 6. 返回上级目录并删除临时目录
cd ..
rm -rf temp_docker_build

# 7. 执行完成后退出
exit 0
