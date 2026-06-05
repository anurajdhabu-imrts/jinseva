# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Jinalaya — Jain Derasar Management Platform
#  Monorepo: apps/frontend (web + dashboard), apps/backend, packages/shared
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

.PHONY: help install setup dev dev-frontend dev-backend \
        build build-frontend lint clean reset

help:               ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "  %-18s %s\n", $$1, $$2}'

install:           ## Install all workspace dependencies
	@echo "🪔 Installing workspace dependencies…"
	npm install

setup:             ## Initial setup (install + copy .env.example files)
	@bash ./setup.sh

dev:               ## Run frontend (:3000) + backend (:5000) concurrently
	@npm run dev

dev-frontend:      ## Run only the frontend (web + dashboard)
	@npm run dev:frontend

dev-backend:       ## Run only the backend API
	@npm run dev:backend

build:             ## Build the frontend for production
	@npm run build

build-frontend:    ## Build only the frontend
	@npm run build:frontend

lint:              ## Lint every workspace
	@npm run lint

clean:             ## Remove node_modules and dist folders
	@npm run clean

reset:             ## Clean + reinstall (fresh state)
	@$(MAKE) clean
	@$(MAKE) install
