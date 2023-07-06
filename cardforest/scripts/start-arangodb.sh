#!/bin/bash

# 创建目录用于持久化存储
mkdir -p ./tmp/arangodb

# 检查是否已经有名为 arangodb-instance 的容器在运行
if [ $(docker ps -q -f name=arangodb-instance) ]; then
    # 如果容器已经在运行，停止并删除它
    docker stop arangodb-instance
    docker rm arangodb-instance
fi

# 运行新的 ArangoDB 容器，并将持久化目录挂载到容器中
docker run -e ARANGO_RANDOM_ROOT_PASSWORD=1 -p 8529:8529 -d \
    --name arangodb-instance \
    -v "$(pwd)/tmp/arangodb:/var/lib/arangodb3" \
    arangodb

docker logs arangodb-instance