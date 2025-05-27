.DEFAULT_GOAL := help

# Choose automatically docker-compose or docker compose
ifeq (, $(shell which docker-compose))
	DOCKER_COMPOSE=docker compose
else
	DOCKER_COMPOSE=docker-compose
endif

# ⚡️ Help
help: ## Display this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Variables
CLIENT=@graph-talk/client
SERVER=@graph-talk/server
DB_CONTAINER=graph-talk-postgres

# ⚡️ Development
dev-client: ## Start client in development mode
	yarn workspace $(CLIENT) dev

dev-server: ## Start server in development mode
	yarn workspace $(SERVER) dev

# ⚡️ Build
build-client: ## Build client for production
	yarn workspace $(CLIENT) build

build-server: ## Build server for production
	yarn workspace $(SERVER) build

# ⚡️ Start (preview for client, start for server)
start-client: ## Start client in preview mode
	yarn workspace $(CLIENT) preview

start-server: ## Start server in production mode
	yarn workspace $(SERVER) start

# ⚡️ Lint / Format
lint: ## Run linter
	biome lint .

format: ## Format code
	biome format . --write

# ⚡️ Postgres - Docker Compose
db-up: ## Start PostgreSQL container
	$(DOCKER_COMPOSE) up -d postgres

db-down: ## Stop PostgreSQL container
	$(DOCKER_COMPOSE) down

db-restart: ## Restart PostgreSQL container
	$(DOCKER_COMPOSE) down && $(DOCKER_COMPOSE) up -d postgres

db-logs: ## View PostgreSQL container logs
	$(DOCKER_COMPOSE) logs -f $(DB_CONTAINER)

db-shell: ## Access PostgreSQL shell
	$(DOCKER_COMPOSE) exec -it $(DB_CONTAINER) psql -U postgres -d blockchain-poll

db-clear: ## Remove PostgreSQL container and volumes
	$(DOCKER_COMPOSE) down -v

# ⚡️ All reset + build
reset: ## Reset database (clear and restart)
	make db-clear
	make db-up

# ⚡️ Start all (client + server)
dev-all: ## Start both client and server in development mode
	make dev-client & make dev-server

.PHONY: help dev-client dev-server build-client build-server start-client start-server lint format db-up db-down db-restart db-logs db-shell db-clear reset dev-all
