<picture>
  <img
    alt="denopaste.com screenshot"
    src="https://raw.githubusercontent.com/stephenmelnicki/deno_paste/main/.readme-assets/screenshot.png"
  >
</picture>

# Denopaste

[![Denopaste](https://github.com/stephenmelnicki/denopaste/actions/workflows/ci.yml/badge.svg)](https://github.com/stephenmelnicki/denopaste/actions/workflows/ci.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/smelnicki/denopaste.svg?maxAge=604800)](https://hub.docker.com/r/smelnicki/denopaste)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A simple paste service built with [Deno](https://deno.land) 🦕 and
[Fresh](https://fresh.deno.dev) 🍋

## Getting started

Install the latest version of [deno](https://deno.land) if you haven't already.

Then clone the repository:

```sh
git clone git@github.com:stephenmelnicki/denopaste.git
```

And navigate to the new denopaste folder:

```sh
cd denopaste
```

Start the development server using the `deno task` command:

```sh
deno task start
```

Open http://localhost:8000 in your browser to view denopaste.

### From Docker

You can also run denopaste via docker:

```sh
docker run \
  -p "8000:8000" \
  --name denopaste
  smelnicki/denopaste
```
