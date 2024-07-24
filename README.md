# Denopaste

[![Denopaste](https://github.com/stephenmelnicki/denopaste/actions/workflows/ci.yml/badge.svg)](https://github.com/stephenmelnicki/denopaste/actions/workflows/ci.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/smelnicki/denopaste.svg?maxAge=604800)](https://hub.docker.com/r/smelnicki/denopaste)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A simple paste service built with [Deno](https://deno.land) &
[Fresh](https://fresh.deno.dev) 🦕🍋

<picture>
  <img
    alt="denopaste.com screenshot"
    src="https://raw.githubusercontent.com/stephenmelnicki/deno_paste/main/.readme-assets/screenshot.png"
  >
</picture>

## Quickstart

Install [deno](https://deno.com) if you haven't already. Then clone the
repository.

You can start denopaste locally via:

```
deno task start
```

This will watch the project directory and restart as necessary.

### From Docker

To run Denopaste within a container, you can use the provided
`docker-compose.yml` file.

```
docker compose up
```

When you're done, you can tear it down with:

```
docker compose down
```

If you want to run the docker image directly:

```
docker run \
  -e "DB_PATH=$DB_PATH" \
  -p 8000:8000 \
  --volume "${PWD}/data:/home/deno/denopaste/data" \
  --name denopaste \
  smelnicki/denopaste
```

### From Docker with analytics

Denopaste can use [Pirsch](https://pirsch.io) to track usage metrics.

```
DB_PATH=DB-PATH
PIRSCH_HOSTNAME=YOUR-PIRSCH-HOSTNAME
PIRSCH_TOKEN=YOUR-PIRSCH-TOKEN

docker run \
  -e "DB_PATH=$DB_PATH" \
  -e "PIRSCH_HOSTNAME=$PIRSCH_HOSTNAME" \
  -e "PIRSCH_TOKEN=$PIRSCH_TOKEN" \
  -p 8000:8000 \
  --name denopaste \
  smelnicki/denopaste
```
