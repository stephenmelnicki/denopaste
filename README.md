# Deno Paste

[![Deno Paste](https://github.com/stephenmelnicki/denopaste/actions/workflows/ci.yml/badge.svg)](https://github.com/stephenmelnicki/denopaste/actions/workflows/ci.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/smelnicki/denopaste.svg?maxAge=604800)](https://hub.docker.com/r/smelnicki/denopaste)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A plain text paste service built with [Deno](https://deno.land) and
[Fresh](https://fresh.deno.dev). 🦕🍋

<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="https://raw.githubusercontent.com/stephenmelnicki/deno_paste/main/.readme-assets/screenshot_dark.png"
  >
  <source
    media="(prefers-color-scheme: light)"
    srcset="https://raw.githubusercontent.com/stephenmelnicki/deno_paste/main/.readme-assets/screenshot.png"
  >
  <img
    alt="denopaste.com screenshot"
    src="https://raw.githubusercontent.com/stephenmelnicki/deno_paste/main/.readme-assets/screenshot.png"
  >
</picture>

## Features

- Runs in a single Docker container
- Syncs pastes to any S3-compatible cloud object storage

## Demo

[https://denopaste.com](https://denopaste.com)

## Development

You can start the local development server via:

```
deno task start
```

### From Docker

To run Deno Paste within a Docker container, mount a volume from your local
system to store the sqlite database.

```
docker run \
  -p 8000:8000 \
  --volume "${PWD}/data:/data" \
  --name denopaste \
  smelnicki/denopaste
```

You can also use the provided `docker-compose.yml` file.

```
docker compose up
```

### From Docker with data replication

If you provide settings for an azure blob storage container, Deno Paste will use
[Litestream](https://litestream.io) to replicate your data.

```
PIRSCH_HOSTNAME=YOUR-PIRSCH-HOSTNAME
PIRSCH_TOKEN=YOUR-PIRSCH-TOKEN
LITESTREAM_AZURE_ACCOUNT_KEY=YOUR-ACCESS-KEY
DB_REPLICA_URL=abs://STORAGEACCOUNT@CONTAINERNAME/PATH

docker run \
  -e "PIRSCH_HOSTNAME=${PIRSCH_HOSTNAME}"
  -e "PIRSCH_TOKEN=${PIRSCH_TOKEN}"
  -e "LITESTREAM_AZURE_ACCOUNT_KEY=$LITESTREAM_AZURE_ACCOUNT_KEY" \
  -e "DB_REPLICA_URL=$DB_REPLICA_URL" \
  -p 8000:8000 \
  --name denopaste \
  smelnicki/denopaste
```
