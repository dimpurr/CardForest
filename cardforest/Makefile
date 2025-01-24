# CardForest Makefile

# Variables
ARANGODB_PORT=8529
SERVER_PORT=3030
CLIENT_PORT=3000

# Colors for output
GREEN=\033[0;32m
NC=\033[0m # No Color

.PHONY: all install start stop clean help db server client docs

# Default target
all: help

# Help
help:
	@echo "CardForest Development Commands:"
	@echo "make install     - Install all dependencies"
	@echo "make start      - Start all services (DB, Server, Client)"
	@echo "make stop       - Stop all services"
	@echo "make db         - Start ArangoDB"
	@echo "make server     - Start backend server"
	@echo "make client     - Start frontend client"
	@echo "make docs       - Start documentation server"
	@echo "make clean      - Clean up node_modules and build files"

# Installation
install:
	@echo "$(GREEN)Installing dependencies...$(NC)"
	yarn install
	cd packages/server && yarn install
	cd packages/web-client && yarn install
	cd packages/docs && yarn install

# Start all services
start: db server client

# Stop all services
stop:
	@echo "$(GREEN)Stopping all services...$(NC)"
	-pkill -f "arangod"
	-pkill -f "node"

# Database
db:
	@echo "$(GREEN)Starting ArangoDB...$(NC)"
	brew services start arangodb
	@echo "ArangoDB running on port $(ARANGODB_PORT)"
	@echo "Web interface: http://localhost:$(ARANGODB_PORT)"

# Server
server:
	@echo "$(GREEN)Starting backend server...$(NC)"
	cd packages/server && ts-node scripts/generate-typings.ts
	cd packages/server && yarn start:dev

# Client
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
