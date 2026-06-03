# integra-te_project
Official Repo for Integra-te ONG from Loulé

[![CI](https://github.com/Huniity/integra-te_project/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/Huniity/integra-te_project/actions/workflows/ci.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.14-blue?logo=python)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-6.0-092E20?logo=django)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docs.docker.com/compose/)
[![Ruff](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json)](https://github.com/astral-sh/ruff)
[![uv](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/uv/main/assets/badge/v0.json)](https://github.com/astral-sh/uv)
[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://pre-commit.com/)


## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (with Docker Compose)
- [uv](https://docs.astral.sh/uv/getting-started/installation/)

## Getting Started

```bash
# 1. Clone the repo
git clone <repo-url>
cd integra-te_project

# 2. Install local dependencies and set up git hooks
make sync-dev

# 3. Start the development environment
make start-dev
```

`make start-dev` will:
- Start all Docker containers
- Create the `.env` file if it doesn't exist
- Run database migrations
- Prompt you to create a superuser

## Commands

### Setup

| Command | Description |
|---|---|
| `make sync-dev` | Install deps and set up pre-commit hooks |
| `make env` | Create `.env` file from defaults |
| `make requirements` | Generate `requirements.txt` from `pyproject.toml` |

### Development

| Command | Description |
|---|---|
| `make start-dev` | Full dev environment startup (build, migrate, superuser) |
| `make up-dev` | Start dev containers and run migrations |
| `make rebuild` | Rebuild and restart dev containers |
| `make restart` | Restart dev containers without rebuild |
| `make migrate-dev` | Run database migrations |
| `make migration-dev` | Create new migration files |
| `make superuser-dev` | Create a Django superuser (interactive) |
| `make check-dev` | Run Django system checks |

### Production

| Command | Description |
|---|---|
| `make start-prod` | Full production startup (build, migrate, superuser) |
| `make up-prod` | Start production containers |
| `make rebuild-prod` | Rebuild and restart production containers |
| `make restart-prod` | Restart production containers without rebuild |
| `make migrate-prod` | Run database migrations |
| `make migration-prod` | Create new migration files |
| `make superuser-prod` | Create a Django superuser (interactive) |
| `make check-prod` | Run Django system checks |

### Code Quality

| Command | Description |
|---|---|
| `make check` | Lint with ruff |
| `make format` | Format with ruff |
| `make fullCheck` | Lint + format |
| `make pre-commit-all` | Run all pre-commit hooks on every file |

### Testing

| Command | Description |
|---|---|
| `make backend-test-dev` | Run backend tests (dev) |
| `make backend-test-prod` | Run backend tests (prod) |
| `make frontend-test` | Run frontend tests |

### Logs

| Command | Description |
|---|---|
| `make logs-backend-dev` | Stream backend logs (dev) |
| `make logs-backend-prod` | Stream backend logs (prod) |
| `make logs-pytest-dev` | View pytest logs (dev) |
| `make logs-pytest-prod` | View pytest logs (prod) |

### Danger Zone

| Command | Description |
|---|---|
| `make purge` | Stop containers and delete all volumes (data lost) |
| `make convert` | Convert PNG/JPG assets to WebP |

> Run `make help` to see all available commands in the terminal.

---

## Continuous Integration

CI runs automatically via **GitHub Actions** (`.github/workflows/ci.yaml`) on every pull request targeting `main`. A PR cannot be merged until all checks pass.

### What the pipeline runs

| Step | Tool | Local equivalent |
|------|------|-----------------|
| Python lint | Ruff | `make check` |
| Python format check | Ruff | `make format` |
| Pre-commit hooks | pre-commit | `make pre-commit-all` |
| Backend tests | pytest (inside Docker) | `make backend-test-dev` |
| Frontend tests | ESLint + Vitest | `make frontend-test` |

### Before opening a PR

Run the full check suite locally to avoid a failed pipeline on your first push:

```bash
# Lint and format
make fullCheck

# Run all pre-commit hooks
make pre-commit-all

# Run all tests
make backend-test-dev
make frontend-test
```

All of the above must exit cleanly before your PR will be approved.

### Reviewing a PR

When reviewing someone else's work, the CI badge on the PR must be green before you start a code review. If it is red, leave a comment asking the author to fix the pipeline first — do not approve a PR with a failing CI run regardless of the code quality.
