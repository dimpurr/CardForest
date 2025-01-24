# CardForest Makefile

# Variables
ARANGODB_PORT=8529
SERVER_PORT=3030
CLIENT_PORT=3000

# Colors for output
GREEN=\033[0;32m
NC=\033[0m # No Color

.PHONY: all install stop clean help db server client docs init init-db dev

# Default target
all: help

# Help
help:
	@echo "CardForest Development Commands:"
	@echo "make init       - Initialize development environment"
	@echo "make install    - Install all dependencies"
	@echo "make dev        - Start all services in tmux session (推荐)"
	@echo "make db        - 仅启动数据库 (调试用)"
	@echo "make server    - 仅启动后端 (调试用)"
	@echo "make client    - 仅启动前端 (调试用)"
	@echo "make docs      - Start documentation server"
	@echo "make clean     - Clean up node_modules and build files"

# Initialize development environment
init: init-db install
	@echo "$(GREEN)Development environment initialized!$(NC)"

# Initialize database
init-db:
	@echo "$(GREEN)Installing Docker if not present...$(NC)"
	which docker || /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && brew install docker
	@echo "$(GREEN)Installing tmux if not present...$(NC)"
	which tmux || brew install tmux
	@echo "$(GREEN)Pulling ArangoDB Docker image...$(NC)"
	docker pull arangodb
	@echo "$(GREEN)ArangoDB Docker image ready!$(NC)"

# Start development environment with tmux
dev:
	@echo "$(GREEN)Starting development environment in tmux...$(NC)"
	chmod +x scripts/start-dev.sh
	./scripts/start-dev.sh

# Installation
install:
	@echo "$(GREEN)Installing global dependencies...$(NC)"
	npm install -g ts-node typescript
	@echo "$(GREEN)Installing project dependencies...$(NC)"
	yarn install
	cd packages/server && yarn install
	cd packages/web-client && yarn install
	cd packages/docs && yarn install

# Stop all services
stop:
	@echo "$(GREEN)Stopping all services...$(NC)"
	-pkill -f "node"
	-docker stop arangodb-instance
	-tmux kill-session -t cardforest
	@echo "All services stopped"

# Database (for debugging)
db:
	@echo "$(GREEN)Starting ArangoDB in Docker...$(NC)"
	chmod +x scripts/start-arangodb.sh
	./scripts/start-arangodb.sh
	@echo "ArangoDB running on port $(ARANGODB_PORT)"
	@echo "Web interface: http://localhost:$(ARANGODB_PORT)"

# Server (for debugging)
server:
	@echo "$(GREEN)Starting backend server...$(NC)"
	cd packages/server && ts-node scripts/generate-typings.ts
	cd packages/server && yarn start:dev

# Client (for debugging)
client:
	@echo "$(GREEN)Starting frontend client...$(NC)"
	cd packages/web-client && yarn dev

# Documentation
docs:
	@echo "$(GREEN)Starting documentation server...$(NC)"
	cd packages/docs && NODE_OPTIONS=--openssl-legacy-provider yarn dev

# Clean
clean:
	@echo "$(GREEN)Cleaning project...$(NC)"
	rm -rf node_modules
	rm -rf packages/server/node_modules
	rm -rf packages/web-client/node_modules
	rm -rf packages/docs/node_modules
	rm -rf packages/server/dist
	rm -rf packages/web-client/.next
	-docker stop arangodb-instance
	-docker rm arangodb-instance
	rm -rf tmp/arangodb
