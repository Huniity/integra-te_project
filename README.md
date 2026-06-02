# integra-te_project
Official Repo for Integra-te ONG from Loulé

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

## Common Commands

| Command | Description |
|---|---|
| `make sync-dev` | Install deps and set up pre-commit hooks |
| `make start-dev` | Start the full dev environment |
| `make migrate-dev` | Run database migrations |
| `make backend-test-dev` | Run backend tests |
| `make frontend-test` | Run frontend tests |
| `make pre-commit-all` | Run pre-commit checks on all files |
| `make help` | List all available commands |
