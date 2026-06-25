.PHONY: help up-dev up-prod clean purge restart rebuild migrate-dev migrate-prod migration-dev migration-prod superuser-dev superuser-auto-dev superuser-prod check-dev check-prod backend-test-dev backend-test-prod frontend-test logs-backend-dev logs-backend-prod logs-pytest-dev logs-pytest-prod convert

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

requirements: ## Generate requirements.txt from pyproject.toml
	uv pip compile ./srcs/backend/pyproject.toml -o ./srcs/backend/requirements.txt

prepare: ## Prepare the development environment by creating a virtual environment, installing Python 3.12, and syncing dependencies
	rm -rf .venv
	uv python install 3.14
	uv python pin 3.14
	uv sync

check: ## Check for any issues in the codebase using ruff
	uv run ruff check

format: ## Format the codebase using ruff
	uv run ruff format

fullCheck: check format

pre-commit-all: ## Run pre-commit checks on all files
	uv run pre-commit run --all-files

env: ## Create .env file if it doesn't exist
	@if [ ! -f .env ]; then \
		echo "Creating .env file..."; \
		printf "POSTGRES_DB=integrate_db\n" > .env; \
		printf "POSTGRES_USER=integrate_user\n" >> .env; \
		printf "POSTGRES_PASSWORD=integrate_password\n" >> .env; \
		printf "DATABASE_URL=postgres://integrate_user:integrate_password@db:5432/integrate_db\n" >> .env; \
		printf "DEBUG=True\n" >> .env; \
		printf "ALLOWED_HOSTS=localhost,127.0.0.1,backend, *\n" >> .env; \
		printf "DJANGO_SETTINGS_MODULE=core.settings\n" >> .env; \
		printf "SECRET_KEY=?\n" >> .env; \
		printf "\n" >> .env; \
		printf "# Default superuser (auto-created by make superuser-auto-dev)\n" >> .env; \
		printf "DJANGO_SUPERUSER_USERNAME=admin_integrate2026\n" >> .env; \
		printf "DJANGO_SUPERUSER_PASSWORD=admin_integrate2026\n" >> .env; \
		printf "DJANGO_SUPERUSER_EMAIL=admin@integrate.local\n" >> .env; \
		printf "\n" >> .env; \
	else \
		echo ".env file already exists."; \
	fi
	@echo "Environment variables:"
	@cat .env

env-prod: ## Create .env file for production if it doesn't exist
	@if [ ! -f .env ]; then \
		echo "Creating .env file..."; \
		printf "POSTGRES_DB=integrate_db\n" > .env; \
		printf "POSTGRES_USER=integrate_user\n" >> .env; \
		printf "POSTGRES_PASSWORD=integrate_password\n" >> .env; \
		printf "DATABASE_URL=postgres://integrate_user:integrate_password@db:5432/integrate_db\n" >> .env; \
		printf "# DEBUG=True\n" >> .env; \
		printf "# ALLOWED_HOSTS=localhost,127.0.0.1,backend, *\n" >> .env; \
		printf "DJANGO_SETTINGS_MODULE=core.settings\n" >> .env; \
		printf "SECRET_KEY=?\n" >> .env; \
		printf "\n" >> .env; \
		printf "# Default superuser (auto-created by make superuser-auto-dev)\n" >> .env; \
		printf "DJANGO_SUPERUSER_USERNAME=admin_integrate2026\n" >> .env; \
		printf "DJANGO_SUPERUSER_PASSWORD=admin_integrate2026\n" >> .env; \
		printf "DJANGO_SUPERUSER_EMAIL=admin@integrate.local\n" >> .env; \
		printf "\n" >> .env; \
		printf "# Production settings\n" >> .env; \
		printf "\n" >> .env; \
		printf "ALLOWED_HOSTS=localhost,127.0.0.1\n" >> .env; \
		printf "CORS_ALLOWED_ORIGINS=http://localhost:5178\n" >> .env; \
		printf "CSRF_TRUSTED_ORIGINS=\n" >> .env; \
		printf "DEBUG=False\n" >> .env; \
		printf "\n" >> .env; \
		printf "\n" >> .env; \
	else \
		echo ".env file already exists."; \
	fi
	@echo "Environment variables:"
	@cat .env


start-dev: ## Start dev workflow with strict database readiness check
	@read -p "⚠️  Are you starting development environment? Type 'yes' to confirm: " ans && [ "$$ans" = "yes" ] || (echo "Aborted."; exit 1)
	@read -p "⚠️  Keep in mind that development environment CLEARS database and injects sample data. Type 'yes' to confirm: " ans && [ "$$ans" = "yes" ] || (echo "Aborted."; exit 1)
	$(MAKE) sync-dev
	$(MAKE) env
	@echo "Starting Docker containers in background..."
	docker compose -f compose.dev.yaml up --build -d
	@echo "Waiting for PostgreSQL and Django backend to be fully ready..."
	@until docker compose -f compose.dev.yaml exec backend python manage.py check > /dev/null 2>&1; do \
		echo "Backend not ready yet... checking again in 2 seconds"; \
		sleep 2; \
	done
	@echo "Backend is ready! Running migrations and setup..."
	$(MAKE) migration-dev
	$(MAKE) migrate-dev
#	$(MAKE) superuser-auto-dev
	$(MAKE) superuser-dev
	$(MAKE) populate-dev
	$(MAKE) embed
	@echo "Setup complete! Attaching to container logs..."
	docker compose -f compose.dev.yaml logs -f

start-prod: ## Start production workflow with strict database readiness check
	@read -p "⚠️  Are you starting production environment? Type 'yes' to confirm: " ans && [ "$$ans" = "yes" ] || (echo "Aborted."; exit 1)
	@read -p "⚠️  Keep in mind that production environment injects ONLY main pages data (title, desc, dates and CTA buttons and links), doesn't erase the database.. Type 'yes' to confirm: " ans && [ "$$ans" = "yes" ] || (echo "Aborted."; exit 1)
	@echo "Starting Docker containers in background..."
	docker compose -f compose.prod.yaml up --build -d
	@echo "Waiting for PostgreSQL and Django backend to be fully ready..."
	@until docker compose -f compose.prod.yaml exec backend python manage.py check > /dev/null 2>&1; do \
		echo "Backend not ready yet... checking again in 2 seconds"; \
		sleep 2; \
	done
	@echo "Backend is ready! Running migrations and setup..."
	$(MAKE) migration-prod
	$(MAKE) migrate-prod
# 	$(MAKE) superuser-auto-prod
	$(MAKE) superuser-prod
#	$(MAKE) populate-prod
	@echo "Setup complete! Attaching to container logs..."
	docker compose -f compose.prod.yaml logs -f

sync-dev: ## Sync local code changes to dev containers (useful if you edit files outside of mounted volumes)
	cd srcs/frontend && npm install && cd ../../ && cd srcs/backend && uv sync && uv run pre-commit install && cd ../../

up-dev: ## Start development environment
	docker compose -f compose.dev.yaml up
	$(MAKE) migrate-dev


up-prod: ## Start production environment
	docker compose -f compose.prod.yaml up --build


purge: ## ⚠️  DANGER: Stop containers AND delete all volumes (database data lost)
	@read -p "|⚠️  WARNING | This will DELETE all volumes including database data. Type 'yes' to confirm: " ans && [ "$$ans" = "yes" ] || (echo "Aborted."; exit 1)
	@read -p "|⚠️  2nd WARNING | This will DELETE all volumes including database data. Type 'yes' to confirm: " ans && [ "$$ans" = "yes" ] || (echo "Aborted."; exit 1)
	@read -p "|⚠️  3rd WARNING | This will DELETE all volumes including database data. Type 'yes' to confirm: " ans && [ "$$ans" = "yes" ] || (echo "Aborted."; exit 1)
	@echo "Purging all containers and volumes..."
	docker compose -f compose.dev.yaml down -v --remove-orphans
	docker compose -f compose.prod.yaml down -v --remove-orphans

restart: ## Restart all running dev containers (no rebuild)
	docker compose -f compose.dev.yaml restart

restart-prod: ## Restart all running prod containers (no rebuild)
	docker compose -f compose.prod.yaml restart

rebuild: ## Rebuild and restart all dev containers
	docker compose -f compose.dev.yaml up --build -d
	@echo "Waiting for backend to be ready..."
	@until docker compose -f compose.dev.yaml exec backend python manage.py check > /dev/null 2>&1; do \
		echo "Backend not ready yet... retrying in 2s"; \
		sleep 2; \
	done
	$(MAKE) migrate-dev
	@echo "Rebuild complete. Use 'docker compose -f compose.dev.yaml logs -f' to follow logs."


rebuild-prod: ## Rebuild and restart all prod containers
	docker compose -f compose.prod.yaml up --build -d
	@echo "Waiting for backend to be ready..."
	@until docker compose -f compose.prod.yaml exec backend python manage.py check > /dev/null 2>&1; do \
		echo "Backend not ready yet... retrying in 2s"; \
		sleep 2; \
	done
	$(MAKE) migrate-prod
	@echo "Rebuild complete. Use 'docker compose -f compose.prod.yaml logs -f' to follow logs."

migrate-dev: ## Run database migrations in development environment
	docker compose -f compose.dev.yaml exec backend python manage.py migrate

migrate-prod: ## Run database migrations in production environment
	docker compose -f compose.prod.yaml exec backend python manage.py migrate

migrate-voice: ## Run database migrations for voice_search app
	docker compose -f compose.dev.yaml exec backend python manage.py makemigrations voice_search
	docker compose -f compose.dev.yaml exec backend python manage.py migrate

migration-dev: ## Create new database migrations in development environment
	docker compose -f compose.dev.yaml exec backend python manage.py makemigrations

migration-prod: ## Create new database migrations in production environment
	docker compose -f compose.prod.yaml exec backend python manage.py makemigrations

superuser-auto-dev: ## Auto-create default superuser from .env without prompting
	@export $$(grep -v '^#' .env | xargs) && \
	docker compose -f compose.dev.yaml exec \
		-e DJANGO_SUPERUSER_USERNAME=$$DJANGO_SUPERUSER_USERNAME \
		-e DJANGO_SUPERUSER_PASSWORD=$$DJANGO_SUPERUSER_PASSWORD \
		-e DJANGO_SUPERUSER_EMAIL=$$DJANGO_SUPERUSER_EMAIL \
		backend python manage.py createsuperuser --noinput || true

superuser-dev: ## Create a superuser in development environment (interactive)
	docker compose -f compose.dev.yaml exec backend python manage.py createsuperuser

superuser-prod: ## Create a superuser in production environment
	docker compose -f compose.prod.yaml exec backend python manage.py createsuperuser

check-dev: ## Check for any issues in development environment
	docker compose -f compose.dev.yaml exec backend python manage.py check

check-prod: ## Check for any issues in production environment
	docker compose -f compose.prod.yaml exec backend python manage.py check

backend-test-dev: ## Run backend tests in development environment
	docker compose -f compose.dev.yaml exec backend python -m pytest tests/ --log-file=/app/logs/pytest.log --log-level=DEBUG

backend-test-prod: ## Run backend tests in production environment
	docker compose -f compose.prod.yaml exec backend python -m pytest srcs/backend/tests/ --log-file=/app/logs/pytest.log --log-level=DEBUG

frontend-test: ## Run frontend tests
	cd srcs/frontend && npm run test

logs-backend-dev: ## Backend logs in development environment
	docker compose -f compose.dev.yaml exec backend tail -f /app/logs/django.log

logs-backend-prod: ## Backend logs in production environment
	docker compose -f compose.prod.yaml exec backend tail -f /app/logs/django.log

logs-pytest-dev: ## Pytest logs in development environment
	docker compose -f compose.dev.yaml exec backend cat /app/logs/pytest.log

logs-pytest-prod: ## Pytest logs in production environment
	docker compose -f compose.prod.yaml exec backend cat /app/logs/pytest.log

populate-dev: ## Populate database with sample data in development environment
	docker compose -f compose.dev.yaml exec backend python /scripts/seed_db2.py

#populate-prod: ## Populate database with main pages data in production environment
#	docker compose -f compose.prod.yaml exec backend python /scripts/seed_db_prod.py

convert: ## Convert webp/webp assets to WebP (runs from srcs/frontend)
	cd srcs/frontend && node -e "const sharp = require('sharp'); const fs = require('fs'); const path = require('path'); const dir = 'src/assets'; const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp') || f.endsWith('.webp') || f.endsWith('.jpeg')); Promise.all(files.map(f => { const input = path.join(dir, f); const output = path.join(dir, f.replace(/\.(webp|webp|jpeg)$$/,'.webp')); return sharp(input).webp({ quality: 80 }).toFile(output).then(() => console.log(f, '->', output)); })).then(() => console.log('Done!'));"

convert-clean: ## Convert webp/webp assets to WebP and delete originals (runs from srcs/frontend)
	cd srcs/frontend && node -e "const sharp = require('sharp'), fs = require('fs').promises, path = require('path'), dir = 'src/assets'; fs.readdir(dir).then(files => { const targets = files.filter(f => /\.(webp|jpe?g)$/i.test(f)); return Promise.all(targets.map(f => { const input = path.join(dir, f), output = path.join(dir, f.replace(/\.(webp|jpe?g)$/i, '.webp')); return sharp(input).webp({ quality: 80 }).toFile(output).then(() => fs.unlink(input)).then(() => console.log(`Converted & Deleted: ${f} -> ${path.basename(output)}`)); })); }).then(() => console.log('All assets successfully converted to WebP and originals deleted! 🎉')).catch(console.error);"

embed:
	docker compose -f compose.dev.yaml exec backend python manage.py embed_object

convert2:
	cd srcs/frontend && node -e " \
	const sharp = require('sharp'); \
	const fs = require('fs'); \
	const path = require('path'); \
	const dir = 'src/assets'; \
	const files = fs.readdirSync(dir).filter(f => /\.(png|jpe?g)$$/i.test(f)); \
	Promise.all(files.map(f => { \
		const input = path.join(dir, f); \
		const output = path.join(dir, f.replace(/\.(png|jpe?g)$$/i, '.webp')); \
		return sharp(input).webp({ quality: 80 }).toFile(output) \
			.then(() => { \
				fs.unlinkSync(input); \
				console.log('Converted & Deleted:', f, '->', output); \
			}); \
	})).then(() => console.log('All assets successfully converted and cleaned up!'));"
