# Denopaste

[![Denopaste](https://github.com/stephenmelnicki/denopaste/actions/workflows/ci.yml/badge.svg)](https://github.com/stephenmelnicki/denopaste/actions/workflows/ci.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/smelnicki/denopaste.svg?maxAge=604800)](https://hub.docker.com/r/smelnicki/denopaste)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A paste service built with [Deno](https://deno.land) &
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

You can start the local development server with the following commands:

```
deno task init # only needed the first time
deno task start
```

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
  -p 8000:8000 \
  --volume "${PWD}/data:/home/deno/denopaste/data" \
  --name denopaste \
  smelnicki/denopaste
```

### From Docker with data replication

If you provide settings for an azure blob storage container, Denopaste will use
[Litestream](https://litestream.io) to replicate your data.

```
DB_PATH=DB-PATH
DB_REPLICA_URL=abs://STORAGEACCOUNT@CONTAINERNAME/PATH
LITESTREAM_AZURE_ACCOUNT_KEY=YOUR-ACCESS-KEY

docker run \
  -e "DB_PATH=$DB_PATH" \
  -e "DB_REPLICA_URL=$DB_REPLICA_URL" \
  -e "LITESTREAM_AZURE_ACCOUNT_KEY=$LITESTREAM_AZURE_ACCOUNT_KEY" \
  -p 8000:8000 \
  --name denopaste \
  smelnicki/denopaste
```

### From Docker with data replication and analyctics

In addition to azure blob storage, Denopaste will use
[Pirsch](https://pirsch.io) to track usage metrics.

```
DB_PATH=DB-PATH
DB_REPLICA_URL=abs://STORAGEACCOUNT@CONTAINERNAME/PATH
LITESTREAM_AZURE_ACCOUNT_KEY=YOUR-ACCESS-KEY
PIRSCH_HOSTNAME=YOUR-PIRSCH-HOSTNAME
PIRSCH_TOKEN=YOUR-PIRSCH-TOKEN

docker run \
  -e "LITESTREAM_AZURE_ACCOUNT_KEY=$LITESTREAM_AZURE_ACCOUNT_KEY" \
  -e "DB_REPLICA_URL=$DB_REPLICA_URL" \
  -e "PIRSCH_HOSTNAME=$PIRSCH_HOSTNAME" \
  -e "PIRSCH_TOKEN=$PIRSCH_TOKEN" \
  -p 8000:8000 \
  --name denopaste \
  smelnicki/denopaste
```
