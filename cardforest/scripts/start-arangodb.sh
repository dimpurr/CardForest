#!/bin/bash

# 创建目录用于持久化存储
mkdir -p ./tmp/arangodb

# 检查是否已经有名为 arangodb-instance 的容器
if [ $(docker ps -aq -f name=arangodb-instance) ]; then
    # 提示用户选择复用还是删除并重建容器
    echo "已经存在名为 arangodb-instance 的容器。"
    echo "1. 复用现有容器"
    echo "2. 删除并重建容器"
    read choice

    if [ "$choice" == "1" ]; then
        echo "选择了复用现有的容器."
        docker start arangodb-instance
        docker logs arangodb-instance
        exit 0
    else
        echo "选择了删除并重建容器."
        docker stop arangodb-instance
        docker rm arangodb-instance
    fi
fi

# 提示用户输入密码
echo "请输入 ArangoDB 的密码："
read -s arangoPassword

# 运行新的 ArangoDB 容器，并将持久化目录挂载到容器中
docker run -e ARANGO_ROOT_PASSWORD=$arangoPassword -p 8529:8529 -d \
    --name arangodb-instance \
    --restart=unless-stopped \
    -v "$(pwd)/tmp/arangodb:/var/lib/arangodb3" \
    arangodb

docker logs arangodb-instance
