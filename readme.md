# TodoList

A lightweight todo list manager with a Flask REST backend and a Vue 3 frontend — fully containerized with Docker.

## Features

- Create and delete todo lists
- Add, edit, and delete entries per list
- Responsive single-page UI (Vue 3, no build step)
- REST API documented via OpenAPI 3.0

## Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Backend  | Python 3 / Flask    |
| Frontend | Vue 3 (CDN, no bundler) |
| API Spec | OpenAPI 3.0 (YAML)  |
| Runtime  | Docker / Docker Compose |

## Getting Started

### With Docker (recommended)

```bash
docker compose up --build
```

App is available at [http://localhost:5001](http://localhost:5001).

> If port 5001 is already in use, change the host port in `docker-compose.yml`:
> ```yaml
> ports:
>   - "5001:5000"
> ```

### Without Docker

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the server:
   ```bash
   python main.py
   ```

App is available at [http://localhost:5001](http://localhost:5001).

## API Overview

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| POST   | `/todo-list`              | Create a new list            |
| GET    | `/todo-list/{list_id}`    | Get all entries of a list    |
| DELETE | `/todo-list/{list_id}`    | Delete a list and its entries|
| POST   | `/todo-list/{list_id}`    | Add an entry to a list       |
| PATCH  | `/entry/{entry_id}`       | Update an entry              |
| DELETE | `/entry/{entry_id}`       | Delete an entry              |

Full specification: [`api/openapi.yaml`](api/openapi.yaml)

## Notes

- Data is stored **in-memory** — it resets on every server restart. For persistence, a database integration (e.g. SQLite or PostgreSQL) would be needed.
