#!/bin/bash

# 先启动数据库
echo "Starting ArangoDB..."
chmod +x scripts/start-arangodb.sh
./scripts/start-arangodb.sh

# 等待数据库启动
sleep 3

# 创建退出脚本
cat > /tmp/cardforest-exit.sh << 'EOF'
#!/bin/bash
echo "ArrangoDB: http://localhost:8529"
echo "Backend: http://localhost:3030"
echo "Frontend: http://localhost:3000"
echo "Documentation: http://localhost:8080"
echo "按 0 退出所有服务"
while true; do
    read -n 1 key
    if [[ $key == "0" ]]; then
        echo "正在停止所有服务..."
        docker stop arangodb-instance
        pkill -f "node"
        tmux kill-session -t cardforest
        break
    fi
done
EOF
chmod +x /tmp/cardforest-exit.sh

# 创建一个新的 tmux 会话，但不立即附加到会话
tmux new-session -d -s cardforest

# 重命名主窗口
tmux rename-window -t cardforest:0 'dev'

# 将窗口分割成四个面板
tmux split-window -h
tmux select-pane -t 0
tmux split-window -v
tmux select-pane -t 2
tmux split-window -v

# 在左上角添加退出按钮面板
tmux select-pane -t 0
tmux send-keys '/tmp/cardforest-exit.sh' C-m

# 在其他面板中分别显示各个服务的输出
tmux select-pane -t 1
tmux send-keys 'docker logs -f arangodb-instance' C-m

tmux select-pane -t 2
tmux send-keys 'cd packages/server && yarn start:dev' C-m

tmux select-pane -t 3
tmux send-keys 'cd packages/web-client && yarn dev' C-m

# 附加到会话
tmux attach-session -t cardforest

# 清理临时文件
rm -f /tmp/cardforest-exit.sh
