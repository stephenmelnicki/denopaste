# Deno Paste

[![Deno Paste](https://github.com/stephenmelnicki/deno_paste/actions/workflows/ci.yml/badge.svg)](https://github.com/stephenmelnicki/deno_paste/actions/workflows/ci.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/smelnicki/denopasate.svg?maxAge=604800)](https://hub.docker.com/r/smelnicki/denopaste)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A plain text paste service built with [Deno](https://deno.land) and
[Fresh](https://fresh.deno.dev). 🦕🍋

## Features

- Runs in a single Docker container
- Syncs pastes to any S3-compatible cloud object storage

## Example

You can try it out at https://deno-paste.deno.dev

<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="https://raw.githubusercontent.com/stephenmelnicki/deno_paste/main/.readme-assets/screenshot_dark.png"
  >
  <img
    alt="screenshot"
    src="https://raw.githubusercontent.com/stephenmelnicki/deno_paste/main/.readme-assets/screenshot.png"
  >
</picture>

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

### From Docker with data replication

If you provide settings for an s3 bucket, Deno Paste will use
[Litestream](https://litestream.io) to replicate your data to s3.

```
LITESTREAM_ACCESS_KEY_ID=YOUR-ACCESS-KEY-ID
LITESTREAM_SECRET_ACCESS_KEY=YOUR-SECRET-ACCESS-KEY
LITESTREAM_REGION=YOUR-REGION 
DB_REPLICA_URL=s3://your-bucket-name/db

docker run \
  -e "LITESTREAM_ACCESS_KEY_ID=$LITESTREAM_ACCESS_KEY_ID" \
  -e "LITESTREAM_SECRET_ACCESS_KEY=$LITESTREAM_SECRET_ACCESS_KEY" \
  -e "LITESTREAM_REGION=$LITESTREAM_REGION" \
  -e "DB_REPLICA_URL=$DB_REPLICA_URL" \
  -p 8000:8000 \
  --name denopaste \
  smelnicki/denopaste
```
